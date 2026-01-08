'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

const serviceLinks = [
  { href: '/services#patio-installation', label: 'Patios' },
  { href: '/services#retaining-walls', label: 'Retaining Walls' },
  { href: '/services#walkways-&-paths', label: 'Walkways' },
  { href: '/services#driveways', label: 'Driveways' },
];

interface FooterProps {
  siteSettings?: SiteSettings;
}

// Default values for fallback
const defaultSettings = {
  business_name: 'FJ Stone & Hardscaping',
  phone: '(555) 123-4567',
  email: 'info@fjstone.com',
  service_area: 'Greater Metro Area',
};

export default function Footer({ siteSettings }: FooterProps) {
  const settings = siteSettings || defaultSettings;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              FJ<span className="text-[#d4a853]">Stone</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Expert hardscaping and stonework for residential and commercial properties.
              Quality craftsmanship built to last.
            </p>
            <div className="space-y-3">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 text-gray-400 hover:text-[#d4a853] transition-colors"
              >
                <Phone size={18} />
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-[#d4a853] transition-colors"
              >
                <Mail size={18} />
                {settings.email}
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} />
                {settings.service_area}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#d4a853] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#d4a853] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get Started</h4>
            <p className="text-gray-400 mb-4">
              Ready to transform your outdoor space? Contact us for a free consultation.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#d4a853] hover:bg-[#c49943] text-[#1a1a2e] px-6 py-3 font-semibold transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-[#d4a853] transition-colors"
            aria-label="Back to top"
          >
            <span className="text-sm">Back to top</span>
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
