'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LocationSelector from '@/components/LocationSelector';
import DeliveryFlow from '@/components/DeliveryFlow';

// Image mapping for products
const PRODUCT_IMAGES = {
    'SAND ALOHA': 'SAND ALOHA.JPG',
    'SAND ATUN': 'SAND ATUN.jpg',
    'SAND HAWAIANO': 'SAND HAWAIANO.JPG',
    'SAND MIXTO': 'SAND MIXTO.JPG',
    'SAND POLLO PIÑA': 'SAND POLLO PIÑA.JPG',
    'SAND POLLO': 'SAND POLLO.JPG',
    'SAND ROPA VIEJA': 'SAND ROPA VIEJA.JPG',
    'SAND SALAMI PEPPERONI': 'SAND SALAMI PEPPERONI.JPG',
    'SAND SUPREMO CARNE': 'SAND SUPREMO CARNE.jpg',
    'SAND SUPREMO POLLO': 'SAND SUPREMO POLLO.JPG',
    'SAND VEGETARIANO': 'SAND VEGETARIANO.jpg'
};

const getProductImage = (product) => {
    if (!product || !product.name) return null;
    const normalizedName = product.name.toUpperCase().trim();
    if (PRODUCT_IMAGES[normalizedName]) {
        return `/images/products/${PRODUCT_IMAGES[normalizedName]}`;
    }
    if (product.image_url) return product.image_url;
    return null;
};

// Carrusel de sandwiches destacados — 3 fijos, sin promociones
const CAROUSEL_SANDWICHES = [
    {
        id: 1,
        name: 'Sand Atún',
        image: 'SAND ATUN.jpg',
        description: 'La opción clásica que nunca falla. Atún fresco con nuestra salsa de ajo.',
    },
    {
        id: 2,
        name: 'Sand Supremo Pollo',
        image: 'SAND SUPREMO POLLO.JPG',
        description: 'Pollo jugoso, tomate, lechuga y nuestra salsa especial suprema.',
    },
    {
        id: 3,
        name: 'Sand Ropa Vieja',
        image: 'SAND ROPA VIEJA.JPG',
        description: 'Carne desmechada estilo casero con el sabor que nos caracteriza.',
    },
];

