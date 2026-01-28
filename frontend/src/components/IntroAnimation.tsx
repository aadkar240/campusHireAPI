import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Building2, Sparkles, ArrowRight, CheckCircle2, Target, TrendingUp, Brain, Users, BarChart3, Shield, User, MessageSquare, Briefcase, GraduationCap, Eye, Rocket, Lock, Clock, CheckCircle, FileText, BarChart, Search } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import AnimatedBackground from './AnimatedBackground'

// Rolling Number Component
function RollingNumber({ value, suffix = '', duration = 2, decimals = 0 }: { value: number, suffix?: string, duration?: number, decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  useEffect(() => {
    if (!isInView) return
    
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = easeOutQuart * value
      setDisplayValue(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }
    animate()
  }, [isInView, value, duration])
  
  return (
    <span ref={ref}>
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue).toLocaleString()}{suffix}
    </span>
  )
}

export default function IntroAnimation() {
  const [showIntro, setShowIntro] = useState(true)
  const [showLanding, setShowLanding] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Only show intro on homepage
    const shouldShowIntro = location.pathname === '/'
    
    if (!shouldShowIntro) {
      setShowIntro(false)
      setShowLanding(false)
      return
    }

    // Step 1: Logo animation (0-1.5s)
    setTimeout(() => setCurrentStep(1), 1500)
    // Step 2: Text reveal (1.5-3s)
    setTimeout(() => setCurrentStep(2), 3000)
    // Step 3: Features animation (3-5s)
    setTimeout(() => setCurrentStep(3), 5000)
    // Step 4: Final message (5-7s)
    setTimeout(() => setCurrentStep(4), 7000)
    // Transition to landing page (7s)
    setTimeout(() => {
      setShowLanding(true)
      setShowIntro(false)
    }, 7000)
  }, [location.pathname])

  const handleSkip = () => {
    setShowLanding(true)
    setShowIntro(false)
  }

  const handleNavigate = (path: string) => {
    setShowIntro(false)
    navigate(path)
  }

  return (
    <AnimatePresence mode="wait">
      {/* Intro Animation Sequence */}
      {showIntro && !showLanding && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-gradient-to-br from-primary-600 via-blue-600 to-purple-600 flex items-center justify-center overflow-hidden"
        >
          <AnimatedBackground />
          
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  background: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`,
                }}
                animate={{
                  y: [0, -200, 0],
                  x: [0, (Math.random() - 0.5) * 100, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Floating Orbs */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full blur-3xl opacity-20"
              style={{
                width: `${100 + Math.random() * 200}px`,
                height: `${100 + Math.random() * 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(147, 197, 253, 0.3)',
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200, 0],
                y: [0, (Math.random() - 0.5) * 200, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Main Content */}
          <div className="relative z-10 text-center px-4">
            {/* Step 0: Logo Animation */}
            {currentStep >= 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 1.2, type: "spring", stiffness: 200 }}
                className="mb-8"
              >
                <motion.div
                  className="w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-white to-blue-50 rounded-3xl flex items-center justify-center mx-auto shadow-2xl mb-6 relative overflow-hidden"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 100px rgba(255,255,255,0.9)',
                      '0 0 0px rgba(255,255,255,0)',
                    ],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  <Building2 className="w-24 h-24 md:w-28 md:h-28 text-primary-600 relative z-10" />
                  
                  {/* Rotating sparkles around logo */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-yellow-400 drop-shadow-lg" />
                    <Sparkles className="absolute -bottom-3 -left-3 w-8 h-8 text-blue-400 drop-shadow-lg" />
                    <Sparkles className="absolute top-1/2 -left-3 w-6 h-6 text-purple-400 drop-shadow-lg" />
                    <Sparkles className="absolute top-1/2 -right-3 w-6 h-6 text-pink-400 drop-shadow-lg" />
                  </motion.div>
                  
                  {/* Pulsing rings */}
                  {[0, 1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute inset-0 border-2 border-white/30 rounded-3xl"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{
                        scale: [1, 1.3, 1.5],
                        opacity: [0.5, 0.2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: ring * 0.7,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Step 1: Brand Name */}
            {currentStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative"
              >
                <motion.h1
                  className="text-7xl md:text-9xl font-black text-white mb-4 tracking-tight relative"
                  animate={{
                    textShadow: [
                      '0 0 0px rgba(255,255,255,0), 0 0 0px rgba(59,130,246,0)',
                      '0 0 40px rgba(255,255,255,1), 0 0 60px rgba(59,130,246,0.8)',
                      '0 0 0px rgba(255,255,255,0), 0 0 0px rgba(59,130,246,0)',
                    ],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    CampusHire
                  </span>
                </motion.h1>
                
                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-2 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </motion.div>
            )}

            {/* Step 2: Tagline */}
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                <motion.p
                  className="text-2xl md:text-3xl text-white/95 mb-8 font-semibold"
                  animate={{
                    textShadow: [
                      '0 2px 10px rgba(0,0,0,0.1)',
                      '0 2px 20px rgba(255,255,255,0.3)',
                      '0 2px 10px rgba(0,0,0,0.1)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  CONNECTING STUDENTS WITH CAMPUS HIRING OPPORTUNITIES
                </motion.p>
                <motion.div
                  className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 200 }}
                  transition={{ duration: 1 }}
                />
                <motion.p
                  className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Your gateway to successful career opportunities
                </motion.p>
              </motion.div>
            )}

            {/* Step 3: Features */}
            {currentStep >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-12"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  {[
                    { icon: Brain, text: 'AI-Powered', color: 'from-purple-400 to-pink-400' },
                    { icon: TrendingUp, text: 'Real Insights', color: 'from-blue-400 to-cyan-400' },
                    { icon: CheckCircle2, text: 'Success Ready', color: 'from-green-400 to-emerald-400' },
                    { icon: BarChart3, text: 'Analytics', color: 'from-orange-400 to-red-400' },
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.15, type: "spring", stiffness: 200 }}
                      className="text-center"
                      whileHover={{ scale: 1.1, y: -5 }}
                    >
                      <motion.div
                        className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: idx * 0.2,
                        }}
                      >
                        <feature.icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <p className="text-white font-semibold text-sm">{feature.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Action Buttons */}
            {currentStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-12 space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <motion.button
                    onClick={() => handleNavigate('/auth')}
                    className="px-10 py-4 bg-white text-primary-600 font-bold text-xl rounded-full shadow-2xl flex items-center gap-3"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        '0 10px 40px rgba(0,0,0,0.2)',
                        '0 10px 60px rgba(255,255,255,0.4)',
                        '0 10px 40px rgba(0,0,0,0.2)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Get Started
                    <ArrowRight className="w-6 h-6" />
                  </motion.button>
                </div>
                
                <motion.button
                  onClick={() => handleNavigate('/admin/login')}
                  className="px-8 py-3 bg-green-500/90 backdrop-blur-sm text-white font-semibold text-lg rounded-full flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shield className="w-5 h-5" />
                  Admin Panel
                </motion.button>
              </motion.div>
            )}

            {/* Skip Button */}
            {currentStep < 4 && (
              <motion.button
                onClick={handleSkip}
                className="absolute top-8 right-8 text-white/80 hover:text-white text-sm font-semibold transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                Skip Intro
              </motion.button>
            )}
            
            {/* Quick Navigation - Admin Only (Hidden on intro) */}

            {/* Loading Progress Bar */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-white/20 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 8, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Full Landing Page */}
      {showLanding && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 overflow-y-auto relative"
        >
          {/* Top Navigation Bar */}
          <nav className="sticky top-0 z-50 bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">CampusHire</span>
                </div>
                <div className="flex items-center gap-8">
                  <a href="#about" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">About</a>
                  <a href="#services" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">Services</a>
                  <a href="#how-it-works" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">How It Works</a>
                  <motion.button
                    onClick={() => handleNavigate('/auth')}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Contact us
                  </motion.button>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section - Professional Style */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background - Smooth Blue-to-Purple Gradient */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 z-10" />
              
              {/* Subtle Geometric Patterns */}
              <div className="absolute inset-0 opacity-[0.02]">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Neuro Bubbles Animation - Optimized for Performance */}
              <div className="absolute inset-0 opacity-[0.35] z-10" style={{ willChange: 'transform' }}>
                {[...Array(20)].map((_, i) => {
                  const size = 4 + Math.random() * 16
                  const left = Math.random() * 100
                  const top = Math.random() * 100
                  const duration = 8 + Math.random() * 6
                  const delay = Math.random() * 4
                  const isLarge = Math.random() > 0.75
                  const pulseSpeed = 3 + Math.random() * 1.5
                  const xOffset = (Math.random() - 0.5) * 40
                  
                  return (
                    <motion.div
                      key={`neuro-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${left}%`,
                        top: `${top}%`,
                        willChange: 'transform, opacity',
                        background: isLarge 
                          ? 'radial-gradient(circle, rgba(147, 197, 253, 1), rgba(196, 181, 253, 0.95), rgba(147, 197, 253, 0.8), transparent)'
                          : 'radial-gradient(circle, rgba(147, 197, 253, 1), rgba(196, 181, 253, 0.85), transparent)',
                        boxShadow: isLarge 
                          ? '0 0 22px rgba(147, 197, 253, 1), 0 0 35px rgba(196, 181, 253, 0.9), 0 0 50px rgba(147, 197, 253, 0.7)'
                          : '0 0 16px rgba(147, 197, 253, 0.95), 0 0 28px rgba(196, 181, 253, 0.8)',
                      }}
                      animate={{
                        y: [0, -60, 0],
                        x: [0, xOffset, 0],
                        opacity: [0.6, 1, 0.6],
                        scale: [1, isLarge ? 1.35 : 1.2, 1],
                      }}
                      transition={{
                        duration,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.6, 1],
                        delay,
                      }}
                    >
                      {/* Inner Glow Pulse - Optimized */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.7), transparent 70%)',
                          filter: 'blur(4px)',
                          willChange: 'transform, opacity',
                        }}
                        animate={{
                          opacity: [0.4, 0.9, 0.4],
                          scale: [0.9, 1.2, 0.9],
                        }}
                        transition={{
                          duration: pulseSpeed,
                          repeat: Infinity,
                          ease: [0.4, 0, 0.6, 1],
                          delay: delay * 0.5,
                        }}
                      />
                    </motion.div>
                  )
                })}
              </div>

              {/* Soft Glowing Bokeh - Optimized */}
              <div className="absolute inset-0 opacity-[0.06]" style={{ willChange: 'transform' }}>
                {[...Array(3)].map((_, i) => {
                  const size = 180 + Math.random() * 150
                  const left = Math.random() * 100
                  const top = Math.random() * 100
                  const duration = 25 + Math.random() * 10
                  const delay = Math.random() * 5
                  const xOffset = (Math.random() - 0.5) * 120
                  const yOffset = (Math.random() - 0.5) * 120
                  
                  return (
                    <motion.div
                      key={`bokeh-${i}`}
                      className="absolute rounded-full blur-3xl"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${left}%`,
                        top: `${top}%`,
                        willChange: 'transform, opacity',
                        background: `radial-gradient(circle, rgba(147, 197, 253, 0.4), rgba(196, 181, 253, 0.25), transparent 70%)`,
                      }}
                      animate={{
                        x: [0, xOffset, 0],
                        y: [0, yOffset, 0],
                        scale: [1, 1.25, 1],
                        opacity: [0.2, 0.45, 0.2],
                      }}
                      transition={{
                        duration,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.6, 1],
                        delay,
                      }}
                    />
                  )
                })}
              </div>
            </div>

            {/* AI Neural Network Animation - Optimized */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none hidden lg:flex"
              style={{ willChange: 'opacity' }}
            >
              <div className="relative w-[600px] h-[600px]" style={{ willChange: 'transform' }}>
                {/* Network Nodes - Interview Questions, Companies, Skills */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ willChange: 'contents' }}>
                  {/* Interview Questions Nodes */}
                  {[
                    { x: 100, y: 150, text: 'DSA?', type: 'question' },
                    { x: 150, y: 100, text: 'OOPs?', type: 'question' },
                    { x: 200, y: 80, text: 'System?', type: 'question' },
                    { x: 450, y: 150, text: 'Projects?', type: 'question' },
                    { x: 500, y: 200, text: 'DBMS?', type: 'question' },
                    { x: 450, y: 450, text: 'HR?', type: 'question' },
                    { x: 100, y: 450, text: 'Tech?', type: 'question' },
                    { x: 150, y: 500, text: 'Algo?', type: 'question' },
                  ].map((node, idx) => (
                    <g key={`node-${idx}`}>
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="20"
                        fill="rgba(147, 197, 253, 0.3)"
                        stroke="rgba(147, 197, 253, 0.6)"
                        strokeWidth="2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
                      />
                      <motion.text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                      >
                        {node.text}
                      </motion.text>
                    </g>
                  ))}

                  {/* Company Logo Nodes */}
                  {[
                    { x: 300, y: 120, text: 'GOOGL', type: 'company' },
                    { x: 350, y: 100, text: 'MSFT', type: 'company' },
                    { x: 400, y: 120, text: 'AMZN', type: 'company' },
                    { x: 300, y: 480, text: 'META', type: 'company' },
                    { x: 250, y: 500, text: 'TCS', type: 'company' },
                  ].map((node, idx) => (
                    <g key={`company-${idx}`}>
                      <motion.rect
                        x={node.x - 25}
                        y={node.y - 15}
                        width="50"
                        height="30"
                        rx="6"
                        fill="rgba(196, 181, 253, 0.25)"
                        stroke="rgba(196, 181, 253, 0.7)"
                        strokeWidth="2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + idx * 0.1, duration: 0.6 }}
                      />
                      <motion.text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill="white"
                        fontSize="9"
                        fontWeight="700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 + idx * 0.1 }}
                      >
                        {node.text}
                      </motion.text>
                    </g>
                  ))}

                  {/* Skill Keywords Nodes */}
                  {[
                    { x: 80, y: 300, text: 'Python', type: 'skill' },
                    { x: 120, y: 250, text: 'Java', type: 'skill' },
                    { x: 520, y: 300, text: 'React', type: 'skill' },
                    { x: 480, y: 350, text: 'Node', type: 'skill' },
                    { x: 80, y: 350, text: 'SQL', type: 'skill' },
                    { x: 520, y: 400, text: 'AWS', type: 'skill' },
                  ].map((node, idx) => (
                    <g key={`skill-${idx}`}>
                      <motion.polygon
                        points={`${node.x},${node.y - 12} ${node.x + 12},${node.y + 8} ${node.x - 12},${node.y + 8}`}
                        fill="rgba(147, 197, 253, 0.3)"
                        stroke="rgba(147, 197, 253, 0.6)"
                        strokeWidth="2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.7 + idx * 0.1, duration: 0.6 }}
                      />
                      <motion.text
                        x={node.x}
                        y={node.y + 20}
                        textAnchor="middle"
                        fill="white"
                        fontSize="9"
                        fontWeight="600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.9 + idx * 0.1 }}
                      >
                        {node.text}
                      </motion.text>
                    </g>
                  ))}

                  {/* Connections Between Nodes */}
                  {[
                    { x1: 100, y1: 150, x2: 150, y2: 100 },
                    { x1: 150, y1: 100, x2: 200, y2: 80 },
                    { x1: 200, y1: 80, x2: 300, y2: 120 },
                    { x1: 300, y1: 120, x2: 400, y2: 120 },
                    { x1: 400, y1: 120, x2: 450, y2: 150 },
                    { x1: 450, y1: 150, x2: 500, y2: 200 },
                    { x1: 500, y1: 200, x2: 520, y2: 300 },
                    { x1: 520, y1: 300, x2: 480, y2: 350 },
                    { x1: 480, y1: 350, x2: 450, y2: 450 },
                    { x1: 450, y1: 450, x2: 300, y2: 480 },
                    { x1: 300, y1: 480, x2: 250, y2: 500 },
                    { x1: 250, y1: 500, x2: 150, y2: 500 },
                    { x1: 150, y1: 500, x2: 100, y2: 450 },
                    { x1: 100, y1: 450, x2: 80, y2: 350 },
                    { x1: 80, y1: 350, x2: 80, y2: 300 },
                    { x1: 80, y1: 300, x2: 120, y2: 250 },
                    { x1: 120, y1: 250, x2: 100, y2: 150 },
                    { x1: 300, y1: 120, x2: 350, y2: 100 },
                    { x1: 520, y1: 300, x2: 520, y2: 400 },
                  ].map((line, idx) => (
                    <motion.line
                      key={`conn-${idx}`}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="rgba(147, 197, 253, 0.25)"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.25 }}
                      transition={{ delay: 2.2 + idx * 0.05, duration: 1.5, ease: [0.4, 0, 0.6, 1] }}
                    />
                  ))}

                  {/* Pulsing Data Packets - Optimized */}
                  {[
                    { from: { x: 100, y: 150 }, to: { x: 150, y: 100 }, delay: 0 },
                    { from: { x: 450, y: 150 }, to: { x: 500, y: 200 }, delay: 0.8 },
                    { from: { x: 300, y: 120 }, to: { x: 400, y: 120 }, delay: 1.6 },
                    { from: { x: 80, y: 300 }, to: { x: 120, y: 250 }, delay: 2.4 },
                  ].map((packet, idx) => {
                    const duration = 2.5
                    
                    return (
                      <motion.circle
                        key={`packet-${idx}`}
                        r="4"
                        fill="rgba(147, 197, 253, 0.9)"
                        style={{
                          filter: 'drop-shadow(0 0 6px rgba(147, 197, 253, 0.8))',
                          willChange: 'transform, opacity',
                        }}
                        initial={{ 
                          cx: packet.from.x, 
                          cy: packet.from.y,
                          opacity: 0,
                        }}
                        animate={{
                          cx: [packet.from.x, packet.to.x],
                          cy: [packet.from.y, packet.to.y],
                          opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                          duration,
                          repeat: Infinity,
                          ease: "linear",
                          delay: packet.delay,
                          times: [0, 0.1, 0.9, 1],
                        }}
                      />
                    )
                  })}
                </svg>
              </div>
            </motion.div>

            {/* Hero Content - Centered */}
            <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 leading-[1.08] tracking-tight"
                style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)' }}
              >
                Real Experiences.{' '}
                <span className="block mt-3 bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
                  Smarter Preparation.
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="text-lg md:text-xl lg:text-2xl text-white/85 mb-11 max-w-3xl mx-auto font-light leading-relaxed"
              >
                Connect with top recruiters through AI-powered matching. Streamline campus recruitment and empower students to achieve their career goals.
              </motion.p>

              {/* Service Tags/Bubbles - Smooth Glowing Pills */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-wrap justify-center gap-3 mb-14"
              >
                {[
                  { icon: Users, text: 'Student Matching' },
                  { icon: Briefcase, text: 'Recruiter Access' },
                  { icon: Target, text: 'Smart Placement' },
                ].map((tag, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 + idx * 0.08, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="px-6 py-3 rounded-full backdrop-blur-xl border border-white/20 bg-white/10 text-white flex items-center gap-2.5 transition-all duration-300 relative overflow-hidden group"
                    style={{
                      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 0 24px rgba(147, 197, 253, 0.15)',
                    }}
                    whileHover={{ scale: 1.04, y: -2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <tag.icon className="w-4 h-4 relative z-10" style={{ filter: 'drop-shadow(0 0 3px rgba(147, 197, 253, 0.5))' }} />
                    <span className="text-sm font-medium relative z-10">{tag.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons - Smooth & Perfect */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  onClick={() => handleNavigate('/auth')}
                  className="relative inline-flex items-center justify-center px-12 py-4.5 text-primary-700 font-semibold text-base rounded-full transition-all duration-300 overflow-hidden group"
                  style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.25)',
                  }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-2.5 w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
                <motion.button
                  onClick={() => handleNavigate('/auth')}
                  className="relative inline-flex items-center justify-center px-12 py-4.5 text-white font-semibold text-base rounded-full transition-all duration-300 overflow-hidden group"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -1,
                    background: 'rgba(255, 255, 255, 0.18)',
                    borderColor: 'rgba(255, 255, 255, 0.45)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Our Services</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/12 to-white/6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>
            </div>

          </section>

          {/* Why Choose CampusHire Section */}
          <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Choose CampusHire?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  The smart choice for campus recruitment
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { icon: Brain, title: 'Smart Candidate Matching', desc: 'AI-powered algorithms analyze profiles and match students with the perfect opportunities based on skills, preferences, and company requirements.', bgClass: 'bg-purple-100 dark:bg-purple-900', iconClass: 'text-purple-600 dark:text-purple-400' },
                  { icon: GraduationCap, title: 'College-Friendly Hiring', desc: 'Designed specifically for campus recruitment, understanding the unique needs of students and educational institutions.', bgClass: 'bg-blue-100 dark:bg-blue-900', iconClass: 'text-blue-600 dark:text-blue-400' },
                  { icon: Shield, title: 'Trusted Company Partnerships', desc: 'Work with verified, reputable companies committed to fair hiring practices and student success.', bgClass: 'bg-green-100 dark:bg-green-900', iconClass: 'text-green-600 dark:text-green-400' },
                  { icon: Lock, title: 'Secure Systems', desc: 'Enterprise-grade security protecting student data, company information, and all platform interactions.', bgClass: 'bg-red-100 dark:bg-red-900', iconClass: 'text-red-600 dark:text-red-400' },
                  { icon: Clock, title: 'Faster Recruitment', desc: 'Streamlined processes reduce hiring time by up to 60%, connecting candidates with opportunities quickly.', bgClass: 'bg-orange-100 dark:bg-orange-900', iconClass: 'text-orange-600 dark:text-orange-400' },
                  { icon: CheckCircle, title: 'Proven Results', desc: 'Track record of successful placements with high satisfaction rates from both students and recruiters.', bgClass: 'bg-indigo-100 dark:bg-indigo-900', iconClass: 'text-indigo-600 dark:text-indigo-400' },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 group"
                  >
                    <motion.div
                      className={`w-14 h-14 ${feature.bgClass} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                    >
                      <feature.icon className={`w-7 h-7 ${feature.iconClass}`} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Animated Statistics Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-800 dark:to-blue-800">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-white mb-4">
                  CampusHire by the Numbers
                </h2>
                <p className="text-xl text-primary-100">
                  Trusted by thousands across the platform
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: 10000, suffix: '+', label: 'Active Users', decimals: 0 },
                  { value: 500, suffix: '+', label: 'Partner Companies', decimals: 0 },
                  { value: 5000, suffix: '+', label: 'Hiring Experiences', decimals: 0 },
                  { value: 95, suffix: '%', label: 'Success Rate', decimals: 0 },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="text-center cursor-default"
                  >
                    <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                      <RollingNumber 
                        value={stat.value} 
                        suffix={stat.suffix} 
                        duration={2.5}
                        decimals={stat.decimals || 0}
                      />
                    </div>
                    <div className="text-primary-100 text-lg">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Simple steps to successful hiring
                </p>
              </motion.div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 dark:from-primary-800 dark:via-primary-600 dark:to-primary-800 transform -translate-y-1/2" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                  {[
                    { icon: User, title: 'Register', desc: 'Students and recruiters create accounts with verified credentials' },
                    { icon: FileText, title: 'Create Profile', desc: 'Build comprehensive profiles with skills, experience, and preferences' },
                    { icon: Search, title: 'Smart Matching', desc: 'AI algorithms match candidates with perfect opportunities' },
                    { icon: MessageSquare, title: 'Interviews', desc: 'Connect directly and conduct seamless interview processes' },
                    { icon: CheckCircle2, title: 'Successful Hiring', desc: 'Complete placements with ongoing support and tracking' },
                  ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative text-center"
                    >
                      <motion.div
                        className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg relative z-10"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <step.icon className="w-10 h-10" />
                      </motion.div>
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mx-auto mb-4 relative z-10">
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {step.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Key Benefits Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    Key Benefits
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Value that drives success for everyone
                  </p>
                  <div className="space-y-4">
                    {[
                      { icon: Clock, title: 'Faster Hiring Cycles', desc: 'Reduce time-to-hire by up to 60% with streamlined processes' },
                      { icon: Target, title: 'Skill-Based Recruitment', desc: 'Match candidates based on actual skills and potential, not just credentials' },
                      { icon: Users, title: 'Equal Opportunities', desc: 'Level the playing field for all students, ensuring fair access to opportunities' },
                      { icon: BarChart, title: 'Recruiter Analytics', desc: 'Powerful insights and analytics to optimize your hiring strategy' },
                      { icon: Eye, title: 'Transparent Process', desc: 'Clear communication and visibility throughout the entire recruitment journey' },
                    ].map((benefit, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {benefit.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {benefit.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Illustration/Motion Graphic */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative h-[500px] flex items-center justify-center"
                >
                  <div className="relative w-full h-full">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-32 h-32 bg-gradient-to-br from-primary-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${20 + i * 25}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.5,
                        }}
                      >
                        {i === 0 && <Users className="w-16 h-16 text-white" />}
                        {i === 1 && <Target className="w-16 h-16 text-white" />}
                        {i === 2 && <CheckCircle2 className="w-16 h-16 text-white" />}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* About CampusHire Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  About CampusHire
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Building the future of campus recruitment
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="card bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900 dark:to-blue-900"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    To become the most trusted and comprehensive campus hiring ecosystem, connecting students with their dream careers while empowering companies to discover exceptional talent. We envision a future where every student has equal access to opportunities and every company finds the perfect fit effortlessly.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    To empower students by providing equal opportunities and comprehensive support throughout their career journey. To simplify recruitment for companies by offering intelligent matching, streamlined processes, and powerful analytics. To help institutions bridge the gap between education and industry, ensuring successful placements and career growth.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* What We Offer Section */}
          <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  What We Offer
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Comprehensive solutions for campus recruitment
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: GraduationCap, title: 'Student Placement Support', desc: 'Comprehensive guidance and resources to help students prepare for interviews and secure placements.' },
                  { icon: Building2, title: 'Campus Recruitment Solutions', desc: 'End-to-end recruitment solutions tailored for companies seeking campus talent.' },
                  { icon: FileText, title: 'Resume & Profile Management', desc: 'Professional profile creation and management tools to showcase skills effectively.' },
                  { icon: Target, title: 'Skill Assessment Tools', desc: 'AI-powered assessments to evaluate and match candidate skills with job requirements.' },
                  { icon: BarChart3, title: 'Powerful Admin Dashboard', desc: 'Comprehensive analytics and management tools for recruiters and institutions.' },
                  { icon: Users, title: 'Community & Networking', desc: 'Connect with peers, mentors, and industry professionals in a supportive community.' },
                ].map((service, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="card hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <service.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {service.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-20 pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full opacity-20"
                  style={{
                    width: `${30 + Math.random() * 50}px`,
                    height: `${30 + Math.random() * 50}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: 'white',
                  }}
                  animate={{
                    y: [0, -50, 0],
                    x: [0, (Math.random() - 0.5) * 30, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Ready to Transform Campus Hiring?
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Join thousands of students and companies already using CampusHire to achieve their goals
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={() => handleNavigate('/auth')}
                    className="inline-flex items-center px-10 py-5 bg-white text-primary-600 font-semibold text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
