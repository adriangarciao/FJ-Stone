import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for F&J Stone Services. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center justify-center bg-[#292323] pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#292323] to-[#71706e]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-300">
            Last updated: January 2026
          </p>
        </div>
      </section>

      <Section background="white">
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-600 mb-6">
            F&J&apos;s Stone Services (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to 
            protecting your personal information. This Privacy Policy explains how we collect, use, and 
            safeguard your information when you visit our website or submit a quote request.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            When you submit a quote request through our website, we collect:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li><strong>Contact Information:</strong> Your name, phone number, and email address</li>
            <li><strong>Project Details:</strong> Service type, location/address, and project description</li>
            <li><strong>Photos:</strong> Any images you upload to help us understand your project</li>
            <li><strong>Technical Data:</strong> IP address and browser information for security purposes</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            We use the information you provide to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Respond to your quote request and provide estimates</li>
            <li>Contact you about your project</li>
            <li>Schedule consultations and site visits</li>
            <li>Improve our services and website</li>
            <li>Prevent spam and fraudulent submissions</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
          <p className="text-gray-600 mb-6">
            We do <strong>not</strong> sell, trade, or rent your personal information to third parties. 
            We may share your information only with trusted service providers who assist us in operating 
            our website (such as our hosting provider and email service), and only to the extent necessary 
            to provide our services to you.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement appropriate security measures to protect your personal information, including 
            encrypted data transmission (HTTPS), secure database storage, and access controls. However, 
            no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
          <p className="text-gray-600 mb-6">
            We retain your quote request information for as long as necessary to fulfill the purposes 
            outlined in this policy, typically for the duration of any ongoing project discussions and 
            a reasonable period afterward for record-keeping purposes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
          <p className="text-gray-600 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt out of any marketing communications</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Analytics</h2>
          <p className="text-gray-600 mb-6">
            Our website uses Vercel Analytics to understand how visitors use our site. This service 
            collects anonymous usage data to help us improve our website. We do not use cookies for 
            advertising or tracking purposes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about this Privacy Policy or wish to exercise your rights, 
            please contact us at:
          </p>
          <div className="bg-gray-50 p-6 mb-6">
            <p className="text-gray-700 font-semibold">F&J&apos;s Stone Services</p>
            <p className="text-gray-600">Email: fjstoneservices@gmail.com</p>
            <p className="text-gray-600">Phone: (847) 847-9376</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
          <p className="text-gray-600 mb-8">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page 
            with an updated revision date. We encourage you to review this page periodically.
          </p>

          <div className="border-t pt-6">
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
