'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const animatedWords = [
    { text: 'SWIFT', angle: 'top-left', delay: 0 },
    { text: 'RELIABLE', angle: 'top-right', delay: 0.2 },
    { text: 'TRUSTED', angle: 'bottom-left', delay: 0.4 },
    { text: 'GLOBAL', angle: 'bottom-right', delay: 0.6 },
    { text: 'SECURE', angle: 'left', delay: 0.8 },
    { text: 'FAST', angle: 'right', delay: 1.0 },
  ];

  return (
      <div className="min-h-screen bg-white">
        {/* Top Bar */}
        <div className="bg-[#2d2d2d] text-white py-3 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="mb-2 md:mb-0">The Reliable Delivery Company. Your friend with a truck.</p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Make a call: +1(123)456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>4789 Melmorn Ton Mashinton Town</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="w-14 h-14 bg-[#8BC34A] rounded-full flex items-center justify-center relative">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div className="absolute -bottom-1 w-full h-2 bg-[#7CB342] rounded-full"></div>
                </div>
                <span className="text-3xl font-bold text-[#2d2d2d]">MovingCargo</span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center gap-8">
                <Link href="/" className="text-[#8BC34A] font-medium hover:text-[#7CB342] transition-colors">
                  Home
                </Link>
                <Link href="/track" className="text-gray-700 font-medium hover:text-[#8BC34A] transition-colors">
                  Track
                </Link>
                <Link href="/services" className="text-gray-700 font-medium hover:text-[#8BC34A] transition-colors">
                  Services
                </Link>
                <Link href="/testimonials" className="text-gray-700 font-medium hover:text-[#8BC34A] transition-colors">
                  Testimonials
                </Link>

                <button className="text-gray-700 hover:text-[#8BC34A] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                <div className="relative">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-[#8BC34A] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
                </div>

                <Link href="/admin/login" className="px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded hover:bg-[#7CB342] transition-colors">
                  Login
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                  className="lg:hidden text-gray-700"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section with Animated Words */}
        <section className="relative h-[600px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920')"
          }}>
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Animated Background Words */}
          <div className="absolute inset-0 overflow-hidden">
            {animatedWords.map((word, idx) => (
                <div
                    key={idx}
                    className={`absolute text-6xl md:text-8xl font-bold text-white/10 animate-word-${word.angle}`}
                    style={{
                      animationDelay: `${word.delay}s`,
                      ...(word.angle === 'top-left' && { top: '-10%', left: '-10%' }),
                      ...(word.angle === 'top-right' && { top: '-10%', right: '-10%' }),
                      ...(word.angle === 'bottom-left' && { bottom: '-10%', left: '-10%' }),
                      ...(word.angle === 'bottom-right' && { bottom: '-10%', right: '-10%' }),
                      ...(word.angle === 'left' && { top: '50%', left: '-15%', transform: 'translateY(-50%)' }),
                      ...(word.angle === 'right' && { top: '50%', right: '-15%', transform: 'translateY(-50%)' }),
                    }}
                >
                  {word.text}
                </div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
            <div className={`text-white max-w-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Moving families to<br />
                better lives since <span className="text-[#8BC34A]">1945</span>
              </h1>
              <p className="text-xl mb-8">A Truly Moving Experience</p>
              <Link href="/services" className="inline-block px-8 py-4 bg-[#8BC34A] text-white font-semibold rounded hover:bg-[#7CB342] transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#8BC34A]/50">
                Our Services
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-[#8BC34A] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                  ),
                  title: 'Transparent Best Pricing',
                  description: 'International supply chains involves challenging regulations of international.'
                },
                {
                  icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                  ),
                  title: 'Real Time Tracking',
                  description: 'Ensure customers supply chains are fully compliant with practices.'
                },
                {
                  icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                  ),
                  title: 'Security System Cargo',
                  description: 'High security requirements and certified to local for regulation of standards.'
                },
                {
                  icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                  ),
                  title: 'Warehousing Storage',
                  description: 'Depending on your product, we provide warehouse activities for warehouse.'
                }
              ].map((service, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-6 group hover:shadow-xl transition-shadow">
                    <div className="text-[#8BC34A] mb-4">{service.icon}</div>
                    <h3 className="text-xl font-bold text-[#2d2d2d] mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <button className="w-10 h-10 bg-[#2d2d2d] text-white rounded-full flex items-center justify-center group-hover:bg-[#8BC34A] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-4">
              <p className="text-[#8BC34A] font-semibold text-lg">Real Solution, Real Fast!</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2d2d2d] mb-16">
              Best Global Logistics Solutions.
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="relative h-96 bg-cover bg-center rounded-lg" style={{
                backgroundImage: "url('https://unsplash.com/photos/white-airliner-on-tarmack-oCsQLKENz34')"
              }}>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#8BC34A] rounded-lg flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#2d2d2d] mb-4">Air Freight Services</h3>
                <p className="text-gray-600 mb-6">
                  At our Auto Service garage, we are fully appreciate how difficult it is for people to find.
                </p>
                <Link href="/services" className="inline-flex items-center gap-2 text-[#8BC34A] font-semibold hover:gap-4 transition-all">
                  <span>Read More</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-bold text-[#2d2d2d] mb-4">Drone Services</h3>
                <p className="text-gray-600 mb-6">
                  These are unique and often they differ from one industry to the other. Our logistics expertise.
                </p>
                <Link href="/services" className="inline-flex items-center gap-2 text-[#8BC34A] font-semibold hover:gap-4 transition-all">
                  <span>Read More</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative h-96 bg-cover bg-center rounded-lg order-1 md:order-2" style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800')"
              }}>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#8BC34A] rounded-lg flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full text-[#2d2d2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#2d2d2d] mb-2">Branches Across The World 145+</h3>
                  <p className="text-gray-600">With over 150 branches all over the world we ensure rapid delivery of packages.</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full text-[#2d2d2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#2d2d2d] mb-2">2.9K+ Parcel Delivered By Team</h3>
                  <p className="text-gray-600">We treat all our clients request with care and adequate speed to ensure the quality of service never changes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2d2d2d] text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Company Info */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold">MovingCargo</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#8BC34A] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>

                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-300">Contact@movingcargo.com</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-gray-300">(+02) 1800 5656 3010</p>
                  </div>
                </div>
              </div>

              {/* Our Services */}
              <div>
                <h3 className="text-xl font-bold mb-6">Our Services</h3>
                <ul className="space-y-3">
                  <li><Link href="/services" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Land Transport</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Consumer Goods</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Big Trailer Truck</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Main Load Truck</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Sea Cargo Freight</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Trade Consultancy</Link></li>
                </ul>
              </div>

              {/* Useful Links */}
              <div>
                <h3 className="text-xl font-bold mb-6">Useful Links</h3>
                <ul className="space-y-3">
                  <li><Link href="/contact" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Get In Touch</Link></li>
                  <li><Link href="/track" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Real Time Tracking</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Delivery Report</Link></li>
                  <li><Link href="/services" className="text-[#8BC34A] hover:text-white transition-colors">Supply Management</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Download Broucher</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Transport Service</Link></li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-xl font-bold mb-6">Newsletter Signup</h3>
                <p className="text-gray-300 mb-4">Subscribe To Our Newsletter And Get Daily 10% Off Your First Purchase.</p>
                <div className="flex flex-col gap-3">
                  <input
                      type="email"
                      placeholder="Your email"
                      className="px-4 py-3 bg-[#1a1a1a] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  />
                  <button className="px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded hover:bg-[#7CB342] transition-colors">
                    Subscribe
                  </button>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-[#1a1a1a] rounded flex items-center justify-center hover:bg-[#8BC34A] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#1a1a1a] rounded flex items-center justify-center hover:bg-[#8BC34A] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#1a1a1a] rounded flex items-center justify-center hover:bg-[#8BC34A] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                Copyright 2024 MovingCargo, All Rights Reserved. Powered By CymolThemes
              </p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-gray-400 hover:text-[#8BC34A] text-sm transition-colors">Privacy</Link>
                <Link href="/about" className="text-gray-400 hover:text-[#8BC34A] text-sm transition-colors">About Us</Link>
                <Link href="/contact" className="text-gray-400 hover:text-[#8BC34A] text-sm transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </footer>

        <style jsx global>{`
        @keyframes word-top-left {
          0% {
            transform: translate(-100%, -100%) rotate(-45deg);
            opacity: 0;
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes word-top-right {
          0% {
            transform: translate(100%, -100%) rotate(45deg);
            opacity: 0;
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes word-bottom-left {
          0% {
            transform: translate(-100%, 100%) rotate(45deg);
            opacity: 0;
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes word-bottom-right {
          0% {
            transform: translate(100%, 100%) rotate(-45deg);
            opacity: 0;
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes word-left {
          0% {
            transform: translate(-150%, -50%) rotate(-90deg);
            opacity: 0;
          }
          100% {
            transform: translate(0, -50%) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes word-right {
          0% {
            transform: translate(150%, -50%) rotate(90deg);
            opacity: 0;
          }
          100% {
            transform: translate(0, -50%) rotate(0deg);
            opacity: 1;
          }
        }

        .animate-word-top-left {
          animation: word-top-left 1.5s ease-out forwards;
        }

        .animate-word-top-right {
          animation: word-top-right 1.5s ease-out forwards;
        }

        .animate-word-bottom-left {
          animation: word-bottom-left 1.5s ease-out forwards;
        }

        .animate-word-bottom-right {
          animation: word-bottom-right 1.5s ease-out forwards;
        }

        .animate-word-left {
          animation: word-left 1.5s ease-out forwards;
        }

        .animate-word-right {
          animation: word-right 1.5s ease-out forwards;
        }
      `}</style>
      </div>
  );
}