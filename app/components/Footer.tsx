'use client'
import Link from 'next/link'
import { memo } from 'react'
import { Twitter, Github, Mail, Heart, ArrowUpRight, Wrench } from 'lucide-react'

const footerLinks = {
  tools: [
    { href: '/tools/pdf-merger', label: 'PDF Tools' },
    { href: '/tools/image-compressor', label: 'Image Tools' },
    { href: '/tools/word-counter', label: 'Text Tools' },
    { href: '/tools/uuid-generator', label: 'Generators' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
}

const socialLinks = [
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
  { href: 'https://github.com', label: 'GitHub', icon: Github },
  { href: 'mailto:hello@toolbox.app', label: 'Email', icon: Mail },
]

const FooterLink = memo(({ href, children }: any) => (
  <Link href={href} className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 rounded-md px-1 py-0.5">
    {children}
  </Link>
))
FooterLink.displayName = 'FooterLink'

const SocialLink = memo(({ href, label, Icon }: any) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2">
    <Icon size={18} className="text-gray-700" />
  </a>
))
SocialLink.displayName = 'SocialLink'

export default memo(function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12 mb-12">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 -ml-1 group mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 rounded-md">
              <Wrench size={24} className="text-gray-900" strokeWidth={2} />
              <span className="font-semibold text-xl tracking-tight text-gray-900">Toolify</span>
            </Link>
            <p className="text-gray-600 text-sm mb-6 max-w-xs leading-relaxed">
              All your micro-tasks, one click away. Fast, free, and integrated online utilities for productivity.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(social => (
                <SocialLink key={social.href} href={social.href} label={social.label} Icon={social.icon} />
              ))}
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Tools</h3>
            <ul className="space-y-3">
              {footerLinks.tools.map(link => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Resources</h3>
            <ul className="space-y-3">
              <li><FooterLink href="/docs">Documentation</FooterLink></li>
              <li><FooterLink href="/help">Help Center</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="mb-12 pb-12 border-b border-gray-200">
          <div className="max-w-md">
            <h3 className="font-semibold text-gray-900 mb-2">Stay updated</h3>
            <p className="text-gray-600 text-sm mb-4">Get the latest productivity tips and tool updates.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm transition-all"
                aria-label="Email address" />
              <button type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap">
                Subscribe <ArrowUpRight size={16} strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-xs sm:text-sm text-gray-500">
          <p className="flex items-center gap-1.5 text-center md:text-left">
            © {currentYear} Toolify. Made with <Heart size={14} strokeWidth={1.5} className="text-red-500 fill-red-500 inline-block" /> for productivity enthusiasts.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/sitemap" className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 rounded-md px-1 py-0.5">Sitemap</Link>
            <Link href="/status" className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 rounded-md px-1 py-0.5">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  )
})
