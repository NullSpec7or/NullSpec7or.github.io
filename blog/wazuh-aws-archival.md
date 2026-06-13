---
title: "Wazuh on AWS: 90-Day Block-Based Archival Strategy"
date: 2024-11-20
tags: [SIEM, Wazuh, AWS, Blue Team]
thumbnail:
---

## Architecture Overview

After designing and deploying production Wazuh SIEM on AWS for an enterprise client, here's the archival strategy that won — **90-day block-based retention on S3**, with full SNS alerting and checksum verification.

---

## Why Block-Based Over Rolling?

Two main approaches for Wazuh log archival:

**Rolling Retention** — Delete logs older than N days continuously.

**Block-Based Archival** — Compress and archive complete 30-day blocks to S3, retain on EBS for hot access.

### The Decision Matrix

| Factor | Rolling | Block-Based |
|---|---|---|
| Cost | Lower EBS, higher ops | Higher EBS initially, lower S3 |
| Data Loss Risk | High (misconfigured deletion) | Low (S3 + checksum) |
| Forensics | Degraded after cutoff | Full fidelity blocks |
| Compliance (90-day) | Complex to verify | Simple S3 lifecycle policy |
| Ops Complexity | Medium | Low after setup |

**Winner: Block-Based** — especially for any compliance-driven environment.

---

## Stack Design

```
EC2 (Wazuh Manager)
  └── /var/ossec/logs/archives/  → EBS gp3 (hot, 30-day)
  └── /var/ossec/logs/alerts/    → EBS gp3 (hot, 90-day)
  
S3 Bucket: wazuh-archive-prod
  └── blocks/YYYY-MM/           → Compressed monthly blocks
  └── lifecycle: Glacier after 90 days

SNS Topic: wazuh-archival-alerts
  └── Email → security@company.com
  └── Lambda → SIEM dashboard
```

---

## Implementation

### 1. Monthly Archive Script

```bash
#!/bin/bash
# /opt/wazuh/scripts/archive-block.sh

MONTH=$(date -d "last month" +%Y-%m)
SOURCE="/var/ossec/logs/archives/${MONTH}"
ARCHIVE="/tmp/wazuh-${MONTH}.tar.gz"
BUCKET="s3://wazuh-archive-prod/blocks/${MONTH}/"
SNS_TOPIC="arn:aws:sns:ap-south-1:123456789:wazuh-archival-alerts"

echo "[$(date)] Starting archive for ${MONTH}"

# Compress
tar -czf "${ARCHIVE}" "${SOURCE}" 2>/dev/null
if [ $? -ne 0 ]; then
    aws sns publish \
        --topic-arn "${SNS_TOPIC}" \
        --message "FAILED: Wazuh archive compression failed for ${MONTH}" \
        --subject "Wazuh Archive FAILED"
    exit 1
fi

# Checksum
SHA256=$(sha256sum "${ARCHIVE}" | cut -d' ' -f1)
echo "${SHA256}  wazuh-${MONTH}.tar.gz" > "${ARCHIVE}.sha256"

# Upload
aws s3 cp "${ARCHIVE}" "${BUCKET}" --storage-class STANDARD_IA
aws s3 cp "${ARCHIVE}.sha256" "${BUCKET}"

# Verify post-upload
REMOTE_SIZE=$(aws s3 ls "${BUCKET}wazuh-${MONTH}.tar.gz" | awk '{print $3}')
LOCAL_SIZE=$(stat -c%s "${ARCHIVE}")

if [ "${REMOTE_SIZE}" != "${LOCAL_SIZE}" ]; then
    aws sns publish \
        --topic-arn "${SNS_TOPIC}" \
        --message "INTEGRITY FAILED: Archive size mismatch for ${MONTH}. Local: ${LOCAL_SIZE}, Remote: ${REMOTE_SIZE}" \
        --subject "Wazuh Archive INTEGRITY ALERT"
    exit 1
fi

# Success notification
aws sns publish \
    --topic-arn "${SNS_TOPIC}" \
    --message "SUCCESS: Wazuh archive for ${MONTH} uploaded. Size: ${LOCAL_SIZE} bytes. SHA256: ${SHA256}" \
    --subject "Wazuh Archive SUCCESS"

# Cleanup local source after successful upload
rm -rf "${SOURCE}"
rm -f "${ARCHIVE}" "${ARCHIVE}.sha256"

echo "[$(date)] Archive complete for ${MONTH}"
```

### 2. S3 Lifecycle Policy

```json
{
  "Rules": [
    {
      "ID": "wazuh-archive-lifecycle",
      "Status": "Enabled",
      "Filter": { "Prefix": "blocks/" },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": { "Days": 365 }
    }
  ]
}
```

### 3. Cron Schedule

```cron
# Run on 1st of every month at 02:00 UTC
0 2 1 * * /opt/wazuh/scripts/archive-block.sh >> /var/log/wazuh-archive.log 2>&1
```

---

## EBS Snapshot Automation

```bash
# Snapshot EBS before each archive cycle
VOLUME_ID="vol-0abcdef1234567890"
SNAPSHOT=$(aws ec2 create-snapshot \
    --volume-id "${VOLUME_ID}" \
    --description "Pre-archive snapshot $(date +%Y-%m-%d)" \
    --query 'SnapshotId' \
    --output text)

echo "Snapshot created: ${SNAPSHOT}"
```

---

## Cost Estimate (250GB/month)

| Component | Cost/Month |
|---|---|
| EBS gp3 (500GB hot) | ~$40 |
| S3 Standard-IA (3 months) | ~$12 |
| S3 Glacier (9 months) | ~$3 |
| Data transfer | ~$5 |
| **Total** | **~$60** |

Rolling retention with same EBS: ~$40/month, but zero forensic depth and higher compliance risk. The delta is worth it.

---

## Lessons Learned

1. Always verify checksums **after** upload, not just before
2. SNS alerts on both success AND failure — silence is suspicious
3. Keep 30 days hot on EBS for fast incident response
4. Test restoration quarterly — untested backups are not backups

---

Architecture decisions are security decisions.
