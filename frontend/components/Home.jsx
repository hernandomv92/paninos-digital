'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';

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


// Promotions Data
const PROMOS = [
    {
        id: 1,
        title: "Panino di Pollo",
        description: "Disfruta nuestro Panino di Pollo con",
        highlight: "20% OFF",
        image: "SAND POLLO.JPG",
        tag: "PROMO DEL MES",
        badge: "-20%",
        color: "text-paninos-yellow"
    },
    {
        id: 2,
        title: "Sandwich Aloha",
        description: "Prueba la combinación perfecta de piña y jamón",
        highlight: "NUEVO",
        image: "SAND ALOHA.JPG",
        tag: "NUEVO LANZAMIENTO",
        badge: "NEW",
        color: "text-blue-400"
    },
    {
        id: 3,
        title: "Sandwich Atún",
        description: "El favorito de todos los tiempos",
        highlight: "LO MÁS VENDIDO",
        image: "SAND ATUN.jpg",
        tag: "FAVORITO",
        badge: "TOP",
        color: "text-green-400"
    }
];

export default function Home() {
    const router = useRouter();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get('menu/');

                // Get first 3 sandwiches as featured
                const allProducts = response.data.flatMap(category => category.products);
                const sandwiches = allProducts.filter(product =>
                    product.name.toUpperCase().startsWith('SAND') && product.is_available
                );

                setFeaturedProducts(sandwiches.slice(0, 3));
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);


    // Scroll state for sticky header
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleStorePickup = () => {
        router.push('/menu');
    };

    const handleDelivery = () => {
        router.push('/menu');
    };

    const handleContactB2B = () => {
        window.open('https://wa.me/573137258091?text=Hola!%20Me%20interesa%20información%20sobre%20catering%20corporativo', '_blank');
    };


    return (
        <div className="min-h-screen bg-black text-white font-sans pb-20">
            {/* Transparent Sticky Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-paninos-yellow/70 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4 ml-6'}`}>
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    {/* Logo (Smaller on scroll) */}
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
                        <button
                            onClick={handleStorePickup}
                            className="w-full md:w-auto px-8 py-4 bg-paninos-yellow text-black font-display font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-lg shadow-paninos-yellow/20"
                        >
                            RECOGER EN TIENDA
                        </button>
                        <button
                            onClick={handleDelivery}
                            className="w-full md:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-display font-bold text-lg rounded-full hover:bg-white/20 transition-all"
                        >
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
                {/* Compact Promo Grid Section */}
                <section className="px-4 py-6 relative z-10 -mt-20">
                    <div className="max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {PROMOS.map((promo) => (
                                <div key={promo.id} className="group relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={`/images/products/${promo.image}`}
                                            alt={promo.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative p-6 h-64 flex flex-col justify-end">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded bg-white/10 ${promo.color} backdrop-blur-sm`}>
                                                {promo.tag}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-white mb-1">
                                            {promo.title}
                                        </h3>
                                        <p className="text-sm font-light text-gray-300 line-clamp-2">
                                            {promo.description} <span className={promo.color + " font-bold"}>{promo.highlight}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Compact Business Section */}
                <section className="px-4 py-6">
                    <div className="max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
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

                {/* Featured Products Grid */}
                <section className="px-4 py-10">
                    <div className="max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-display font-bold mb-1">
                                    Tus <span className="text-paninos-yellow">Favoritos</span>
                                </h2>
                                <div className="h-1 w-20 bg-paninos-yellow rounded-full"></div>
                            </div>

                            <button
                                onClick={() => router.push('/menu')}
                                className="text-paninos-yellow hover:text-white transition-colors font-bold text-sm flex items-center gap-1"
                            >
                                <span>VER MENÚ COMPLETO</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-paninos-yellow border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredProducts.slice(0, 3).map((product) => {
                                    const imageUrl = getProductImage(product);
                                    return (
                                        <div
                                            key={product.id}
                                            className="group bg-[#1A1A1A] rounded-2xl overflow-hidden hover:bg-[#252525] transition-all duration-300"
                                        >
                                            <div className="flex flex-row md:flex-col h-full">
                                                {/* Product Image */}
                                                <div className="relative w-1/3 md:w-full md:h-56">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                            <svg className="w-10 h-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 p-5 flex flex-col justify-center">
                                                    <h3 className="text-lg font-display font-bold mb-2 line-clamp-1 group-hover:text-paninos-yellow transition-colors">
                                                        {product.name}
                                                    </h3>

                                                    <div className="flex items-center justify-between mt-auto">
                                                        <span className="text-xl font-display font-bold text-paninos-yellow">
                                                            ${parseFloat(product.price).toLocaleString('es-CO')}
                                                        </span>

                                                        <button className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-paninos-yellow hover:text-black transition-all duration-300">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
                        onClick={() => router.push('/menu')}
                        className="flex flex-col items-center gap-0.5 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="text-xs font-bold">Menú</span>
                    </button>

                    <button className="flex flex-col items-center gap-0.5 px-4 py-2 text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="text-xs font-bold">Pedidos</span>
                    </button>


                </div>
            </nav>
        </div>
    );
}
