'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

// Image Mapping Configuration
// Maps normalized uppercase product names to their specific filenames in public/images/products
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

    // 1. Try manual local mapping
    if (PRODUCT_IMAGES[normalizedName]) {
        return `/images/products/${PRODUCT_IMAGES[normalizedName]}`;
    }

    // 2. Try backend image
    if (product.image_url) {
        return product.image_url;
    }

    // 3. No image found
    return null;
};

export default function Menu() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await api.get('menu/');

                // Filter products to only show Sandwiches (starting with "SAND")
                const filteredData = response.data.map(category => ({
                    ...category,
                    products: category.products.filter(product =>
                        product.name.toUpperCase().startsWith('SAND')
                    )
                })).filter(category => category.products.length > 0);

                setCategories(filteredData);
                setError(null);
            } catch (err) {
                console.error('Error fetching menu:', err);
                setError('No se pudo cargar el menú. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const handleAddToCart = (product) => {
        setCartCount(prev => prev + 1);
        // TODO: Implementar lógica de carrito completa
        console.log('Producto agregado:', product.name);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-paninos-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-paninos-yellow border-t-transparent shadow-[0_0_15px_rgba(255,196,0,0.2)]"></div>
                    <p className="mt-4 text-gray-400 font-display tracking-widest uppercase text-sm">Cargando menú...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-paninos-dark flex items-center justify-center p-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md backdrop-blur-sm">
                    <p className="text-red-400 text-center font-display tracking-wide">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paninos-dark text-white font-sans selection:bg-paninos-yellow selection:text-paninos-dark">
            {/* Fixed Header */}
            <header className="sticky top-0 z-50 bg-paninos-dark/95 backdrop-blur-sm border-b border-white/10 shadow-2xl">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo/Brand */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-paninos-yellow rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,196,0,0.4)] rotating-border">
                                <svg className="w-7 h-7 text-paninos-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-bold text-white tracking-[0.2em] uppercase leading-none drop-shadow-lg">
                                    PANINOS
                                </h1>
                                <p className="text-[10px] text-paninos-yellow font-bold tracking-[0.3em] mt-1 pl-0.5">
                                    MENÚ DIGITAL
                                </p>
                            </div>
                        </div>

                        {/* Cart Icon */}
                        <button className="relative p-3 hover:bg-white/5 rounded-xl transition-all duration-300 group">
                            <svg className="w-7 h-7 text-paninos-yellow drop-shadow-lg group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-paninos-dark animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-10 pb-28">
                {categories.length === 0 ? (
                    <div className="text-center py-32 opacity-50">
                        <p className="text-gray-400 text-2xl font-display tracking-widest uppercase">No hay productos disponibles.</p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {categories.map((category) => (
                            <section key={category.id}>
                                {/* Category Header */}
                                <div className="mb-8 flex items-end gap-6 relative">
                                    <div className="h-12 w-2 bg-paninos-yellow rounded-sm shadow-[0_0_15px_rgba(255,196,0,0.5)]"></div>
                                    <h2 className="text-5xl font-display font-bold text-white uppercase tracking-tighter leading-none relative z-10">
                                        {category.name}
                                        <span className="absolute -bottom-2 left-0 w-full h-[30%] bg-paninos-yellow/20 -z-10 skew-x-12"></span>
                                    </h2>
                                </div>

                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {category.products.map((product) => {
                                        const imageUrl = getProductImage(product);
                                        return (
                                            <div
                                                key={product.id}
                                                className="bg-paninos-card rounded-2xl overflow-hidden border border-white/5 hover:border-paninos-yellow/50 transition-all duration-300 group shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col h-full"
                                            >
                                                {/* Product Image */}
                                                <div className="relative w-full h-56 bg-gray-900 overflow-hidden shrink-0">
                                                    {imageUrl ? (
                                                        <div className="relative w-full h-full overflow-hidden">
                                                            <img
                                                                src={imageUrl}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-paninos-card via-transparent to-transparent opacity-60"></div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-white/5 pattern-grid-lg">
                                                            <svg
                                                                className="w-16 h-16 text-white/10"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={1}
                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* Stock Badge */}
                                                    <div className="absolute top-4 right-4 z-20">
                                                        {product.is_available && product.stock > 0 ? (
                                                            <div className="bg-paninos-dark/90 backdrop-blur-md text-paninos-yellow border border-paninos-yellow/40 text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase shadow-xl">
                                                                {product.stock} Disp.
                                                            </div>
                                                        ) : (
                                                            <div className="bg-red-600/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl backdrop-blur-sm border border-red-500/50">
                                                                Agotado
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-6 flex flex-col flex-grow relative">
                                                    <div className="absolute top-0 left-6 w-12 h-1 bg-paninos-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                    <div className="mb-auto">
                                                        <h3 className="text-2xl font-display font-bold text-white uppercase leading-none tracking-wide group-hover:text-paninos-yellow transition-colors mb-3">
                                                            {product.name}
                                                        </h3>

                                                        {product.description && (
                                                            <p className="text-sm text-gray-400 line-clamp-3 font-light leading-relaxed tracking-wide">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Price and Add Button */}
                                                    <div className="flex items-end justify-between mt-6 pt-6 border-t border-white/5 relative">
                                                        <div className="flex flex-col">
                                                            {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                                                                <span className="text-xs text-gray-500 line-through font-mono mb-1">
                                                                    ${parseFloat(product.original_price).toLocaleString('es-CO')}
                                                                </span>
                                                            )}
                                                            <span className="text-3xl font-display font-bold text-paninos-yellow tracking-tight leading-none">
                                                                ${parseFloat(product.price).toLocaleString('es-CO')}
                                                            </span>
                                                        </div>

                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            disabled={!product.is_available}
                                                            className={`
                                                            w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl
                                                            transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.3)]
                                                            ${product.is_available
                                                                    ? 'bg-paninos-yellow text-paninos-dark hover:bg-white hover:scale-110 active:scale-95 hover:shadow-[0_0_20px_rgba(255,196,0,0.5)]'
                                                                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                                                }
                                                        `}
                                                        >
                                                            <span className="pb-1">+</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-paninos-dark border-t border-white/10 py-12 mt-12">
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <p className="text-xs text-gray-600 font-bold tracking-[0.2em] uppercase">
                        Powered by <span className="text-paninos-yellow">Loggro Restobar</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}
