'use client'
import Link from 'next/link'
import { useState, useCallback, memo, useMemo, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Search, LogIn, UserPlus, Wrench, Moon, Sun } from 'lucide-react'
import { motion, useScroll, useSpring, useTransform, AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { FileText, Scissors, Image as ImageIcon, Type, Braces, Lock, QrCode, Key, Shield, Hash, FileSearch, CaseSensitive, Minimize2, RotateCw, Droplets, Unlock, ArrowUpDown, FileCode, Wrench as WrenchIcon, Eye, FileCheck } from 'lucide-react'

const tools = [
  { name: 'PDF Merger', slug: 'pdf-merger', category: 'PDF', icon: FileText },
  { name: 'PDF Splitter', slug: 'pdf-splitter', category: 'PDF', icon: Scissors },
  { name: 'PDF Compressor', slug: 'pdf-compress', category: 'PDF', icon: Minimize2 },
  { name: 'PDF to JPG', slug: 'pdf-to-jpg', category: 'PDF', icon: ImageIcon },
  { name: 'JPG to PDF', slug: 'jpg-to-pdf', category: 'PDF', icon: FileText },
  { name: 'Rotate PDF', slug: 'pdf-rotate', category: 'PDF', icon: RotateCw },
  { name: 'Watermark PDF', slug: 'pdf-watermark', category: 'PDF', icon: Droplets },
  { name: 'Unlock PDF', slug: 'pdf-unlock', category: 'PDF', icon: Unlock },
  { name: 'Protect PDF', slug: 'pdf-protect', category: 'PDF', icon: Lock },
  { name: 'Organize PDF', slug: 'pdf-organize', category: 'PDF', icon: ArrowUpDown },
  { name: 'Add Page Numbers', slug: 'pdf-page-numbers', category: 'PDF', icon: Hash },
  { name: 'Extract Pages', slug: 'pdf-extract-pages', category: 'PDF', icon: Scissors },
  { name: 'Delete Pages', slug: 'pdf-delete-pages', category: 'PDF', icon: Scissors },
  { name: 'Repair PDF', slug: 'pdf-repair', category: 'PDF', icon: WrenchIcon },
  { name: 'PDF to PDF/A', slug: 'pdf-to-pdfa', category: 'PDF', icon: FileCode },
  { name: 'HTML to PDF', slug: 'html-to-pdf', category: 'PDF', icon: FileCode },
  { name: 'PDF OCR', slug: 'pdf-ocr', category: 'PDF', icon: Eye },
  { name: 'Sign PDF', slug: 'pdf-sign', category: 'PDF', icon: Shield },
  { name: 'Validate PDF', slug: 'pdf-validate', category: 'PDF', icon: FileCheck },
  { name: 'Image Compressor', slug: 'image-compressor', category: 'Image', icon: ImageIcon },
  { name: 'Word Counter', slug: 'word-counter', category: 'Text', icon: Type },
  { name: 'JSON Formatter', slug: 'json-formatter', category: 'Data', icon: Braces },
  { name: 'Base64 Encoder', slug: 'base64-encoder', category: 'Data', icon: Lock },
  { name: 'QR Code Generator', slug: 'qr-generator', category: 'Generator', icon: QrCode },
  { name: 'UUID Generator', slug: 'uuid-generator', category: 'Generator', icon: Key },
  { name: 'Password Generator', slug: 'password-generator', category: 'Generator', icon: Shield },
  { name: 'Hash Generator', slug: 'hash-generator', category: 'Data', icon: Hash },
  { name: 'Text Diff', slug: 'text-diff', category: 'Text', icon: FileSearch },
  { name: 'Case Converter', slug: 'case-converter', category: 'Text', icon: CaseSensitive },
]

const SCROLL_CONFIG = { stiffness: 200, damping: 25, mass: 0.3 }
const SCROLL_THRESHOLD = 100

const navTools = [
  { name: 'PDF Tools', href: '/tools/pdf-merger' },
  { name: 'Image Tools', href: '/tools/image-compressor' },
  { name: 'Text Tools', href: '/tools/word-counter' },
  { name: 'Generators', href: '/tools/uuid-generator' },
]

const NavLink = memo(({ href, children, pathname, onClick }: any) => {
  // treat root exact, otherwise allow section-prefix matching
  const active = href === '/' ? pathname === href : pathname?.startsWith(href)
  return (
    <Link href={href} onClick={onClick} className="group relative px-1 py-1">
      <motion.span
        className="inline-block transition-transform will-change-transform"
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {children}
      </motion.span>
      <span
        aria-hidden
        className={`pointer-events-none absolute left-0 right-0 -bottom-0.5 h-[2px] origin-left rounded-full transition-transform duration-300 ease-out bg-gray-900 ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
      {active && <span className="sr-only" aria-current="page">(current)</span>}
    </Link>
  )
})
NavLink.displayName = 'NavLink'

export default memo(function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const shouldReduceMotion = useReducedMotion()

  // variants for popping other navbar items in/out when user scrolls
  const popVariants = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        in: { opacity: 1, scale: 1, y: 0 },
        out: { opacity: 0, scale: 1, y: 0 },
      }
    }
    return {
      in: { opacity: 1, scale: 1, y: 0 },
      // stronger shrink + lift for a noticeable pop-out
      out: { opacity: 0, scale: 0.8, y: -10 },
    }
  }, [shouldReduceMotion])
  // make the spring bouncier for pop-in / pop-out
  const popTransition = { type: 'spring' as const, stiffness: 700, damping: 20, mass: 0.28, bounce: 0.6 }

  const { scrollY } = useScroll()
  const scrollProgress = useTransform(scrollY, [0, SCROLL_THRESHOLD], [0, 1])
  const progress = useSpring(scrollProgress, SCROLL_CONFIG)

  const radius = useTransform(progress, [0, 1], [20, 999])
  const pad = useTransform(progress, [0, 1], [24, 12])
  const bg = useTransform(progress, [0, 1], ['rgba(255,255,255,0.0)', 'rgba(255,255,255,0.70)'])
  // Removed dynamic shadow transform - navbar should not show any box shadow
  const borderOpacity = useTransform(progress, [0, 1], [0, 1])
  const ringOpacity = useTransform(progress, [0, 1], [0, 1])

  const handleClose = useCallback(() => setMobileOpen(false), [])

  // when mobile opens, move focus to close button; when closing, restore to menu button
  useEffect(() => {
    if (mobileOpen) {
      // focus after next paint to ensure element exists
      const t = setTimeout(() => closeButtonRef.current?.focus(), shouldReduceMotion ? 0 : 100)
      return () => clearTimeout(t)
    } else {
      // restore focus
      const t = setTimeout(() => menuButtonRef.current?.focus(), 0)
      return () => clearTimeout(t)
    }
  }, [mobileOpen, shouldReduceMotion])

  // close menu on route change
  useEffect(() => setMobileOpen(false), [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = originalOverflow
    }
  }, [mobileOpen])

  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  
  const placeholders = ['Search tools...', 'Try "PDF"...', 'Try "Image"...', 'Try "Generator"...', 'Try "Text"...']
  
  useEffect(() => {
    const currentText = placeholders[placeholderIndex]
    
    if (!isDeleting && displayedText === currentText) {
      const pauseTimeout = setTimeout(() => setIsDeleting(true), 2000)
      return () => clearTimeout(pauseTimeout)
    }
    
    if (isDeleting && displayedText === '') {
      setIsDeleting(false)
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
      return
    }
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentText.slice(0, displayedText.length + 1))
      } else {
        setDisplayedText(displayedText.slice(0, -1))
      }
    }, isDeleting ? 30 : 80)
    
    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, placeholderIndex, placeholders])

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.category.toLowerCase().includes(query)
    ).slice(0, 5)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const desktopNavLinks = useMemo(() => navTools.map(tool => (
    <NavLink key={tool.href} href={tool.href} pathname={pathname}>{tool.name}</NavLink>
  )), [pathname])

  const logoOpacity = useTransform(progress, [0, 1], [1, 0])
  const authOpacity = useTransform(progress, [0, 1], [1, 0])
  const containerOpacity = useTransform(progress, [0, 1], [1, 0])
  const searchWidth = useSpring(useTransform(progress, [0, 1], [448, 600]), SCROLL_CONFIG)
  // keep search height constant to avoid perceived shrink/growth — match scrolled state (52px)
  const searchHeight = useSpring(useTransform(progress, [0, 1], [44, 44]), SCROLL_CONFIG)
  // avoid calling scrollY.get() during render (causes sync reads and potential layout thrash)
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    // update isScrolled reactively when scrollY changes
    const unsub = scrollY.onChange((v) => setIsScrolled(v > SCROLL_THRESHOLD))
    // initialize
    setIsScrolled(scrollY.get() > SCROLL_THRESHOLD)
    return () => unsub()
  }, [scrollY])

  return (
    <MotionConfig transition={{ duration: 0.15 }}>
      <AnimatePresence>
        {searchFocused && isScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setSearchFocused(false)}
          />
        )}
      </AnimatePresence>
      <header className="sticky top-4 z-40 w-full">
        <motion.div
          className="mx-auto max-w-7xl h-14 flex items-center rounded-full justify-between relative px-4 md:px-6"
        >
          {/* No border, ring, or blur on the navbar container */}
          {/* Remove navbar background - keep overlays transparent to avoid visual background */}
          <motion.div aria-hidden style={{ opacity: 0, backgroundColor: 'transparent' }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]" />
          <motion.div aria-hidden style={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]" />

          <motion.div
            initial={false}
            animate={isScrolled ? 'out' : 'in'}
            variants={popVariants}
            transition={popTransition}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-all duration-300">
              <motion.div style={{ scale: useTransform(progress, [0, 1], [1, 0.98]) }}>
                <Wrench size={24} className="text-gray-900" strokeWidth={2} />
              </motion.div>
              <motion.span
                className="font-semibold tracking-tight text-[19.2px] text-gray-900"
                style={{ scale: useTransform(progress, [0, 1], [1, 0.98]), opacity: useTransform(progress, [0, 1], [1, 0.95]) }}
              >
                Toolify
              </motion.span>
            </Link>
          </motion.div>

          <motion.div ref={searchRef} style={{ width: searchWidth }} className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <motion.div
                  animate={{
                    scale: searchFocused ? [1, 1.08, 1] : 1,
                    rotate: searchFocused ? [0, 8, -8, 0] : 0
                  }}
                  transition={{ duration: 0.45 }}
                >
                  <Search className="text-gray-900" size={17} strokeWidth={2.5} />
                </motion.div>
              </div>
              {/* Use an overflow-hidden reveal wrapper so the input's text doesn't get scaled — we animate the wrapper width */}
              <div className="flex justify-center">
                {/* Let the animated wrapper control the width. Use full width inside so the input shrinks when navbar is at top. */}
                <div className="relative w-full max-w-[600px]">
                  <motion.div
                    style={{ width: searchWidth, transformOrigin: 'center' }}
                    className="overflow-hidden rounded-full mx-auto will-change-[width,transform]"
                    transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.35 }}
                  >
                    <motion.input
                      type="text"
                      placeholder={displayedText}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      style={{ height: searchHeight }}
                      className="w-full pl-9 pr-4 rounded-full border border-gray-400 bg-white/70 backdrop-blur-sm text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
            <AnimatePresence>
              {searchFocused && filteredTools.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  {filteredTools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        onClick={() => { setSearchQuery(''); setSearchFocused(false) }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <Icon size={16} className="text-gray-500" strokeWidth={1.5} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                          <div className="text-xs text-gray-500">{tool.category}</div>
                        </div>
                      </Link>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={false}
            animate={isScrolled ? 'out' : 'in'}
            variants={popVariants}
            transition={popTransition}
            className="hidden md:flex items-center gap-3 flex-shrink-0"
          >
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white hover:border-gray-900 transition-all shadow-sm hover:shadow-md overflow-hidden"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="moon"
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={16} strokeWidth={2} className="text-gray-900" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={16} strokeWidth={2} className="text-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              <LogIn size={16} strokeWidth={1.5} />
              Login
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
              <UserPlus size={16} strokeWidth={1.5} />
              Sign Up
            </Link>
          </motion.div>

          <motion.div
            initial={false}
            animate={isScrolled ? 'out' : 'in'}
            variants={popVariants}
            transition={popTransition}
            className="md:hidden flex items-center gap-2 flex-shrink-0"
          >
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white hover:border-gray-900 transition-all shadow-sm hover:shadow-md overflow-hidden"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="moon"
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={16} strokeWidth={2} className="text-gray-900" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={16} strokeWidth={2} className="text-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <button ref={menuButtonRef} onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition-all duration-300"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {mobileOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }} className="fixed inset-0 z-50 md:hidden">
              <motion.div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={handleClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
              />

              <motion.div
                initial={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
                animate={{ x: 0 }}
                exit={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32, mass: 0.5 }}
                className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white/95 backdrop-blur-md border-l border-gray-200 shadow-xl"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="font-semibold text-gray-900">Menu</div>
                  <button ref={closeButtonRef} onClick={handleClose}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition-all duration-300"
                    aria-label="Close menu"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="h-px bg-gray-200" />

                <motion.ul
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
                  transition={{ staggerChildren: shouldReduceMotion ? 0 : 0.03, duration: shouldReduceMotion ? 0 : 0.2 }}
                  className="p-2 flex flex-col text-sm gap-1 list-none"
                >
                  {navTools.map((tool, i) => (
                    <motion.li key={tool.href} className="list-none"
                      initial={shouldReduceMotion ? undefined : { opacity: 0, x: 8 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, x: 8 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.18, delay: shouldReduceMotion ? 0 : i * 0.02 }}
                    >
                      <Link onClick={handleClose} href={tool.href}
                        className="px-3 py-2 rounded-md hover:bg-gray-100 transition-all duration-300 text-gray-900 block"
                      >
                        {tool.name}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  )
})