export default function Home() {
    const router = useRouter();
    // Carrusel
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    // Estado del modal de selección de sede
    const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
    // Estado del flujo de domicilio
    const [showDeliveryFlow, setShowDeliveryFlow] = useState(false);

    // Pedidos — último pedido realizado (persiste en localStorage)
    const [lastOrderId, setLastOrderId] = useState(null);
    const [showOrderTooltip, setShowOrderTooltip] = useState(false);
    const tooltipTimerRef = useRef(null);

    // Auto-rotación carrusel cada 2 s
    useEffect(() => {
        const timer = setInterval(() => {
            setCarouselIndex(prev => (prev + 1) % CAROUSEL_SANDWICHES.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    // Leer último pedido de localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('paninos_last_order');
            if (saved) setLastOrderId(saved);
        } catch { /* noop */ }
    }, []);

    // Cleanup del timer del tooltip
    useEffect(() => () => clearTimeout(tooltipTimerRef.current), []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleStorePickup = () => {
        // Abre el selector de sede en lugar de ir directamente al menú
        setIsLocationSelectorOpen(true);
    };

    const handleDelivery = () => {
        setShowDeliveryFlow(true);
    };

    const handleContactB2B = () => {
        window.open('https://wa.me/573218898930?text=Hola!%20Me%20interesa%20información%20sobre%20catering%20corporativo%20con%20Paninos', '_blank');
    };

    const handlePedidosClick = () => {
        if (lastOrderId) {
            router.push(`/confirmacion?order=${lastOrderId}`);
        } else {
            // Mostrar tooltip flotante por 2.5 s
            setShowOrderTooltip(true);
            clearTimeout(tooltipTimerRef.current);
            tooltipTimerRef.current = setTimeout(() => setShowOrderTooltip(false), 2500);
        }
    };

    // Mostrar el flujo de domicilio como pantalla completa
    if (showDeliveryFlow) {
        return (
            <DeliveryFlow
                onClose={() => setShowDeliveryFlow(false)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans pb-20">

            {/* Modal de selección de sede */}
            <LocationSelector
                isOpen={isLocationSelectorOpen}
                onClose={() => setIsLocationSelectorOpen(false)}
            />

            {/* Sticky Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-paninos-yellow shadow-lg shadow-black/30 rounded-b-3xl py-2'
                    : 'bg-transparent py-4'
                }`}>
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div className={`transition-all duration-300 ${scrolled ? 'w-20' : 'w-24'}`}>
                        <Image
                            src="/images/logo.png"
                            alt="Paninos Logo"
                            width={100}
                            height={50}
                            className="object-contain"
                        />
                    </div>

                    {/* Cart / Menu Icon */}
                    <button
                        onClick={() => router.push('/menu')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${scrolled
                                ? 'bg-black text-paninos-yellow hover:bg-black/80'
                                : 'bg-paninos-yellow/20 text-paninos-yellow hover:bg-paninos-yellow hover:text-black'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Immersive Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/products/fondoHome.png"
                        alt="Hero Background"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10 md:mt-0">
                    <h1 className="font-lora italic text-paninos-yellow text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up leading-tight drop-shadow-lg">
                        Con la mejor salsa de Ajo
                    </h1>

                    {/* Main CTAs */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in-up delay-200">
                        {/* RECOGER EN TIENDA → abre LocationSelector */}
                        <button
                            onClick={handleStorePickup}
                            className="w-full md:w-auto px-8 py-4 bg-paninos-yellow text-black font-display font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-lg shadow-paninos-yellow/20 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            RECOGER EN TIENDA
                        </button>

                        {/* PEDIR A DOMICILIO */}
                        <button
                            onClick={handleDelivery}
                            className="w-full md:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-display font-bold text-lg rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            PEDIR A DOMICILIO
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Main Content */}
            <main className="relative">
                {/* ── Carrusel de sandwiches ─────────────────────────────── */}
                <section className="px-4 py-6 relative z-10 -mt-20">
                    <div className="max-w-md md:max-w-sm mx-auto">

                        {/* Card única con crossfade */}
                        <div
                            onClick={handleStorePickup}
                            className="group relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer h-72"
                        >
                            {CAROUSEL_SANDWICHES.map((sandwich, index) => (
                                <div
                                    key={sandwich.id}
                                    className="absolute inset-0 transition-opacity duration-700"
                                    style={{ opacity: carouselIndex === index ? 1 : 0 }}
                                >
                                    {/* Imagen */}
                                    <img
                                        src={`/images/products/${sandwich.image}`}
                                        alt={sandwich.name}
                                        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Gradiente */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                    {/* Texto */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <p className="text-[10px] font-bold tracking-widest text-paninos-yellow uppercase mb-1">
                                            Nuestros Sandwiches
                                        </p>
                                        <h3 className="text-2xl font-display font-bold text-white leading-tight mb-1">
                                            {sandwich.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                            {sandwich.description}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Indicadores de punto */}
                            <div className="absolute top-4 right-4 flex gap-1.5">
                                {CAROUSEL_SANDWICHES.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setCarouselIndex(i); }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${carouselIndex === i
                                            ? 'bg-paninos-yellow w-5'
                                            : 'bg-white/30 hover:bg-white/60'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* CTA overlay */}
                            <div className="absolute bottom-4 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-xs font-bold text-paninos-yellow flex items-center gap-1">
                                    Ver menú
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Paninos para Empresas ──────────────────────────────── */}
                <section className="px-4 py-6">
                    <div className="max-w-md md:max-w-sm mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-paninos-yellow/10 border-2 border-paninos-yellow rounded-xl mb-3">
                                <svg className="w-6 h-6 text-paninos-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-display font-bold mb-2">
                                PANINOS PARA <span className="italic text-paninos-yellow">EMPRESAS</span>
                            </h2>

                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                Soluciones de catering y pedidos corporativos para grandes equipos
                            </p>

                            <button
                                onClick={handleContactB2B}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-paninos-dark border-2 border-paninos-yellow text-paninos-yellow font-display font-bold text-sm rounded-xl hover:bg-paninos-yellow hover:text-black transition-all duration-300"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>CONTACTAR VENTAS B2B</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Navigation - Mobile */}
            <nav className="fixed bottom-0 left-0 right-0 bg-paninos-dark/95 backdrop-blur-lg border-t border-white/10 z-50">
                <div className="flex items-center justify-around py-2">
                    <button className="flex flex-col items-center gap-0.5 px-4 py-2 text-paninos-yellow">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span className="text-xs font-bold">Inicio</span>
                    </button>

                    <button
                        onClick={handleStorePickup}
                        className="flex flex-col items-center gap-0.5 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="text-xs font-bold">Menú</span>
                    </button>

                    <div className="relative">
                        {/* Tooltip flotante */}
                        {showOrderTooltip && (
                            <div
                                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
                                style={{ animation: 'fadeInUp 0.2s ease' }}
                            >
                                <div className="bg-[#2A2A2A] border border-white/10 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl">
                                    Aún no tienes pedidos realizados
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                                        style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid rgba(255,255,255,0.08)' }}
                                    />
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handlePedidosClick}
                            className="flex flex-col items-center gap-0.5 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="text-xs font-bold">Pedidos</span>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}
