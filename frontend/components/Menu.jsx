'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { getLocationBySlug, LOCATIONS } from '@/lib/locations';
import CartDrawer from '@/components/CartDrawer';

// ─── Image Mapping ─────────────────────────────────────────────────────────────
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
    'SAND VEGETARIANO': 'SAND VEGETARIANO.jpg',
};

const getProductImage = (product) => {
    if (!product?.name) return null;
    const key = product.name.toUpperCase().trim();
    if (PRODUCT_IMAGES[key]) return `/images/products/${PRODUCT_IMAGES[key]}`;
    if (product.image_url) return product.image_url;
    return null;
};

// ─── Product Card Component ────────────────────────────────────────────────────
function ProductCard({ product, onAdd, quantity }) {
    const imageUrl = getProductImage(product);
    const isAvailable = product.is_available && product.stock > 0;

    return (
        <div className="bg-paninos-card rounded-2xl overflow-hidden border border-white/5 hover:border-paninos-yellow/50 transition-all duration-300 group shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col h-full">
            {/* Product Image */}
            <div className="relative w-full h-52 bg-gray-900 overflow-hidden shrink-0">
                {imageUrl ? (
                    <div className="relative w-full h-full overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-paninos-card via-transparent to-transparent opacity-60" />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <svg className="w-16 h-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Stock Badge */}
                <div className="absolute top-3 right-3 z-20">
                    {isAvailable ? (
                        <div className="bg-paninos-dark/90 backdrop-blur-md text-paninos-yellow border border-paninos-yellow/40 text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                            {product.stock} Disp.
                        </div>
                    ) : (
                        <div className="bg-red-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm border border-red-500/50">
                            Agotado
                        </div>
                    )}
                </div>

                {/* Indicador de cantidad en carrito */}
                {quantity > 0 && (
                    <div className="absolute top-3 left-3 z-20">
                        <div className="w-6 h-6 rounded-full bg-paninos-yellow text-black text-xs font-display font-bold flex items-center justify-center shadow-lg">
                            {quantity}
                        </div>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow relative">
                <div className="absolute top-0 left-5 w-10 h-0.5 bg-paninos-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="mb-auto">
                    <h3 className="text-xl font-display font-bold text-white uppercase leading-none tracking-wide group-hover:text-paninos-yellow transition-colors mb-2">
                        {product.name}
                    </h3>

                    {product.description && (
                        <p className="text-sm text-gray-400 line-clamp-2 font-light leading-relaxed">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Price and Add Button */}
                <div className="flex items-end justify-between mt-5 pt-4 border-t border-white/5">
                    <span className="text-2xl font-display font-bold text-paninos-yellow tracking-tight">
                        ${parseFloat(product.price).toLocaleString('es-CO')}
                    </span>

                    <button
                        onClick={() => onAdd(product)}
                        disabled={!isAvailable}
                        className={`
                            w-11 h-11 rounded-full flex items-center justify-center font-bold text-xl
                            transition-all duration-300 shadow-md
                            ${isAvailable
                                ? quantity > 0
                                    ? 'bg-paninos-yellow text-black hover:bg-white hover:scale-110 active:scale-95'
                                    : 'bg-paninos-yellow text-black hover:bg-white hover:scale-110 active:scale-95 hover:shadow-[0_0_20px_rgba(255,196,0,0.5)]'
                                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                            }
                        `}
                    >
                        {quantity > 0 ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <span className="pb-0.5">+</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Menu Component ───────────────────────────────────────────────────────
export default function Menu() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Leer parámetros de la URL
    const locationSlug = searchParams.get('location');
    const orderType = searchParams.get('type') || 'pickup';

    // Obtener info de la sede desde la config
    const currentLocation = getLocationBySlug(locationSlug) || LOCATIONS[0];

    const { addItem, totalItems, setLocation, setOrderType, getQuantity } = useCart();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Sincronizar la sede seleccionada con el CartContext
    useEffect(() => {
        if (currentLocation) {
            setLocation(currentLocation);
            setOrderType(orderType);
        }
    }, [currentLocation, orderType, setLocation, setOrderType]);

    // Fetch del menú
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                // TODO: Cuando el backend soporte ?location_id=X, pasarlo aquí:
                // const response = await api.get(`menu/?location_id=${currentLocation.logroPosId}`);
                const response = await api.get('menu/');

                const filteredData = response.data
                    .map(category => ({
                        ...category,
                        products: category.products.filter(product =>
                            product.name.toUpperCase().startsWith('SAND')
                        ),
                    }))
                    .filter(category => category.products.length > 0);

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
    }, [currentLocation.id]);

    const handleAddToCart = useCallback((product) => {
        addItem(product);
        // Vibración táctil en móvil (si está soportado)
        if (navigator.vibrate) navigator.vibrate(50);
    }, [addItem]);

    // ── Loading State ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-paninos-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-paninos-yellow border-t-transparent shadow-[0_0_15px_rgba(255,196,0,0.2)]" />
                    <p className="mt-4 text-gray-400 font-display tracking-widest uppercase text-sm">Cargando menú...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-paninos-dark flex items-center justify-center p-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md backdrop-blur-sm text-center">
                    <p className="text-red-400 font-display tracking-wide mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2 bg-white/10 rounded-xl text-white text-sm font-bold hover:bg-white/20 transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paninos-dark text-white font-sans selection:bg-paninos-yellow selection:text-paninos-dark">

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* ── Fixed Header ──────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-paninos-dark/95 backdrop-blur-sm border-b border-white/10 shadow-2xl">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-3">

                        {/* Back button + Brand */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/')}
                                className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                aria-label="Volver al inicio"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div>
                                <h1 className="text-xl font-display font-bold text-white tracking-wide leading-none">
                                    PANINOS
                                </h1>
                                <p className="text-[10px] text-paninos-yellow font-bold tracking-widest mt-0.5">
                                    MENÚ DIGITAL
                                </p>
                            </div>
                        </div>

                        {/* Location Badge */}
                        <div className="flex-1 flex justify-center">
                            <button
                                onClick={() => router.push('/')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paninos-yellow/10 border border-paninos-yellow/20 rounded-full hover:bg-paninos-yellow/20 transition-colors"
                            >
                                <span className="text-xs">{currentLocation.emoji}</span>
                                <span className="text-xs font-bold text-paninos-yellow truncate max-w-[120px]">
                                    {currentLocation.name}
                                </span>
                                <svg className="w-3 h-3 text-paninos-yellow/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Cart Icon */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group"
                            aria-label="Ver carrito"
                        >
                            <svg className="w-6 h-6 text-paninos-yellow drop-shadow-lg group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-paninos-yellow text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-paninos-dark shadow-lg">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main Content ──────────────────────────────────────────────── */}
            <main className="container mx-auto px-4 py-8 pb-28">
                {categories.length === 0 ? (
                    <div className="text-center py-32 opacity-50">
                        <p className="text-gray-400 text-2xl font-display tracking-widest uppercase">
                            No hay productos disponibles.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-14">
                        {categories.map((category) => (
                            <section key={category.id}>
                                {/* Category Header */}
                                <div className="mb-7 flex items-end gap-4 relative">
                                    <div className="h-10 w-1.5 bg-paninos-yellow rounded-sm shadow-[0_0_15px_rgba(255,196,0,0.5)]" />
                                    <h2 className="text-4xl font-display font-bold text-white uppercase tracking-tight leading-none relative z-10">
                                        {category.name}
                                        <span className="absolute -bottom-1 left-0 w-full h-[25%] bg-paninos-yellow/15 -z-10 skew-x-12" />
                                    </h2>
                                </div>

                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAdd={handleAddToCart}
                                            quantity={getQuantity(product.id)}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            {/* ── Floating Cart Button (móvil) ──────────────────────────────── */}
            {totalItems > 0 && (
                <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 px-4">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full max-w-md py-4 bg-paninos-yellow text-black font-display font-bold text-base rounded-2xl shadow-2xl shadow-paninos-yellow/30 flex items-center justify-between px-5 hover:bg-white transition-colors"
                    >
                        <span className="bg-black/20 text-black text-sm font-bold px-3 py-1 rounded-xl">
                            {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
                        </span>
                        <span>Ver mi pedido</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
