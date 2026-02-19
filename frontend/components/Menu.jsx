'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { getLocationBySlug, LOCATIONS } from '@/lib/locations';
import CartDrawer from '@/components/CartDrawer';

// ─── Descripciones de ingredientes (del menú oficial) ─────────────────────────
const PRODUCT_DESCRIPTIONS = {
    'SAND ALOHA': 'Queso doble crema, jamón, salami, pepperoni, piña calada, lechuga batavia y salsa de ajo.',
    'SAND ATUN': 'Queso doble crema, jamón, tomate en rodajas, atún, lechuga batavia y salsa de ajo.',
    'SAND HAWAIANO': 'Queso doble crema, tomate en rodajas, piña calada, lechuga batavia y salsa de ajo.',
    'SAND MIXTO': 'Queso doble crema, jamón, salami, pepperoni, tomate en rodajas, carne res desmechada, lechuga batavia y salsa de ajo.',
    'SAND POLLO PIÑA': 'Queso doble crema, jamón, tomate en rodajas, piña calada, pollo desmechado, lechuga batavia y salsa de ajo.',
    'SAND POLLO': 'Queso doble crema, jamón, tomate en rodajas, lechuga batavia, pollo desmechado y salsa de ajo.',
    'SAND ROPA VIEJA': 'Queso doble crema, tomate en rodajas, carne res desmechada, lechuga batavia y salsa de ajo.',
    'SAND SALAMI PEPPERONI': 'Queso doble crema, jamón, salami, pepperoni, tomate en rodajas, lechuga batavia y salsa de ajo.',
    'SAND SUPREMO CARNE': 'Queso doble crema, jamón, tomate en rodajas, pollo y carne desmechados, lechuga batavia y salsa de ajo.',
    'SAND SUPREMO POLLO': 'Queso doble crema, jamón, salami, pepperoni, tomate en rodajas, pollo desmechado, lechuga batavia y salsa de ajo.',
    'SAND VEGETARIANO': 'Queso doble crema, jamón, tomate en rodajas, lechuga batavia y salsa de ajo.',
};

// ─── Categorías locales (bebidas y salsa − no vienen de la API aún) ───────────
const EXTRA_CATEGORIES = [
    {
        id: 'bebidas',
        name: 'Bebidas',
        isLocal: true,
        products: [
            { id: 'b1', name: 'Agua (con o sin gas)', price: '3000', is_available: true, stock: 99 },
            { id: 'b2', name: 'Gaseosa 400ml', price: '3000', is_available: true, stock: 99 },
            { id: 'b3', name: 'Jugo del Valle 400ml', price: '3500', is_available: true, stock: 99 },
            { id: 'b4', name: 'Fuze Tea', price: '3500', is_available: true, stock: 99 },
            { id: 'b5', name: 'Coca-Cola 1.5L', price: '7500', is_available: true, stock: 99 },
            { id: 'b6', name: 'Jugo del Valle 1.5L', price: '6500', is_available: true, stock: 99 },
            { id: 'b7', name: 'Del Valle Caja', price: '6000', is_available: true, stock: 99 },
            { id: 'b8', name: 'Cerveza Coronita', price: '5000', is_available: true, stock: 99 },
        ],
    },
    {
        id: 'salsa',
        name: 'Salsa de Ajo',
        isLocal: true,
        products: [
            { id: 's1', name: 'Adición 3 copas', price: '1500', is_available: true, stock: 99, description: 'Extra de nuestra famosa salsa de ajo casera.' },
            { id: 's2', name: 'Bolsa de 200 gr', price: '35000', is_available: true, stock: 99, description: 'Para llevar la magia a tu casa.' },
            { id: 's3', name: 'Bolsa de 1 Kg', price: '10000', is_available: true, stock: 10, description: 'Solo por encargo. Para eventos y fiestas.' },
        ],
    },
];

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

const getProductDescription = (product) => {
    if (product.description?.trim()) return product.description;
    const key = product.name?.toUpperCase().trim();
    return PRODUCT_DESCRIPTIONS[key] || null;
};

