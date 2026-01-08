'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle, Upload, X } from 'lucide-react';
import { Section } from '@/components';
import { submitQuoteRequest } from '@/app/actions/quote';
import { quoteRequestSchema } from '@/lib/validations';
import type { SiteSettings } from '@/lib/types';

interface ContactPageClientProps {
  siteSettings: SiteSettings;
  serviceTypes: string[];
}

export default function ContactPageClient({
  siteSettings,
  serviceTypes,
}: ContactPageClientProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Client-side validation first
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: (formData.get('email') as string) || undefined,
      service_type: formData.get('service_type') as string,
      location: (formData.get('location') as string) || undefined,
      description: formData.get('description') as string,
    };

    const result = quoteRequestSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Add files to FormData
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Submit via server action
    const submitResult = await submitQuoteRequest(formData);

    setIsSubmitting(false);

    if (submitResult.success) {
      setIsSubmitted(true);
    } else {
      setSubmitError(submitResult.error || 'Failed to submit. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <>
        <section className="relative min-h-[50vh] flex items-center justify-center bg-[#1a1a2e] pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle size={64} className="text-[#d4a853] mx-auto mb-6" />
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Thank You!
              </h1>
              <p className="text-lg text-gray-300 max-w-md mx-auto">
                We&apos;ve received your quote request. Our team will review your project
                and get back to you within 24-48 hours.
              </p>
            </motion.div>
          </div>
        </section>
        <Section background="white">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              In the meantime, feel free to explore our portfolio or learn more about
              our services.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/portfolio"
                className="bg-[#1a1a2e] hover:bg-[#2d2d44] text-white px-6 py-3 font-semibold transition-colors"
              >
                View Portfolio
              </a>
              <a
                href="/services"
                className="border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white px-6 py-3 font-semibold transition-all"
              >
                Our Services
              </a>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center bg-[#1a1a2e] pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Ready to start your project? Fill out the form below for a free quote,
            or reach out directly.
          </motion.p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <Section background="white">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8">
              Have questions about your project? We&apos;re here to help. Reach out
              directly or fill out the form.
            </p>

            <div className="space-y-6">
              <a
                href={`tel:${siteSettings.phone}`}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#d4a853]/20 transition-colors">
                  <Phone size={22} className="text-[#d4a853]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-600 group-hover:text-[#d4a853] transition-colors">
                    {siteSettings.phone}
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${siteSettings.email}`}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#d4a853]/20 transition-colors">
                  <Mail size={22} className="text-[#d4a853]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600 group-hover:text-[#d4a853] transition-colors">
                    {siteSettings.email}
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} className="text-[#d4a853]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Service Area</p>
                  <p className="text-gray-600">{siteSettings.service_area}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quote Request Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-50 p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Request a Free Quote
              </h2>

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
                  {submitError}
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`w-full px-4 py-3 border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-[#d4a853] transition-colors`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`w-full px-4 py-3 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-[#d4a853] transition-colors`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full px-4 py-3 border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-[#d4a853] transition-colors`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Service Type */}
                  <div>
                    <label
                      htmlFor="service_type"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="service_type"
                      name="service_type"
                      className={`w-full px-4 py-3 border ${
                        errors.service_type ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-[#d4a853] transition-colors bg-white`}
                    >
                      <option value="">Select a service</option>
                      {serviceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.service_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.service_type}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location/Zip Code <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853] transition-colors"
                    placeholder="City, State or Zip Code"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    className={`w-full px-4 py-3 border ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:border-[#d4a853] transition-colors resize-none`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos <span className="text-gray-400">(optional, max 5)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#d4a853] transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <span className="text-gray-600">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-gray-400 text-sm mt-1">
                        PNG, JPG up to 10MB each
                      </span>
                    </label>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 px-4 py-2"
                        >
                          <span className="text-sm text-gray-700 truncate">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#d4a853] hover:bg-[#c49943] disabled:bg-gray-400 text-[#1a1a2e] px-8 py-4 font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin w-5 h-5 border-2 border-[#1a1a2e] border-t-transparent rounded-full" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Submit Quote Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
