'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    company: string;
    image: string;
    rating: number;
    testimonial: string;
    delay: number;
}

export default function TestimonialsPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState<number | null>(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Logistics Manager',
            company: 'TechCorp Industries',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            rating: 5,
            testimonial: 'MovingCargo has revolutionized our supply chain management. The real-time tracking and professional service have exceeded all our expectations. Highly recommended!',
            delay: 0.1
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Supply Chain Director',
            company: 'Global Imports Ltd',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            rating: 5,
            testimonial: 'Outstanding service! They handled our international shipments with utmost care and precision. The customer support team is always available and incredibly helpful.',
            delay: 0.2
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            role: 'Operations Manager',
            company: 'Fashion Forward Inc',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            rating: 5,
            testimonial: 'We\'ve been using MovingCargo for over 2 years now. Their reliability and efficiency have helped us scale our business globally. The tracking system is phenomenal!',
            delay: 0.3
        },
        {
            id: 4,
            name: 'David Williams',
            role: 'CEO',
            company: 'Electronics Hub',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            rating: 5,
            testimonial: 'Professional, reliable, and cost-effective. MovingCargo has become an integral part of our logistics operations. Their air freight service is second to none.',
            delay: 0.4
        },
        {
            id: 5,
            name: 'Jennifer Lee',
            role: 'Warehouse Supervisor',
            company: 'MegaMart Distribution',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
            rating: 4,
            testimonial: 'The warehousing solutions provided by MovingCargo are top-notch. Security, inventory management, and timely distribution - everything is handled perfectly.',
            delay: 0.5
        },
        {
            id: 6,
            name: 'Robert Taylor',
            role: 'Procurement Head',
            company: 'AutoParts Pro',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            rating: 5,
            testimonial: 'Exceptional service quality! The team goes above and beyond to ensure our shipments arrive on time. The real-time updates give us complete peace of mind.',
            delay: 0.6
        },
        {
            id: 7,
            name: 'Lisa Anderson',
            role: 'Import/Export Manager',
            company: 'Gourmet Foods Co',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
            rating: 5,
            testimonial: 'MovingCargo handles our temperature-controlled shipments flawlessly. Their attention to detail and commitment to quality is unmatched in the industry.',
            delay: 0.7
        },
        {
            id: 8,
            name: 'James Martinez',
            role: 'Business Owner',
            company: 'Crafted Furniture',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
            rating: 5,
            testimonial: 'From small parcels to large freight, MovingCargo handles everything with professionalism. Their customer service is responsive and always ready to help.',
            delay: 0.8
        },
        {
            id: 9,
            name: 'Amanda White',
            role: 'E-commerce Director',
            company: 'StyleHub Online',
            image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400',
            rating: 5,
            testimonial: 'As an e-commerce business, reliable logistics is crucial. MovingCargo has been our trusted partner for 3 years. Their tracking system integrates seamlessly with our platform.',
            delay: 0.9
        },
        {
            id: 10,
            name: 'Thomas Brown',
            role: 'Logistics Coordinator',
            company: 'Pharma Solutions',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            rating: 5,
            testimonial: 'The best logistics partner we\'ve ever worked with! Their compliance with pharmaceutical shipping regulations and secure handling gives us complete confidence.',
            delay: 1.0
        }
    ];

    const animatedWords = [
        { text: 'TRUSTED', angle: 'top-left', delay: 0 },
        { text: 'EXCELLENCE', angle: 'top-right', delay: 0.2 },
        { text: 'QUALITY', angle: 'bottom-left', delay: 0.4 },
        { text: 'SATISFIED', angle: 'bottom-right', delay: 0.6 },
        { text: 'RELIABLE', angle: 'left', delay: 0.8 },
        { text: 'PROFESSIONAL', angle: 'right', delay: 1.0 },
    ];

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, idx) => (
                    <svg
                        key={idx}
                        className={`w-5 h-5 ${idx < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                    </svg>
                ))}
            </div>
        );
    };

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
                            <Link href="/services" className="text-gray-700 font-medium hover:text-[#8BC34A] transition-colors">
                                Services
                            </Link>
                            <Link href="/testimonials" className="text-[#8BC34A] font-medium hover:text-[#7CB342] transition-colors">
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
                            <p className="text-[#8BC34A] text-lg font-semibold mb-4">CUSTOMER STORIES</p>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                What Our Clients<br />
                                <span className="text-[#8BC34A]">Say About Us</span>
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                                Don't just take our word for it. Here's what our satisfied customers have to say about their experience with MovingCargo.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#8BC34A] mb-2">2,500+</div>
                                    <div className="text-gray-300">Happy Clients</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#8BC34A] mb-2">4.9/5</div>
                                    <div className="text-gray-300">Average Rating</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#8BC34A] mb-2">98%</div>
                                    <div className="text-gray-300">Satisfaction Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-[#8BC34A] font-semibold text-lg mb-4">REAL EXPERIENCES</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#2d2d2d] mb-6">
                            Trusted by Industry Leaders
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From small businesses to Fortune 500 companies, see why thousands choose MovingCargo for their logistics needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
                                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                                style={{ transitionDelay: `${testimonial.delay}s` }}
                                onMouseEnter={() => setActiveTestimonial(testimonial.id)}
                                onMouseLeave={() => setActiveTestimonial(null)}
                            >
                                {/* Quote Icon */}
                                <div className="text-[#8BC34A] mb-4">
                                    <svg className="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>

                                {/* Rating */}
                                <div className="mb-4">
                                    {renderStars(testimonial.rating)}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                                    "{testimonial.testimonial}"
                                </p>

                                {/* Client Info */}
                                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                                    <div className={`relative transition-all duration-500 ${
                                        activeTestimonial === testimonial.id ? 'scale-110' : 'scale-100'
                                    }`}>
                                        <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-[#8BC34A]/20">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Green checkmark badge */}
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#8BC34A] rounded-full flex items-center justify-center ring-2 ring-white">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-[#2d2d2d] text-lg">{testimonial.name}</h4>
                                        <p className="text-[#8BC34A] font-semibold text-sm">{testimonial.role}</p>
                                        <p className="text-gray-600 text-sm">{testimonial.company}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Badges Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2d2d2d] mb-4">
                            Trusted & Certified
                        </h2>
                        <p className="text-lg text-gray-600">
                            Our commitment to excellence is backed by industry-leading certifications
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: '🏆', label: 'ISO 9001 Certified' },
                            { icon: '✓', label: 'Industry Leader' },
                            { icon: '🔒', label: 'Secure Transport' },
                            { icon: '🌍', label: 'Global Network' }
                        ].map((badge, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-50 rounded-xl p-6 text-center hover:bg-[#8BC34A] hover:text-white transition-all duration-300 cursor-pointer group"
                            >
                                <div className="text-5xl mb-3">{badge.icon}</div>
                                <p className="font-semibold group-hover:text-white">{badge.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-[#8BC34A] to-[#7CB342]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Join 2,500+ Satisfied Customers
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Experience the difference with MovingCargo. Start shipping with confidence today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact" className="px-8 py-4 bg-white text-[#8BC34A] font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
                            Get Started
                        </Link>
                        <Link href="/track" className="px-8 py-4 bg-[#2d2d2d] text-white font-semibold rounded-lg hover:bg-black transition-all hover:scale-105 shadow-lg">
                            Track Shipment
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