// ─── Product Card (con imagen, para sandwiches) ────────────────────────────────
function ProductCard({ product, onAdd, quantity }) {
    const imageUrl = getProductImage(product);
    const description = getProductDescription(product);
    const isAvailable = product.is_available && product.stock > 0;

    return (
        <div className="bg-[#1C1C1C] rounded-2xl overflow-hidden border border-white/5 hover:border-paninos-yellow/30 transition-all duration-300 group flex flex-col">
            {imageUrl && (
                <div className="relative w-full h-44 overflow-hidden shrink-0">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-transparent to-transparent opacity-60" />

                    {/* Stock badge */}
                    <div className="absolute top-2.5 right-2.5">
                        {isAvailable ? (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-paninos-yellow border border-paninos-yellow/20 tracking-widest">
                                {product.stock > 50 ? 'DISPONIBLE' : `${product.stock} DISP.`}
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-600/80 text-white tracking-widest">AGOTADO</span>
                        )}
                    </div>

                    {/* Qty badge */}
                    {quantity > 0 && (
                        <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-paninos-yellow text-black text-xs font-display font-bold flex items-center justify-center">
                            {quantity}
                        </div>
                    )}
                </div>
            )}

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-display font-bold text-base text-white uppercase leading-tight group-hover:text-paninos-yellow transition-colors mb-1.5">
                    {product.name}
                </h3>
                {description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 font-sans mb-3">
                        {description}
                    </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <span className="font-display font-bold text-xl text-paninos-yellow">
                        ${parseFloat(product.price).toLocaleString('es-CO')}
                    </span>
                    <button
                        onClick={() => onAdd(product)}
                        disabled={!isAvailable}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                            ${isAvailable
                                ? 'bg-paninos-yellow text-black hover:bg-white hover:scale-110 active:scale-95'
                                : 'bg-white/5 text-white/20 cursor-not-allowed'
                            }`}
                        aria-label={`Agregar ${product.name}`}
                    >
                        {quantity > 0 ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <span className="text-xl leading-none pb-0.5">+</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Simple Card (sin imagen, para bebidas / salsa) ───────────────────────────
function SimpleCard({ product, onAdd, quantity }) {
    const isAvailable = product.is_available && product.stock > 0;
    const description = getProductDescription(product);

    return (
        <div className="flex items-center gap-4 bg-[#1C1C1C] rounded-2xl p-4 border border-white/5 hover:border-paninos-yellow/20 transition-all duration-200 group">
            <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-sm text-white group-hover:text-paninos-yellow transition-colors truncate">
                    {product.name}
                </h3>
                {description && (
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{description}</p>
                )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-display font-bold text-paninos-yellow">
                    ${parseFloat(product.price).toLocaleString('es-CO')}
                </span>
                <button
                    onClick={() => onAdd(product)}
                    disabled={!isAvailable}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
                        ${isAvailable
                            ? 'bg-paninos-yellow/15 text-paninos-yellow border border-paninos-yellow/20 hover:bg-paninos-yellow hover:text-black active:scale-95'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                    aria-label={`Agregar ${product.name}`}
                >
                    {quantity > 0 ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <span className="text-xl leading-none pb-0.5">+</span>
                    )}
                </button>
            </div>
        </div>
    );
}

// ─── Main Menu ─────────────────────────────────────────────────────────────────
export default function Menu() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const locationSlug = searchParams.get('location');
    const orderType = searchParams.get('type') || 'pickup';

    // ── IMPORTANTE: memoizar para evitar loop infinito en useEffect ──
    const currentLocation = useMemo(
        () => getLocationBySlug(locationSlug) || LOCATIONS[0],
        [locationSlug]
    );

    const { addItem, totalItems, setLocation, setOrderType, getQuantity } = useCart();

    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Sincronizar sede con CartContext — solo cuando cambia el ID de la sede
    useEffect(() => {
        setLocation(currentLocation);
        setOrderType(orderType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLocation.id, orderType]);

    // Fetch del menú
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await api.get('menu/');

                const apiCategories = response.data
                    .map(cat => ({
                        ...cat,
                        id: String(cat.id),
                        isLocal: false,
                        products: cat.products.filter(p => p.name.toUpperCase().startsWith('SAND')),
                    }))
                    .filter(cat => cat.products.length > 0);

                const combined = [...apiCategories, ...EXTRA_CATEGORIES];
                setAllCategories(combined);
                if (combined.length > 0) setActiveTab(combined[0].id);
                setError(null);
            } catch {
                setAllCategories(EXTRA_CATEGORIES);
                setActiveTab(EXTRA_CATEGORIES[0]?.id || null);
                setError('Mostrando menú local.');
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLocation.id]);

    const handleAddToCart = useCallback((product) => {
        addItem(product);
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    }, [addItem]);

    const activeCategory = allCategories.find(c => c.id === activeTab);
    const showImages = !activeCategory?.isLocal;

    if (loading) {
        return (
            <div className="min-h-screen bg-paninos-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-paninos-yellow border-t-transparent" />
                    <p className="mt-4 text-gray-400 font-display tracking-widest uppercase text-sm">Cargando menú...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paninos-dark text-white font-sans">

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* ── Header ────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-paninos-dark/95 backdrop-blur-sm border-b border-white/10 shadow-xl">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-3">

                        {/* Back + Brand */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/')}
                                className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                                aria-label="Volver al inicio"
                            >
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <p className="text-xl font-display font-bold text-white tracking-wide leading-none">PANINOS</p>
                                <p className="text-[10px] text-paninos-yellow font-bold tracking-widest mt-0.5">MENÚ DIGITAL</p>
                            </div>
                        </div>

                        {/* Location pill */}
                        <button
                            onClick={() => router.push('/')}
                            className="flex-1 flex justify-center"
                        >
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paninos-yellow/10 border border-paninos-yellow/20 rounded-full hover:bg-paninos-yellow/20 transition-colors max-w-[190px]">
                                <svg className="w-3 h-3 text-paninos-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-bold text-paninos-yellow truncate">{currentLocation.name}</span>
                                <svg className="w-3 h-3 text-paninos-yellow/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>

                        {/* Cart */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                            aria-label="Ver carrito"
                        >
                            <svg className="w-5 h-5 text-paninos-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-paninos-yellow text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-paninos-dark">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Pestañas ────────────────────────────────────────────── */}
                <div className="overflow-x-auto scrollbar-hide border-t border-white/5">
                    <div className="flex px-4 py-2 gap-1 w-max min-w-full">
                        {allCategories.map((cat) => {
                            const isActive = activeTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`px-5 py-2 rounded-xl text-sm font-display font-bold whitespace-nowrap transition-all duration-200
                                        ${isActive
                                            ? 'bg-paninos-yellow text-black'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* ── Productos ─────────────────────────────────────────────────── */}
            <main className="container mx-auto px-4 py-6 pb-32">
                {activeCategory ? (
                    showImages ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {activeCategory.products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={handleAddToCart}
                                    quantity={getQuantity(product.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 max-w-xl mx-auto">
                            {activeCategory.products.map((product) => (
                                <SimpleCard
                                    key={product.id}
                                    product={product}
                                    onAdd={handleAddToCart}
                                    quantity={getQuantity(product.id)}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <p className="text-center text-gray-600 py-24 font-display">Sin productos disponibles</p>
                )}
            </main>

            {/* ── Floating Cart CTA ─────────────────────────────────────────── */}
            {totalItems > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-paninos-dark to-transparent z-40 pointer-events-none">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="pointer-events-auto w-full max-w-md mx-auto flex items-center justify-between px-5 py-4 bg-paninos-yellow text-black font-display font-bold text-base rounded-2xl shadow-2xl shadow-paninos-yellow/20 hover:bg-white transition-colors"
                    >
                        <span className="bg-black/15 px-3 py-1 rounded-xl text-sm">
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
