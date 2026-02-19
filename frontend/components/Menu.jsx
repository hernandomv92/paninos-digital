'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { getLocationBySlug, LOCATIONS } from '@/lib/locations';
import CartDrawer from '@/components/CartDrawer';

// ─── Ingredientes del menú oficial ────────────────────────────────────────────
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

// ─── Categorías locales ────────────────────────────────────────────────────────
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
            { id: 's3', name: 'Bolsa de 1 Kg', price: '10000', is_available: true, stock: 10, description: 'Solo por encargo. Ideal para eventos y reuniones.' },
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

const getProductImage = (name) => {
    const key = name?.toUpperCase().trim();
    return PRODUCT_IMAGES[key] ? `/images/products/${PRODUCT_IMAGES[key]}` : null;
};

const getDescription = (product) => {
    if (product.description?.trim()) return product.description;
    return PRODUCT_DESCRIPTIONS[product.name?.toUpperCase().trim()] || null;
};

// ─── Card horizontal (estilo delivery app) ────────────────────────────────────
function ProductRow({ product, onAdd, quantity }) {
    const imageUrl = getProductImage(product.name);
    const description = getDescription(product);
    const isAvailable = product.is_available && product.stock > 0;

    return (
        <div className="flex items-stretch gap-4 bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 hover:border-paninos-yellow/20 transition-all duration-200 group">

            {/* Imagen cuadrada */}
            {imageUrl && (
                <div className="relative w-28 shrink-0 overflow-hidden bg-[#252525]">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Indicador de cantidad */}
                    {quantity > 0 && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-paninos-yellow text-black text-[10px] font-display font-bold flex items-center justify-center shadow">
                            {quantity}
                        </div>
                    )}
                </div>
            )}

            {/* Info */}
            <div className="flex flex-col justify-center py-4 pr-4 flex-1 min-w-0">
                <h3 className="font-display font-bold text-sm text-white uppercase leading-snug group-hover:text-paninos-yellow transition-colors mb-1">
                    {product.name}
                </h3>

                {description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        {description}
                    </p>
                )}

                {/* Precio + botón */}
                <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-base text-paninos-yellow">
                        ${parseFloat(product.price).toLocaleString('es-CO')}
                    </span>

                    {isAvailable ? (
                        <button
                            onClick={() => onAdd(product)}
                            className="w-8 h-8 rounded-full bg-paninos-yellow text-black flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-md"
                            aria-label={`Agregar ${product.name}`}
                        >
                            {quantity > 0 ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className="text-lg font-bold leading-none">+</span>
                            )}
                        </button>
                    ) : (
                        <span className="text-xs text-red-400 font-bold tracking-wide">Agotado</span>
                    )}
                </div>
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

    // Memoizado para evitar loop infinito en useEffect
    const currentLocation = useMemo(
        () => getLocationBySlug(locationSlug) || LOCATIONS[0],
        [locationSlug]
    );

    const { addItem, totalItems, setLocation, setOrderType, getQuantity } = useCart();

    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Sincronizar sede con CartContext
    useEffect(() => {
        setLocation(currentLocation);
        setOrderType(orderType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLocation.id, orderType]);

    // Fetch menú
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('menu/');

                const apiCategories = data
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
            } catch {
                setAllCategories(EXTRA_CATEGORIES);
                setActiveTab(EXTRA_CATEGORIES[0]?.id || null);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLocation.id]);

    const handleAdd = useCallback((product) => {
        addItem(product);
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
    }, [addItem]);

    const activeCategory = allCategories.find(c => c.id === activeTab);

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-paninos-dark flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-paninos-yellow border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-500 font-display text-xs tracking-widest uppercase">Cargando menú...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paninos-dark text-white font-sans">

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-paninos-dark/95 backdrop-blur-md border-b border-white/8 shadow-2xl">

                {/* Fila principal */}
                <div className="flex items-center gap-3 px-4 py-3">

                    {/* Botón atrás */}
                    <button
                        onClick={() => router.push('/')}
                        className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all flex-shrink-0"
                        aria-label="Volver al inicio"
                    >
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Brand */}
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-display font-bold text-white tracking-wide">PANINOS</span>
                        <span className="text-[10px] text-gray-500 font-sans tracking-wider">Menú</span>
                    </div>

                    {/* Sede pill — centro */}
                    <button
                        onClick={() => router.push('/')}
                        className="flex-1 flex justify-center"
                        aria-label="Cambiar sede"
                    >
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paninos-yellow/10 border border-paninos-yellow/20 hover:bg-paninos-yellow/20 transition-colors max-w-[180px]">
                            <svg className="w-3 h-3 text-paninos-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-bold text-paninos-yellow truncate">{currentLocation.name}</span>
                            <svg className="w-3 h-3 text-paninos-yellow/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </button>

                    {/* Carrito */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                        aria-label="Ver carrito"
                    >
                        <svg className="w-5 h-5 text-paninos-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-paninos-yellow text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-paninos-dark">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>

                {/* Pestañas */}
                <div className="overflow-x-auto scrollbar-hide border-t border-white/5">
                    <div className="flex px-4 pb-3 pt-2 gap-2 w-max min-w-full">
                        {allCategories.map((cat) => {
                            const isActive = activeTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`px-5 py-2 rounded-full text-sm font-display font-bold whitespace-nowrap transition-all duration-200
                                        ${isActive
                                            ? 'bg-paninos-yellow text-black shadow-md'
                                            : 'text-gray-400 hover:text-white border border-white/8 hover:border-white/20'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* ── Lista de productos ─────────────────────────────────────────── */}
            <main className="px-4 py-4 pb-32 max-w-2xl mx-auto">
                {activeCategory?.products.length ? (
                    <div className="flex flex-col gap-3">
                        {activeCategory.products.map((product) => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                onAdd={handleAdd}
                                quantity={getQuantity(product.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 py-24 font-display tracking-widest text-sm uppercase">
                        Sin productos disponibles
                    </p>
                )}
            </main>

            {/* ── Floating Cart Button ───────────────────────────────────────── */}
            {totalItems > 0 && (
                <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-gradient-to-t from-paninos-dark via-paninos-dark/80 to-transparent z-40 pointer-events-none">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="pointer-events-auto w-full max-w-md mx-auto flex items-center justify-between gap-4 px-5 py-3.5 bg-paninos-yellow text-black font-display font-bold rounded-2xl shadow-xl shadow-paninos-yellow/20 hover:bg-white transition-colors"
                    >
                        <span className="bg-black/15 px-2.5 py-1 rounded-xl text-sm min-w-[56px] text-center">
                            {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
                        </span>
                        <span className="flex items-center gap-2 text-base">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Ver carrito
                        </span>
                        <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
