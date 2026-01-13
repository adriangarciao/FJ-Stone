import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for F&J Stone Services website. Read our terms and conditions for using our services.',
};

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center justify-center bg-[#292323] pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#292323] to-[#71706e]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-300">
            Last updated: January 2026
          </p>
        </div>
      </section>

      <Section background="white">
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing and using the F&J&apos;s Stone Services website, you agree to be bound by these 
            Terms of Service. If you do not agree with any part of these terms, please do not use our website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Our Website</h2>
          <p className="text-gray-600 mb-4">
            You agree to use our website only for lawful purposes and in a manner that does not:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Interfere with the operation of our website</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Submit false or misleading information</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quote Requests</h2>
          <p className="text-gray-600 mb-6">
            When you submit a quote request through our website, you agree that:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>The information you provide is accurate and complete</li>
            <li>You are authorized to request services for the property in question</li>
            <li>Quote estimates are non-binding and subject to change upon site inspection</li>
            <li>We may contact you using the information provided to discuss your project</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Services and Pricing</h2>
          <p className="text-gray-600 mb-6">
            All services described on our website are subject to availability. Prices and project scopes 
            are determined on a case-by-case basis after consultation and site assessment. Online quotes 
            are estimates only; final pricing will be provided in a written proposal before any work begins.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
          <p className="text-gray-600 mb-6">
            All content on this website, including text, images, logos, and photographs of our work, 
            is the property of F&J&apos;s Stone Services and is protected by copyright laws. You may not 
            reproduce, distribute, or use our content without written permission.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Photos You Submit</h2>
          <p className="text-gray-600 mb-6">
            When you upload photos with your quote request, you grant us permission to use those photos 
            solely for the purpose of evaluating your project and preparing estimates. We will not use 
            your photos for marketing purposes without your explicit consent.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            This website is provided &quot;as is&quot; without warranties of any kind. F&J&apos;s Stone Services 
            shall not be liable for any damages arising from the use of this website or reliance on 
            information provided herein. Our liability for any services we provide will be governed 
            by our service agreements.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
          <p className="text-gray-600 mb-6">
            Our website may contain links to third-party websites. We are not responsible for the 
            content, privacy practices, or terms of service of these external sites.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify these Terms of Service at any time. Changes will be effective 
            immediately upon posting to this page. Your continued use of the website after changes 
            constitutes acceptance of the modified terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
          <p className="text-gray-600 mb-6">
            These Terms of Service shall be governed by and construed in accordance with the laws of 
            the State of Illinois, without regard to conflict of law principles.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-gray-50 p-6 mb-8">
            <p className="text-gray-700 font-semibold">F&J&apos;s Stone Services</p>
            <p className="text-gray-600">Email: fjstoneservices@gmail.com</p>
            <p className="text-gray-600">Phone: (847) 847-9376</p>
          </div>

          <div className="border-t pt-6 flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="inline-block border-2 border-[#292323] text-[#292323] hover:bg-[#292323] hover:text-white px-6 py-3 font-semibold transition-all"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-[#990303] hover:bg-[#71706e] text-white px-6 py-3 font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
