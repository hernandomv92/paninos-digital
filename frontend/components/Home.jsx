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
            {/* Compact Hero Section */}
            <header className="relative">
                {/* Yellow Header Bar with Centered Logo */}
                <div className="bg-paninos-yellow py-3">
                    <div className="max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center justify-center">
                        <Image
                            src="/images/logo.png"
                            alt="Paninos Logo"
                            width={120}
                            height={60}
                            className="object-contain"
                        />
                        <p className="font-lora italic text-black text-sm md:text-base mt-[-5px]">
                            Con la mejor salsa de Ajo
                        </p>
                    </div>
                </div>

                <div className="max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pt-6 pb-6">


                    {/* Compact CTA Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:max-w-xl md:mx-auto">
                        <button
                            onClick={handleStorePickup}
                            className="bg-paninos-yellow text-black font-display font-bold text-sm md:text-base py-3 md:py-4 px-4 md:px-6 rounded-xl hover:bg-white transition-all duration-300 shadow-lg"
                        >
                            <div className="flex flex-col items-center gap-1">
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="text-xs md:text-sm">RECOGER EN TIENDA</span>
                            </div>
                        </button>

                        <button
                            onClick={handleDelivery}
                            className="bg-white/10 backdrop-blur-sm text-white border-2 border-paninos-yellow font-display font-bold text-sm md:text-base py-3 md:py-4 px-4 md:px-6 rounded-xl hover:bg-paninos-yellow hover:text-black transition-all duration-300"
                        >
                            <div className="flex flex-col items-center gap-1">
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-xs md:text-sm">PIDE A DOMICILIO</span>
                            </div>
                        </button>
                    </div>

                    {/* Scroll indicator */}
                    <div className="flex justify-center mt-4 animate-bounce">
                        <svg className="w-5 h-5 text-paninos-yellow/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative">
                {/* Compact Promo Section */}
                <section className="px-4 py-6">
                    <div className="max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                        <div className="relative bg-gradient-to-br from-paninos-card to-paninos-dark rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                            {/* Promo Image */}
                            <div className="relative h-48 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                                <img
                                    src="/images/products/SAND POLLO.JPG"
                                    alt="Promo del Mes"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-paninos-dark via-transparent to-transparent"></div>

                                {/* Promo Badge */}
                                <div className="absolute top-3 right-3 bg-red-600 text-white px-4 py-2 rounded-full font-display font-bold text-lg shadow-xl">
                                    -20%
                                </div>
                            </div>

                            {/* Promo Info */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-0.5 w-8 bg-paninos-yellow"></div>
                                    <h3 className="text-xs font-bold tracking-wider uppercase text-paninos-yellow">
                                        Promo del Mes
                                    </h3>
                                </div>
                                <p className="text-lg font-display font-bold text-white leading-tight">
                                    Disfruta nuestro Panino di Pollo con <span className="text-paninos-yellow">20% OFF</span>
                                </p>
                            </div>

                            {/* Carousel Dots */}
                            <div className="flex justify-center gap-1.5 pb-3">
                                <div className="w-6 h-1 bg-paninos-yellow rounded-full"></div>
                                <div className="w-1.5 h-1 bg-white/30 rounded-full"></div>
                                <div className="w-1.5 h-1 bg-white/30 rounded-full"></div>
                            </div>
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

                {/* Compact Featured Products */}
                <section className="px-4 py-6">
                    <div className="max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-display font-bold">
                                Tus <span className="text-paninos-yellow">Favoritos</span>
                            </h2>
                            <button
                                onClick={() => router.push('/menu')}
                                className="text-paninos-yellow hover:text-white transition-colors font-bold text-sm flex items-center gap-1"
                            >
                                <span>Ver todo</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-paninos-yellow border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {featuredProducts.slice(0, 2).map((product) => {
                                    const imageUrl = getProductImage(product);
                                    return (
                                        <div
                                            key={product.id}
                                            className="bg-paninos-card rounded-xl overflow-hidden border border-white/5 hover:border-paninos-yellow/50 transition-all duration-300 flex"
                                        >
                                            {/* Product Image */}
                                            <div className="relative w-24 h-24 bg-gray-900 flex-shrink-0">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                        <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 p-3 flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-display font-bold mb-1 line-clamp-1">
                                                        {product.name}
                                                    </h3>
                                                    <span className="text-lg font-display font-bold text-paninos-yellow">
                                                        ${parseFloat(product.price).toLocaleString('es-CO')}
                                                    </span>
                                                </div>

                                                <button className="w-8 h-8 bg-paninos-yellow text-black rounded-full flex items-center justify-center font-bold text-xl hover:bg-white transition-all duration-300 flex-shrink-0">
                                                    <span className="pb-0.5">+</span>
                                                </button>
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
