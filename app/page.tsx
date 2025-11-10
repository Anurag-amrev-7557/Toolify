'use client'
import Link from 'next/link'
import { ArrowRight, FileText, Scissors, Image as ImageIcon, Type, Braces, Lock, QrCode, Key, Shield, Hash, FileSearch, CaseSensitive, Minimize2, RotateCw, Droplets, Unlock, ArrowUpDown, FileCode, Wrench, Eye, FileCheck, Sparkles, FileSpreadsheet, Presentation } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

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
  { name: 'Repair PDF', slug: 'pdf-repair', category: 'PDF', icon: Wrench },
  { name: 'PDF to PDF/A', slug: 'pdf-to-pdfa', category: 'PDF', icon: FileCode },
  { name: 'HTML to PDF', slug: 'html-to-pdf', category: 'PDF', icon: FileCode },
  { name: 'PDF OCR', slug: 'pdf-ocr', category: 'PDF', icon: Eye },
  { name: 'Sign PDF', slug: 'pdf-sign', category: 'PDF', icon: Shield },
  { name: 'Validate PDF', slug: 'pdf-validate', category: 'PDF', icon: FileCheck },
  { name: 'PDF to Word', slug: 'pdf-to-word', category: 'PDF', icon: FileText },
  { name: 'Word to PDF', slug: 'word-to-pdf', category: 'PDF', icon: FileText },
  { name: 'PDF to Excel', slug: 'pdf-to-excel', category: 'PDF', icon: FileSpreadsheet },
  { name: 'Excel to PDF', slug: 'excel-to-pdf', category: 'PDF', icon: FileSpreadsheet },
  { name: 'PDF to PowerPoint', slug: 'pdf-to-powerpoint', category: 'PDF', icon: Presentation },
  { name: 'PowerPoint to PDF', slug: 'powerpoint-to-pdf', category: 'PDF', icon: Presentation },
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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'PDF', 'Image', 'Text', 'Data', 'Generator']
  const filteredTools = selectedCategory === 'All' ? tools : tools.filter(t => t.category === selectedCategory)
  
  const categoryIcons: Record<string, any> = {
    PDF: FileText,
    Image: ImageIcon,
    Text: Type,
    Data: Braces,
    Generator: Sparkles
  }
  
  const groupedTools = selectedCategory === 'All' 
    ? categories.slice(1).map(cat => ({ category: cat, tools: tools.filter(t => t.category === cat), icon: categoryIcons[cat] }))
    : null

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-12 lg:pt-16 pb-8 sm:pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 mb-4 sm:mb-6 lg:mb-8 shadow-sm no-theme-transition">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="whitespace-nowrap">35+ tools • 100% free</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-gray-950 mb-4 sm:mb-6 lg:mb-8 leading-[1.15] sm:leading-[1.1]">
              Your complete<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">productivity toolkit</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-gray-500 mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-xl mx-auto sm:mx-0">
              Transform your workflow with professional-grade utilities. Process PDFs, compress images, and format data—all in your browser.
            </p>
            <div className="flex flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 lg:gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="#tools" className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 lg:px-8 py-3 sm:py-3 lg:py-[14px] bg-gray-900 text-white dark:text-black dark:bg-white text-sm sm:text-sm lg:text-base rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-medium border-2 border-gray-900 dark:border-white whitespace-nowrap">
                  Browse Tools 
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/about" className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 lg:px-8 py-3 sm:py-3 lg:py-[14px] border-2 border-gray-900 text-gray-900 text-sm sm:text-sm lg:text-base rounded-full hover:bg-gray-900 hover:text-white transition-all font-medium whitespace-nowrap">
                  Learn More
                </Link>
              </motion.div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="rounded-2xl overflow-hidden max-h-[400px] flex justify-center items-center">
              <img src="/hero.webp" alt="Toolbox Platform" className="w-80 h-80 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <div className="mb-6 sm:mb-12 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Available Tools</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8 max-w-xl mx-auto sm:mx-0">Choose from our collection of productivity utilities</p>
          
          {/* Category Filter */}
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-hide">
            <div className="flex sm:flex-wrap gap-2 min-w-max sm:min-w-0">
              {categories.map(category => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 sm:px-5 py-2 my-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-md'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-900'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        {selectedCategory === 'All' ? (
          groupedTools?.map((group, groupIndex) => {
            const CategoryIcon = group.icon
            return (
            <motion.div 
              key={group.category} 
              className="mb-10 sm:mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-1.5 sm:p-2 rounded-full border border-gray-300 dark:border-gray-700">
                  <CategoryIcon size={18} className="text-black dark:text-white sm:w-5 sm:h-5" strokeWidth={2} />
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2'>
                  <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white">{group.category}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{group.tools.length} tools available</p>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {group.tools.map((tool) => (
                  <motion.div
                    key={tool.slug}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <Link href={`/tools/${tool.slug}`} 
                      className="group block p-3 sm:p-5 border border-gray-300 rounded-xl hover:border-gray-900 hover:shadow-md transition-all duration-200 bg-white aspect-square sm:aspect-auto flex flex-col items-center justify-center text-center sm:items-start sm:justify-start sm:text-left h-full">
                      <div className="flex flex-col items-center sm:block sm:w-full">
                        <tool.icon size={32} className="text-gray-500 group-hover:text-gray-900 transition-colors mb-3 sm:hidden" strokeWidth={1.5} />
                        <div className="hidden sm:flex items-start justify-between mb-3 w-full">
                          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{tool.category}</div>
                          <tool.icon size={20} className="text-gray-500 group-hover:text-gray-900 transition-colors" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xs sm:text-base font-semibold text-gray-900 leading-tight sm:mb-4">{tool.name}</h3>
                      </div>
                      <motion.div 
                        className="hidden sm:flex items-center text-gray-400 group-hover:text-gray-900 transition-colors"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight size={16} strokeWidth={2} />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )})
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Link href={`/tools/${tool.slug}`} 
                    className="group block p-3 sm:p-5 border border-gray-300 rounded-xl hover:border-gray-900 hover:shadow-md transition-all duration-200 bg-white aspect-square sm:aspect-auto flex flex-col items-center justify-center text-center sm:items-start sm:justify-start sm:text-left h-full">
                    <div className="flex flex-col items-center sm:block sm:w-full">
                      <tool.icon size={32} className="text-gray-500 group-hover:text-gray-900 transition-colors mb-3 sm:hidden" strokeWidth={1.5} />
                      <div className="hidden sm:flex items-start justify-between mb-3 w-full">
                        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{tool.category}</div>
                        <tool.icon size={20} className="text-gray-500 group-hover:text-gray-900 transition-colors" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xs sm:text-base font-semibold text-gray-900 leading-tight sm:mb-4">{tool.name}</h3>
                    </div>
                    <motion.div 
                      className="hidden sm:flex items-center text-gray-400 group-hover:text-gray-900 transition-colors"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={16} strokeWidth={2} />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </main>
  )
}
