"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Shield,
  Terminal,
  Code,
  Lock,
  Eye,
  Zap,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Award,
  Cloud,
  Search,
  FileText,
  Download,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
}

const glitchVariants = {
  initial: { x: 0 },
  animate: {
    x: [0, -2, 2, -1, 1, 0],
    transition: {
      duration: 0.5,
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 3,
    },
  },
}

const matrixVariants = {
  animate: {
    y: ["-100%", "100%"],
    transition: {
      duration: 20,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    },
  },
}

// Enhanced Particle component
const Particle = ({ delay, size = 1, color = "#00ff41" }: { delay: number; size?: number; color?: string }) => (
  <motion.div
    className="absolute rounded-full"
    initial={{ opacity: 0, y: -10 }}
    animate={{
      opacity: [0, 1, 0],
      y: ["0vh", "100vh"],
      x: [0, Math.random() * 20 - 10],
    }}
    transition={{
      duration: Math.random() * 3 + 2,
      repeat: Number.POSITIVE_INFINITY,
      delay: delay,
      ease: "linear",
    }}
    style={{
      left: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
    }}
  />
)

// Binary code component for loading screen
const BinaryRain = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden opacity-20">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 text-green-500 text-xs whitespace-nowrap binary-column"
          style={{
            left: `${(i / 20) * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }}
        >
          {Array.from({ length: 50 }).map((_, j) => (
            <div key={j} style={{ animationDelay: `${Math.random() * 2}s` }}>
              {Math.random() > 0.5 ? "1" : "0"}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Enhanced Loading screen component with more effects and longer duration
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing penetration testing suite...")
  const [glitchActive, setGlitchActive] = useState(false)
  const [bootSequence, setBootSequence] = useState<string[]>([])
  const [currentPhase, setCurrentPhase] = useState(0)
  const [scanlinePosition, setScanlinePosition] = useState(0)
  const [matrixIntensity, setMatrixIntensity] = useState(0.2)
  const [systemStatus, setSystemStatus] = useState("INITIALIZING")

  useEffect(() => {
    const bootMessages = [
      "Initializing penetration testing suite...",
      "Loading security frameworks...",
      "Mounting encrypted file systems...",
      "Initializing kernel security modules...",
      "Loading cryptographic libraries...",
      "Starting secure boot sequence...",
      "Verifying digital signatures...",
      "Establishing secure memory allocation...",
      "Loading hardware abstraction layer...",
      "Initializing network stack...",
      "Starting secure connection protocols...",
      "Configuring firewall rules...",
      "Loading VPN tunnel modules...",
      "Secure connection established.",
      "Initializing network interface controllers...",
      "Loading packet capture drivers...",
      "Configuring network monitoring...",
      "Starting Nmap network scanner v7.94...",
      "Loading Nmap script engine...",
      "Initializing port scanning modules...",
      "Loading vulnerability detection scripts...",
      "Nmap ready - network reconnaissance enabled.",
      "Starting Java Virtual Machine...",
      "Loading Java security providers...",
      "Initializing SSL/TLS libraries...",
      "Loading Burp Suite Professional v2023.12...",
      "Starting Burp proxy engine...",
      "Loading web application scanner...",
      "Configuring intruder modules...",
      "Burp Suite proxy initialized on port 8080.",
      "Loading Metasploit framework v6.3.57...",
      "Initializing exploit database...",
      "Loading payload generators...",
      "Starting auxiliary modules...",
      "Configuring post-exploitation tools...",
      "Metasploit database connected.",
      "Starting Wireshark packet analyzer v4.2.0...",
      "Loading protocol dissectors...",
      "Initializing capture interfaces...",
      "Loading network analysis plugins...",
      "Configuring deep packet inspection...",
      "Wireshark ready - packet capture enabled.",
      "Installing Python security libraries...",
      "Loading requests and urllib3 modules...",
      "Initializing BeautifulSoup parser...",
      "Loading SQLmap injection toolkit v1.7.11...",
      "Starting database fingerprinting...",
      "Loading injection techniques...",
      "Configuring tamper scripts...",
      "SQLmap database engines loaded.",
      "Starting Nikto web scanner v2.5.0...",
      "Loading vulnerability signatures database...",
      "Initializing web crawling engine...",
      "Loading plugin modules...",
      "Configuring scan policies...",
      "Nikto ready - web vulnerability scanning enabled.",
      "Initializing OWASP ZAP proxy v2.14.0...",
      "Loading spider automation...",
      "Starting active scanner modules...",
      "Configuring passive scan rules...",
      "Loading fuzzing dictionaries...",
      "ZAP spider and scanner modules loaded.",
      "Loading custom exploit frameworks...",
      "Initializing buffer overflow modules...",
      "Loading privilege escalation tools...",
      "Starting reverse shell generators...",
      "Configuring persistence mechanisms...",
      "Preparing penetration testing environment...",
      "Loading reconnaissance automation...",
      "Initializing OSINT gathering tools...",
      "Starting social engineering toolkit...",
      "Loading phishing campaign modules...",
      "Configuring credential harvesting...",
      "Initializing payload delivery systems...",
      "Loading anti-forensics modules...",
      "Starting steganography tools...",
      "Configuring covert channels...",
      "Loading privilege escalation database...",
      "Initializing lateral movement tools...",
      "Starting vulnerability assessment engine...",
      "Loading CVE database updates...",
      "Configuring automated scanning...",
      "Loading zero-day exploit repository...",
      "Initializing advanced persistent threat simulation...",
      "Starting red team operation tools...",
      "Configuring command and control servers...",
      "Loading threat intelligence feeds...",
      "Preparing advanced attack vectors...",
      "Environment setup complete.",
      "All security tools loaded and operational.",
      "System ready for penetration testing operations.",
      "Welcome to the cyber warfare suite, Null Spec7or.",
    ]

    let messageIndex = 0
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.25 // Slower increment for more messages (80 intervals = 5 seconds)
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onComplete()
          }, 500)
          return 100
        }
        return next
      })

      // Add boot sequence messages more frequently
      if (messageIndex < bootMessages.length && Math.random() > 0.2) {
        // Even more frequent messages
        setBootSequence((prev) => [...prev, bootMessages[messageIndex]])
        setLoadingText(bootMessages[messageIndex])
        messageIndex++
      }

      // Random glitch effect
      if (Math.random() > 0.7) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      }
    }, 62.5) // Adjusted timing for 5 seconds total (62.5ms * 80 = 5000ms)

    return () => {
      clearInterval(interval)
    }
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BinaryRain />

      <div className="relative z-10 w-full max-w-3xl px-4">
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            filter: glitchActive
              ? [
                  "hue-rotate(0deg)",
                  "hue-rotate(90deg)",
                  "hue-rotate(180deg)",
                  "hue-rotate(270deg)",
                  "hue-rotate(0deg)",
                ]
              : ["hue-rotate(0deg)"],
          }}
          transition={{
            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
            filter: { duration: 0.3, ease: "easeInOut" },
          }}
          className={`text-center mb-8 ${glitchActive ? "text-glitch" : ""}`}
        >
          <motion.h1
            className="text-5xl sm:text-7xl font-bold text-green-400 mb-4 cyber-glitch-text"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              textShadow: glitchActive
                ? [
                    "0 0 10px rgba(0, 255, 65, 0.8)",
                    "-2px 0 #ff00ff, 2px 2px #00ffff",
                    "2px -2px #ff00ff, -2px 2px #00ffff",
                    "0 0 10px rgba(0, 255, 65, 0.8)",
                  ]
                : ["0 0 10px rgba(0, 255, 65, 0.8)"],
            }}
            transition={{
              opacity: { duration: 0.8 },
              textShadow: { duration: 0.2, ease: "easeInOut" },
            }}
          >
            Null Spec7or
          </motion.h1>
          <motion.div
            className="text-cyan-400 text-xl sm:text-2xl"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: glitchActive ? [-2, 2, -1, 1, 0] : [0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.3 },
              x: { duration: 0.1, ease: "easeInOut" },
            }}
          >
            Penetration Tester & Bug Hunter
          </motion.div>
        </motion.div>
        <div className="space-y-6">
          <div className="terminal-window loading-terminal">
            <div className="terminal-header">
              <div className="flex space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="w-4 h-4 bg-red-500 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.1 }}
                  className="w-4 h-4 bg-yellow-500 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                  className="w-4 h-4 bg-green-500 rounded-full"
                ></motion.div>
              </div>
              <div className="text-lg">root@nullspec7or:~$</div>
            </div>
            <div className="terminal-content p-6">
              <motion.div
                className={`text-green-400 text-xl mb-4 ${glitchActive ? "text-glitch" : ""}`}
                animate={{
                  opacity: [1, 0.8, 1],
                  x: glitchActive ? [-1, 1, -1, 1, 0] : [0],
                }}
                transition={{
                  opacity: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
                  x: { duration: 0.15, ease: "easeInOut" },
                }}
              >
                {loadingText}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                >
                  _
                </motion.span>
              </motion.div>
              <div className="mt-6 relative">
                <motion.div
                  className="h-3 bg-black/50 rounded-full overflow-hidden border border-green-400/30"
                  animate={{
                    boxShadow: glitchActive
                      ? [
                          "0 0 5px rgba(0, 255, 65, 0.5)",
                          "0 0 15px rgba(255, 0, 255, 0.7)",
                          "0 0 10px rgba(0, 255, 255, 0.6)",
                          "0 0 5px rgba(0, 255, 65, 0.5)",
                        ]
                      : ["0 0 5px rgba(0, 255, 65, 0.5)"],
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                    style={{ width: `${progress}%` }}
                    initial={{ width: "0%" }}
                    animate={{
                      background: glitchActive
                        ? [
                            "linear-gradient(to right, #00ff41, #00ffff)",
                            "linear-gradient(to right, #ff00ff, #00ff41)",
                            "linear-gradient(to right, #00ffff, #ff00ff)",
                            "linear-gradient(to right, #00ff41, #00ffff)",
                          ]
                        : ["linear-gradient(to right, #00ff41, #00ffff)"],
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
                <div className="mt-2 flex justify-between text-base text-green-400/70">
                  <span>0%</span>
                  <span>{Math.round(progress)}%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="mt-6 text-base text-cyan-400/70 console-output max-h-32 overflow-y-auto">
                {bootSequence.map((message, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      x: glitchActive && Math.random() > 0.8 ? [-1, 1, 0] : [0],
                    }}
                    transition={{
                      opacity: { delay: i * 0.05 },
                      y: { delay: i * 0.05 },
                      x: { duration: 0.1 },
                    }}
                    className={`mb-1 ${Math.random() > 0.9 ? "text-red-400" : ""}`}
                  >
                    {`> ${message}`}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            className="text-center text-base text-green-400/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: glitchActive ? [1, 1.05, 1] : [1],
              }}
              transition={{
                opacity: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
                scale: { duration: 0.2 },
              }}
              className="flex items-center justify-center space-x-2"
            >
              <motion.div
                animate={{
                  rotate: glitchActive ? [0, 180, 360] : [0],
                }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle className="w-5 h-5" />
              </motion.div>
              <span>SECURE CONNECTION ESTABLISHED</span>
              <motion.div
                animate={{
                  rotate: glitchActive ? [0, -180, -360] : [0],
                }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Digital noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 noise-overlay"></div>

      {/* Scan lines */}
      <div className="fixed inset-0 pointer-events-none z-10 scanlines"></div>
    </motion.div>
  )
}

// Add a new state to track when to start the typewriter animation
const CybersecurityPortfolio = () => {
  const [startTypewriter, setStartTypewriter] = useState(false)
  const [currentText, setCurrentText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const typewriterTexts = [
    "> Booting up...",
    "> Starting secure connection...",
    "> Secure connection established.",
    "> Identity confirmed. Please :)",
  ]

  const navItems = ["home", "about", "experience", "projects", "resume", "blog", "contact"]

  useEffect(() => {
    // Simulate initial page load
    const initialTimer = setTimeout(() => {
      setInitialLoadComplete(true)
    }, 1000) // 1 second delay before showing loading screen

    setIsLoaded(true)
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  // Add a new useEffect to handle the 10-second delay after loading screen completes
  useEffect(() => {
    if (!showLoadingScreen) {
      const typewriterDelay = setTimeout(() => {
        setStartTypewriter(true)
      }, 10000) // 10 seconds delay

      return () => clearTimeout(typewriterDelay)
    }
  }, [showLoadingScreen])

  useEffect(() => {
    if (!showLoadingScreen && startTypewriter) {
      // Only start typewriter after loading is complete and delay has passed
      if (currentIndex < typewriterTexts.length) {
        const targetText = typewriterTexts[currentIndex]
        if (currentText.length < targetText.length) {
          const timeout = setTimeout(() => {
            setCurrentText(targetText.slice(0, currentText.length + 1))
          }, 67)
          return () => clearTimeout(timeout)
        } else {
          const timeout = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1)
            setCurrentText("")
          }, 1000)
          return () => clearTimeout(timeout)
        }
      }
    }
  }, [currentText, currentIndex, typewriterTexts, showLoadingScreen, startTypewriter])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  // Show loading screen only after initial load is complete
  if (!initialLoadComplete) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-2xl font-mono">
          Loading...
        </motion.div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {showLoadingScreen ? (
        <LoadingScreen onComplete={() => setShowLoadingScreen(false)} />
      ) : (
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-screen bg-black text-green-400 font-mono overflow-x-hidden"
        >
          {/* Enhanced Matrix Rain Background */}
          <div className="fixed inset-0 z-0">
            <motion.div className="matrix-rain" variants={matrixVariants} animate="animate">
              {Array.from({ length: 30 }).map((_, i) => (
                <Particle key={i} delay={i * 0.1} />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <Particle key={`large-${i}`} delay={i * 0.2} size={2} color="#00ffff" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <Particle key={`xl-${i}`} delay={i * 0.3} size={3} color="#ff00ff" />
              ))}
            </motion.div>
          </div>

          {/* Digital noise overlay */}
          <div className="fixed inset-0 pointer-events-none z-1 noise-overlay opacity-10"></div>

          {/* Scan lines */}
          <div className="fixed inset-0 pointer-events-none z-1 scanlines opacity-20"></div>

          {/* Enhanced Responsive Navigation */}
          <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-green-400/20"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <motion.div
                  variants={glitchVariants}
                  initial="initial"
                  animate="animate"
                  className="text-lg sm:text-xl font-bold cyber-glitch-text"
                >
                  [Null Spec7or]
                </motion.div>

                {/* Desktop Navigation */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="hidden lg:flex space-x-6"
                >
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item}
                      variants={itemVariants}
                      whileHover={{ scale: 1.1, color: "#00ffff" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => scrollToSection(item)}
                      className="hover:text-cyan-400 transition-colors duration-300 uppercase tracking-wider text-sm"
                    >
                      {item}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Mobile Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden text-green-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
              </div>

              {/* Mobile Navigation Menu */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:hidden mt-4 pb-4 border-t border-green-400/20"
                  >
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col space-y-3 pt-4"
                    >
                      {navItems.map((item, index) => (
                        <motion.button
                          key={item}
                          variants={itemVariants}
                          whileHover={{ x: 10, color: "#00ffff" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => scrollToSection(item)}
                          className="text-left hover:text-cyan-400 transition-colors duration-300 uppercase tracking-wider text-sm py-2"
                        >
                          {"> " + item}
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>

          {/* Enhanced Responsive Hero Section */}
          <motion.section
            id="home"
            style={{ y, opacity }}
            className="min-h-screen flex items-center justify-center relative z-10 px-4"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-6 sm:space-y-8 w-full max-w-4xl"
            >
              <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="terminal-window">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="terminal-header"
                >
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="w-3 h-3 bg-red-500 rounded-full"
                    ></motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                      className="w-3 h-3 bg-yellow-500 rounded-full"
                    ></motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                      className="w-3 h-3 bg-green-500 rounded-full"
                    ></motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-xs sm:text-sm"
                  >
                    root@nullspec7or:~$
                  </motion.div>
                </motion.div>
                <div className="terminal-content">
                  <div className="h-24 sm:h-32 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {typewriterTexts.slice(0, currentIndex).map((text, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="text-green-400 mb-1 sm:mb-2 text-sm sm:text-base"
                        >
                          {text}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <motion.div className="text-green-400 text-sm sm:text-base">
                      {currentText}
                      <motion.span animate={{ opacity: showCursor ? 1 : 0 }} transition={{ duration: 0.1 }}>
                        █
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  onClick={() => scrollToSection("about")}
                  className="glitch-button bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-bold uppercase tracking-wider"
                >
                  <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Access Portfolio
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Enhanced About Section */}
          <AnimatedSection id="about" className="py-12 sm:py-20 relative z-10">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center cyber-glitch-text"
              >
                [DECRYPTED_BIO]
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-black/50 border-green-400/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-500">
                  <CardContent className="p-4 sm:p-8">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="console-text"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.7 }}
                        viewport={{ once: true }}
                        className="text-cyan-400 mb-4 overflow-hidden whitespace-nowrap text-sm sm:text-base"
                      >
                        {"> cat personal_info.txt"}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        viewport={{ once: true }}
                        className="text-green-300 leading-relaxed text-sm sm:text-base"
                      >
                        I am a Cybersecurity and Digital Forensics professional with a B.Tech in Computer Science and
                        Engineering from VIT Bhopal. Currently serving as a Jr. IT Security Engineer at Toucan Payments,
                        I focus on safeguarding both our innovative fintech products and internal infrastructure. My
                        role combines my passion for cybersecurity with a commitment to securing critical systems and
                        networks.
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.5 }}
                        viewport={{ once: true }}
                        className="text-cyan-400 mt-4 text-sm sm:text-base"
                      >
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        >
                          {"> EOF"}
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Enhanced Experience Section */}
          <AnimatedSection id="experience" className="py-12 sm:py-20 relative z-10">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center cyber-glitch-text"
              >
                [SECURITY_LOGS]
              </motion.h2>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-6xl mx-auto space-y-6 sm:space-y-8"
              >
                {/* Experience Entries - Easily expandable */}
                {[
                  {
                    id: "current-role",
                    icon: Shield,
                    iconColor: "text-green-400",
                    borderColor: "border-green-400/30",
                    hoverBorderColor: "hover:border-cyan-400/50",
                    title: "Toucan Payments – Jr. IT Security Engineer",
                    titleColor: "text-cyan-400",
                    period: "2024 - Present",
                    responsibilities: [
                      { icon: Terminal, text: "Conducted app security scans and vulnerability assessments" },
                      { icon: Search, text: "Performed security testing using Qualys" },
                      { icon: Cloud, text: "Assessed AWS & GCP environments" },
                      { icon: Lock, text: "IAM policy audits & monitoring" },
                      { icon: Zap, text: "Patch status checks via WSUS" },
                      { icon: Code, text: "Disaster recovery testing with DevOps" },
                    ],
                  },
                  // Placeholder for future experience 2
                  {
                    id: "future-role-2",
                    icon: Code,
                    iconColor: "text-purple-400",
                    borderColor: "border-purple-400/30",
                    hoverBorderColor: "hover:border-purple-400/50",
                    title: "Previous Experience #2",
                    titleColor: "text-purple-400",
                    period: "Coming Soon",
                    responsibilities: [
                      { icon: Terminal, text: "Experience details will be added here" },
                      { icon: Search, text: "More achievements to showcase" },
                      { icon: Cloud, text: "Additional technical skills" },
                    ],
                    isPlaceholder: true,
                  },
                  // Placeholder for future experience 3
                  {
                    id: "future-role-3",
                    icon: Lock,
                    iconColor: "text-cyan-400",
                    borderColor: "border-cyan-400/30",
                    hoverBorderColor: "hover:border-cyan-400/50",
                    title: "Previous Experience #3",
                    titleColor: "text-cyan-400",
                    period: "Coming Soon",
                    responsibilities: [
                      { icon: Terminal, text: "More professional experience" },
                      { icon: Search, text: "Additional accomplishments" },
                      { icon: Cloud, text: "Further technical expertise" },
                    ],
                    isPlaceholder: true,
                  },
                ].map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    variants={itemVariants}
                    className={experience.isPlaceholder ? "opacity-40" : ""}
                  >
                    <Card
                      className={`bg-black/50 ${experience.borderColor} backdrop-blur-sm ${experience.hoverBorderColor} transition-all duration-500 group`}
                    >
                      <CardContent className="p-4 sm:p-8">
                        <motion.div
                          whileHover={{ x: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4"
                        >
                          <motion.div
                            animate={experience.isPlaceholder ? {} : { rotate: 360 }}
                            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="self-center sm:self-start"
                          >
                            <experience.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${experience.iconColor} mt-1`} />
                          </motion.div>
                          <div className="flex-1 text-center sm:text-left">
                            <motion.h3
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.6 }}
                              viewport={{ once: true }}
                              className={`text-lg sm:text-2xl font-bold ${experience.titleColor} mb-2`}
                            >
                              {experience.title}
                            </motion.h3>
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              viewport={{ once: true }}
                              className="text-green-300/70 text-sm mb-4"
                            >
                              {experience.period}
                            </motion.div>
                            <motion.div
                              variants={containerVariants}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true }}
                              className="space-y-2 text-green-300"
                            >
                              {experience.responsibilities.map((item, respIndex) => (
                                <motion.div
                                  key={respIndex}
                                  variants={itemVariants}
                                  whileHover={experience.isPlaceholder ? {} : { x: 10, color: "#00ffff" }}
                                  className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
                                >
                                  <item.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span>{item.text}</span>
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Enhanced Projects Section */}
          <AnimatedSection id="projects" className="py-12 sm:py-20 relative z-10">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center cyber-glitch-text"
              >
                [PROJECT_VAULT]
              </motion.h2>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-6xl mx-auto"
              >
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                >
                  {/* Project Cards - Easily expandable to 3 projects */}
                  {[
                    {
                      id: "project-1",
                      title: "Vulnerability Scanner Pro",
                      description:
                        "Advanced automated vulnerability scanning tool with custom exploit detection and comprehensive reporting capabilities..",
                      image: "/placeholder.svg?height=200&width=400",
                      githubUrl: "https://github.com/nullspec7or/vulnerability-scanner",
                      status: "active",
                      tech: ["Python", "Nmap", "SQLmap"],
                    },
                    {
                      id: "project-2",
                      title: "Network Penetration Suite",
                      description:
                        "Complete network penetration testing framework with automated reconnaissance and exploitation modules..",
                      image: "/placeholder.svg?height=200&width=400",
                      githubUrl: "https://github.com/nullspec7or/network-pentest",
                      status: "active",
                      tech: ["Python", "Metasploit", "Wireshark"],
                    },
                    {
                      id: "project-3",
                      title: "Cyber Threat Intelligence",
                      description:
                        "Real-time threat intelligence platform aggregating global security feeds with automated analysis and alerting..",
                      image: "/placeholder.svg?height=200&width=400",
                      githubUrl: "https://github.com/nullspec7or/threat-intel",
                      status: "active",
                      tech: ["Node.js", "React", "MongoDB"],
                    },
                  ].map((project, index) => (
                    <motion.div
                      key={project.id}
                      variants={itemVariants}
                      whileHover={{ y: -10, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-black/50 border-green-400/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-500 group overflow-hidden">
                        <CardContent className="p-0">
                          {/* Project Image Banner */}
                          <motion.div
                            className="relative overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              className="w-full h-48 object-cover border-b border-green-400/20"
                            />
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            <motion.div
                              className="absolute top-4 right-4 flex space-x-2"
                              initial={{ opacity: 0, y: -10 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {project.tech.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 bg-black/70 text-green-400 text-xs rounded border border-green-400/30"
                                >
                                  {tech}
                                </span>
                              ))}
                            </motion.div>
                          </motion.div>

                          {/* Project Content */}
                          <div className="p-6">
                            <motion.h3
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.6 }}
                              viewport={{ once: true }}
                              className="text-xl font-bold text-cyan-400 mb-3 group-hover:text-green-400 transition-colors duration-300"
                            >
                              {project.title}
                            </motion.h3>

                            <motion.p
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              viewport={{ once: true }}
                              className="text-green-300/80 text-sm leading-relaxed mb-4"
                            >
                              {project.description}
                            </motion.p>

                            {/* GitHub Link */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.4 }}
                              viewport={{ once: true }}
                            >
                              <motion.a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05, x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center space-x-2 text-green-400 hover:text-cyan-400 transition-colors duration-300 text-sm font-medium"
                              >
                                <Github className="w-4 h-4" />
                                <span>View on GitHub</span>
                                <motion.div
                                  animate={{ x: [0, 3, 0] }}
                                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </motion.div>
                              </motion.a>
                            </motion.div>

                            {/* Status Indicator */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ duration: 0.6, delay: 0.6 }}
                              viewport={{ once: true }}
                              className="mt-4 pt-4 border-t border-green-400/20"
                            >
                              <div className="flex items-center space-x-2">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                  className="w-2 h-2 bg-green-400 rounded-full"
                                />
                                <span className="text-green-400/70 text-xs uppercase tracking-wider">
                                  {project.status === "active" ? "Active Development" : "Completed"}
                                </span>
                              </div>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Projects Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="mt-12 text-center"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                    viewport={{ once: true }}
                    className="text-cyan-400 mb-4 overflow-hidden whitespace-nowrap mx-auto max-w-md text-sm sm:text-base"
                  >
                    {"> Repository status: All systems operational"}
                  </motion.div>
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-400">3</div>
                      <div className="text-xs text-green-300/70">Active Projects</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-cyan-400">9</div>
                      <div className="text-xs text-green-300/70">Technologies</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-purple-400">∞</div>
                      <div className="text-xs text-green-300/70">Possibilities</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Enhanced Security Research & Achievements */}
          <AnimatedSection id="achievements" className="py-12 sm:py-20 relative z-10">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center cyber-glitch-text"
              >
                [ACHIEVEMENT_VAULT]
              </motion.h2>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-6xl mx-auto space-y-6 sm:space-y-8"
              >
                {/* Security Research Achievements */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-black/50 border-purple-400/30 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-500">
                    <CardContent className="p-4 sm:p-8">
                      <motion.div
                        whileHover={{ x: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="self-center sm:self-start"
                        >
                          <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mt-1" />
                        </motion.div>
                        <div className="flex-1 text-center sm:text-left">
                          <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-lg sm:text-2xl font-bold text-purple-400 mb-4"
                          >
                            Security Research & Hall of Fame
                          </motion.h3>
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-green-300 mb-6 text-sm sm:text-base"
                          >
                            Reported vulnerabilities and recognized achievements:
                          </motion.div>

                          {/* Achievement Grid - Expandable to 10+ entries */}
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                          >
                            {[
                              // Current achievements
                              {
                                name: "US Department of Energy (HOF)",
                                url: "https://www.energy.gov/",
                                type: "vulnerability",
                                status: "achieved",
                              },
                              {
                                name: "Indian Army (HOF)",
                                url: "https://indianarmy.nic.in/",
                                type: "vulnerability",
                                status: "achieved",
                              },
                              {
                                name: "Indian Air Force (HOF)",
                                url: "https://indianairforce.nic.in/",
                                type: "vulnerability",
                                status: "achieved",
                              },
                              {
                                name: "CERT France (HOF)",
                                url: "https://www.cert.ssi.gouv.fr/",
                                type: "vulnerability",
                                status: "achieved",
                              },
                              {
                                name: "Vellore Institute of Technology (Bhopal)",
                                url: "https://vitbhopal.ac.in/",
                                type: "education",
                                status: "achieved",
                              },
                              // Placeholder slots for future achievements (5 more to make 10 total)
                              {
                                name: "Achievement Slot #6",
                                url: "#",
                                type: "placeholder",
                                status: "coming-soon",
                              },
                              {
                                name: "Achievement Slot #7",
                                url: "#",
                                type: "placeholder",
                                status: "coming-soon",
                              },
                              {
                                name: "Achievement Slot #8",
                                url: "#",
                                type: "placeholder",
                                status: "coming-soon",
                              },
                              {
                                name: "Achievement Slot #9",
                                url: "#",
                                type: "placeholder",
                                status: "coming-soon",
                              },
                              {
                                name: "Achievement Slot #10",
                                url: "#",
                                type: "placeholder",
                                status: "coming-soon",
                              },
                            ].map((achievement, index) => (
                              <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={achievement.status === "achieved" ? { scale: 1.05, x: 10 } : {}}
                                className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border transition-all duration-300 ${
                                  achievement.status === "achieved"
                                    ? "border-green-400/30 hover:border-cyan-400/50 bg-black/30"
                                    : "border-gray-600/30 bg-black/10 opacity-40"
                                }`}
                              >
                                <motion.div
                                  animate={achievement.status === "achieved" ? { scale: [1, 1.2, 1] } : {}}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                                >
                                  {achievement.type === "education" ? (
                                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
                                  ) : achievement.type === "vulnerability" ? (
                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
                                  ) : (
                                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                  )}
                                </motion.div>
                                {achievement.status === "achieved" ? (
                                  <a
                                    href={achievement.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-300 hover:text-cyan-400 transition-colors duration-300 text-xs sm:text-sm"
                                  >
                                    {achievement.name}
                                  </a>
                                ) : (
                                  <span className="text-gray-500 text-xs sm:text-sm">{achievement.name}</span>
                                )}
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Achievement Stats */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            viewport={{ once: true }}
                            className="mt-6 pt-6 border-t border-purple-400/20"
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                              <div className="space-y-1">
                                <div className="text-2xl font-bold text-purple-400">5</div>
                                <div className="text-xs text-green-300/70">Achievements</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-2xl font-bold text-cyan-400">2</div>
                                <div className="text-xs text-green-300/70">Military</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-2xl font-bold text-yellow-400">2</div>
                                <div className="text-xs text-green-300/70">Government</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-2xl font-bold text-green-400">1</div>
                                <div className="text-xs text-green-300/70">Organization</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-2xl font-bold text-red-400">1</div>
                                <div className="text-xs text-green-300/70">Education</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-2xl font-bold text-orange-400">5</div>
                                <div className="text-xs text-green-300/70">More Coming</div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Resume Section */}
          <AnimatedSection id="resume" className="py-12 sm:py-20 relative z-10">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center cyber-glitch-text"
              >
                [RESUME_ACCESS]
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto text-center"
              >
                <Card className="bg-black/50 border-green-400/30 backdrop-blur-sm hover:border-green-400/50 transition-all duration-500">
                  <CardContent className="p-6 sm:p-8">
                    <motion.div
                      animate={{
                        rotateY: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="mb-6"
                    >
                      <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="text-xl sm:text-2xl font-bold text-green-400 mb-4"
                    >
                      Professional Resume
                    </motion.h3>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="text-cyan-400 mb-4 overflow-hidden whitespace-nowrap text-sm sm:text-base"
                    >
                      {"> Accessing secure document vault..."}
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      viewport={{ once: true }}
                      className="text-green-300 mb-6 text-sm sm:text-base"
                    >
                      Download my complete professional resume with detailed experience, certifications, and technical
                      skills in cybersecurity and digital forensics.
                    </motion.p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="space-y-4">
                      <Button
                        asChild
                        className="glitch-button bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-6 py-3 font-bold uppercase tracking-wider w-full sm:w-auto"
                      >
                        <a
                          href="https://drive.google.com/file/d/YOUR_GOOGLE_DRIVE_FILE_ID/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Resume</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </motion.div>
                        </a>
                      </Button>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        viewport={{ once: true }}
                        className="text-green-400/70 text-xs sm:text-sm"
                      >
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          {"> Secure PDF format | Last updated: 2024"}
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Enhanced Blog Link Section */}
          <AnimatedSection id="blog" className="py-12 sm:py-20 relative z-10">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center cyber-glitch-text"
              >
                [LOG_ARCHIVE]
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto text-center"
              >
                <Card className="bg-black/50 border-cyan-400/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-500">
                  <CardContent className="p-6 sm:p-8">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Terminal className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 mx-auto mb-4" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4"
                    >
                      External Node Connection
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="text-green-300 mb-6 text-sm sm:text-base"
                    >
                      Access my technical blog for in-depth cybersecurity research, tutorials, and threat analysis.
                    </motion.p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        asChild
                        className="glitch-button bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-6 py-3 font-bold uppercase tracking-wider w-full sm:w-auto"
                      >
                        <a
                          href="https://yourblog.github.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center space-x-2"
                        >
                          📂 <span>Access External Blog</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </motion.div>
                        </a>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Enhanced Contact Section */}
          <AnimatedSection id="contact" className="py-12 sm:py-20 relative z-10">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center cyber-glitch-text"
              >
                [SECURE_COMM]
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto"
              >
                <Card className="bg-black/50 border-green-400/30 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-8">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1 }}
                      viewport={{ once: true }}
                      className="text-cyan-400 mb-6 overflow-hidden whitespace-nowrap text-sm sm:text-base"
                    >
                      {"> Initializing encrypted communication..."}
                    </motion.div>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <motion.div variants={itemVariants}>
                        <Input
                          placeholder="Your Name"
                          id="contact-name"
                          className="bg-black/50 border-green-400/50 text-green-400 placeholder-green-400/50 focus:border-cyan-400 transition-all duration-300 text-sm sm:text-base"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Input
                          placeholder="Subject"
                          id="contact-subject"
                          className="bg-black/50 border-green-400/50 text-green-400 placeholder-green-400/50 focus:border-cyan-400 transition-all duration-300 text-sm sm:text-base"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Textarea
                          placeholder="Your Message"
                          id="contact-message"
                          rows={4}
                          className="bg-black/50 border-green-400/50 text-green-400 placeholder-green-400/50 focus:border-cyan-400 resize-none transition-all duration-300 text-sm sm:text-base"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => {
                            const name =
                              (document.getElementById("contact-name") as HTMLInputElement)?.value || "Anonymous"
                            const subject =
                              (document.getElementById("contact-subject") as HTMLInputElement)?.value ||
                              "Contact from Portfolio"
                            const message =
                              (document.getElementById("contact-message") as HTMLTextAreaElement)?.value || ""

                            const emailBody = `Hello Null Spec7or,

${message}

Best regards,
${name}`

                            const mailtoLink = `mailto:nullspec7or@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
                            window.open(mailtoLink)
                          }}
                          className="w-full glitch-button bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black py-2 sm:py-3 font-bold uppercase tracking-wider text-sm sm:text-base"
                        >
                          <motion.span className="flex items-center justify-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Send Encrypted Message</span>
                          </motion.span>
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-green-400/20"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.7 }}
                        viewport={{ once: true }}
                        className="text-cyan-400 mb-4 overflow-hidden whitespace-nowrap text-sm sm:text-base"
                      >
                        {"> Social Network Nodes:"}
                      </motion.div>
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex justify-center space-x-4 sm:space-x-6"
                      >
                        {[
                          { icon: Github, tooltip: "GitHub Terminal", href: "#" },
                          { icon: Linkedin, tooltip: "LinkedIn Profile", href: "#" },
                          { icon: Mail, tooltip: "Secure Email", href: "mailto:nullspec7or@gmail.com" },
                        ].map((social, index) => (
                          <motion.a
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.2, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            href={social.href}
                            className="social-icon group relative"
                          >
                            <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            <motion.span
                              initial={{ opacity: 0, y: 10 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              className="tooltip"
                            >
                              {social.tooltip}
                            </motion.span>
                          </motion.a>
                        ))}
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Enhanced Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-6 sm:py-8 border-t border-green-400/20 relative z-10"
          >
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 2 }}
                viewport={{ once: true }}
                className="text-green-400/70 overflow-hidden whitespace-nowrap mx-auto max-w-md text-sm sm:text-base"
              >
                {"> System secured. Connection terminated."}{" "}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  █
                </motion.span>
              </motion.div>
            </div>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Animated Section Component
function AnimatedSection({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  )
}

export default CybersecurityPortfolio
