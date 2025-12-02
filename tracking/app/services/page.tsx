'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Service {
    id: number;
    icon: JSX.Element;
    title: string;
    description: string;
    features: string[];
    delay: number;
}

export default function ServicesPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeService, setActiveService] = useState<number | null>(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const services: Service[] = [
        {
            id: 1,
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            ),
            title: 'Road Transport',
            description: 'Fast and reliable ground delivery services with real-time tracking across all major cities.',
            features: ['24/7 Tracking', 'Express Delivery', 'Insurance Coverage', 'Door-to-Door Service'],
            delay: 0.1
        },
        {
            id: 2,
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            ),
            title: 'Air Freight',
            description: 'International air cargo services for time-sensitive deliveries worldwide with customs clearance.',
            features: ['Global Coverage', 'Same-Day Options', 'Customs Support', 'Temperature Control'],
            delay: 0.2
        },
        {
            id: 3,
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            ),
            title: 'Sea Cargo',
            description: 'Cost-effective ocean freight solutions for bulk shipments and container logistics.',
            features: ['Container Shipping', 'Bulk Cargo', 'Port Services', 'Freight Forwarding'],
            delay: 0.3
        },
        {
            id: 4,
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            title: 'Warehousing',
            description: 'Secure storage facilities with inventory management and distribution services.',
            features: ['Climate Control', 'Security 24/7', 'Inventory Management', 'Distribution'],
            delay: 0.4
        },
        {
            id: 5,
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Insurance & Security',
            description: 'Comprehensive cargo insurance and security solutions for high-value shipments.',
            features: ['Full Coverage', 'Risk Assessment', 'Claims Support', 'Secure Transport'],
            delay: 0.5
        },
        {
            id: 6,
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Real-Time Tracking',
            description: 'Advanced GPS tracking system with live updates and detailed delivery analytics.',
            features: ['Live GPS', 'SMS Alerts', 'Route Optimization', 'Delivery Proof'],
            delay: 0.6
        }
    ];

    const animatedWords = [
        { text: 'FAST', angle: 'top-left', delay: 0 },
        { text: 'RELIABLE', angle: 'top-right', delay: 0.2 },
        { text: 'SECURE', angle: 'bottom-left', delay: 0.4 },
        { text: 'GLOBAL', angle: 'bottom-right', delay: 0.6 },
        { text: 'PROFESSIONAL', angle: 'left', delay: 0.8 },
        { text: 'EFFICIENT', angle: 'right', delay: 1.0 },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-[#8BC34A] rounded-full flex items-center justify-center relative">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <div className="absolute -bottom-1 w-full h-2 bg-[#7CB342] rounded-full"></div>
                            </div>
                            <span className="text-3xl font-bold text-[#2d2d2d]">MovingCargo</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            <Link href="/" className="text-gray-700 font-medium hover:text-[#8BC34A] transition-colors">
                                Home
                            </Link>
                            <Link href="/track" className="text-gray-700 font-medium hover:text-[#8BC34A] transition-colors">
                                Track
                            </Link>
                            <Link href="/services" className="text-[#8BC34A] font-medium hover:text-[#7CB342] transition-colors">
                                Services
                            </Link>
                            <Link href="/testimonials" className="text-gray-700 font-medium hover:text-[#8BC34A] transition-colors">
                                Testimonials
                            </Link>
                            <Link href="/admin/login" className="px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded hover:bg-[#7CB342] transition-colors">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Animated Words */}
            <section className="relative min-h-[70vh] bg-gradient-to-br from-[#2d2d2d] via-[#3d3d3d] to-[#2d2d2d] overflow-hidden">
                {/* Animated Background Words */}
                <div className="absolute inset-0 overflow-hidden">
                    {animatedWords.map((word, idx) => (
                        <div
                            key={idx}
                            className={`absolute text-6xl md:text-8xl font-bold text-white/5 animate-word-${word.angle}`}
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
                <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center min-h-[70vh]">
                    <div className="text-center w-full">
                        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <p className="text-[#8BC34A] text-lg font-semibold mb-4">COMPREHENSIVE SOLUTIONS</p>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                Our Premium<br />
                                <span className="text-[#8BC34A]">Logistics Services</span>
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                                Delivering excellence across land, air, and sea with cutting-edge technology and unmatched reliability.
                            </p>
                            <Link href="/track" className="inline-block px-8 py-4 bg-[#8BC34A] text-white font-semibold rounded-lg hover:bg-[#7CB342] transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#8BC34A]/50">
                                Track Your Shipment
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-[#8BC34A] font-semibold text-lg mb-4">WHAT WE OFFER</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#2d2d2d] mb-6">
                            Complete Logistics Solutions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From pickup to delivery, we handle every aspect of your shipment with precision and care.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, idx) => (
                            <div
                                key={service.id}
                                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
                                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                                style={{ transitionDelay: `${service.delay}s` }}
                                onMouseEnter={() => setActiveService(service.id)}
                                onMouseLeave={() => setActiveService(null)}
                            >
                                {/* Icon */}
                                <div className={`w-24 h-24 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                                    activeService === service.id ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                                }`}>
                                    <div className="text-white">{service.icon}</div>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4 group-hover:text-[#8BC34A] transition-colors">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-3 mb-6">
                                    {service.features.map((feature, featureIdx) => (
                                        <li key={featureIdx} className="flex items-center gap-3 text-gray-700">
                                            <svg className="w-5 h-5 text-[#8BC34A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button className="w-full py-3 bg-[#2d2d2d] text-white font-semibold rounded-lg group-hover:bg-[#8BC34A] transition-all duration-300">
                                    Learn More
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-[#8BC34A] font-semibold text-lg mb-4">WHY CHOOSE US</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2d2d] mb-6">
                                Industry-Leading Service Standards
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                With over 25 years of experience and 145+ branches worldwide, we deliver excellence in every shipment.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { label: 'On-Time Delivery', percentage: 98 },
                                    { label: 'Customer Satisfaction', percentage: 96 },
                                    { label: 'Global Coverage', percentage: 95 },
                                    { label: 'Cargo Safety', percentage: 99 }
                                ].map((stat, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold text-[#2d2d2d]">{stat.label}</span>
                                            <span className="font-bold text-[#8BC34A]">{stat.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: isVisible ? `${stat.percentage}%` : '0%',
                                                    transitionDelay: `${idx * 0.2}s`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"
                                    alt="Logistics warehouse"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2d2d2d]/80 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <h3 className="text-3xl font-bold mb-2">2.9K+</h3>
                                    <p className="text-lg">Parcels Delivered Daily</p>
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-6 animate-float">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2d2d2d]">ISO Certified</p>
                                        <p className="text-sm text-gray-600">Quality Assured</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 animate-float-delayed">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2d2d2d]">24/7 Support</p>
                                        <p className="text-sm text-gray-600">Always Available</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-[#8BC34A] to-[#7CB342]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Ship Your Cargo?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Get a free quote or track your existing shipment in real-time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/track" className="px-8 py-4 bg-white text-[#8BC34A] font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
                            Track Shipment
                        </Link>
                        <Link href="/contact" className="px-8 py-4 bg-[#2d2d2d] text-white font-semibold rounded-lg hover:bg-black transition-all hover:scale-105 shadow-lg">
                            Request Quote
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#2d2d2d] text-white py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-gray-400">© 2024 MovingCargo. All rights reserved.</p>
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 0.5s;
        }
      `}</style>
        </div>
    );
}