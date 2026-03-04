'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = axios.create({ baseURL: API_BASE });

// ─── Mapa de imágenes de bebidas ──────────────────────────────────────────────
// Clave: nombre normalizado (uppercase, sin tildes) tal como aparece en Loggro
// Valor: ruta pública relativa al archivo WebP
const BEBIDA_IMAGES = {
    'AGUA BRISA CON GAS 600ML': '/images/Bebidas/AGUA BRISA CON GAS 600ML.webp',
    'AGUA BRISA SABORIZADA 280ML': '/images/Bebidas/AGUA BRISA SABORIZADA 280ML.webp',
    'AGUA BRISA SIN GAS 600ML': '/images/Bebidas/AGUA BRISA SIN GAS 600ML.webp',
    'AGUA SABORIZADA 600ML': '/images/Bebidas/AGUA SABORIZADA 600ML.webp',
    'COCA COLA 500ML': '/images/Bebidas/COCACOLA 500ML.webp',
    'COCACOLA 500ML': '/images/Bebidas/COCACOLA 500ML.webp',
    'COCACOLA 1.5LT': '/images/Bebidas/COCACOLA 1.5LT.webp',
    'COCACOLA 1.5L': '/images/Bebidas/COCACOLA 1.5LT.webp',
    'COCACOLA 250ML': '/images/Bebidas/COCACOLA 250ML.webp',
    'COCACOLA 400ML': '/images/Bebidas/COCACOLA 400ML.webp',
    'COCACOLA ZERO 400ML': '/images/Bebidas/COCACOLA ZERO 400ML.webp',
    'CORONITA': '/images/Bebidas/CORONITA.webp',
    'DEL VALLE 1,5L CITRICO': '/images/Bebidas/DEL VALLE 1,5L CITRICO.webp',
    'DEL VALLE 250ML': '/images/Bebidas/DEL VALLE 250ML.webp',
    'DEL VALLE CAJA 188ML': '/images/Bebidas/DEL VALLE CAJA 188ML.webp',
    'DEL VALLE CAJA 946ML': '/images/Bebidas/DEL VALLE CAJA 946ML.webp',
    'DEL VALLE NARANJA 400ML': '/images/Bebidas/DEL VALLE NARANJA 400ML.webp',
    'PREMIO 400ML': '/images/Bebidas/PREMIO 400ML.webp',
    'QUATRO 1.5 L': '/images/Bebidas/QUATRO 1.5 L.webp',
    'QUATRO 400 ML': '/images/Bebidas/QUATRO 400 ML.webp',
    'SPRITE 400 ML': '/images/Bebidas/SPRITE 400 ML.webp',
    'FUZE TEA 400 ML': '/images/Bebidas/fuze tea 400 ML.webp',
    // Alias adicionales por si el nombre en Loggro varía levemente
    'AGUA SABORIZADA': '/images/Bebidas/AGUA BRISA SABORIZADA 280ML.webp',
    'AGUA BRISA': '/images/Bebidas/AGUA BRISA SIN GAS 600ML.webp',
    'DEL VALLE': '/images/Bebidas/DEL VALLE CAJA 188ML.webp',
    'COCA COLA': '/images/Bebidas/COCACOLA 500ML.webp',
    'SPRITE': '/images/Bebidas/SPRITE 400 ML.webp',
    'QUATRO': '/images/Bebidas/QUATRO 400 ML.webp',
    'FUZE TEA': '/images/Bebidas/fuze tea 400 ML.webp',
    'PREMIO': '/images/Bebidas/PREMIO 400ML.webp',
};

/**
 * Resuelve la imagen de una bebida dado su nombre de Loggro.
 * Normaliza a UPPERCASE y prueba coincidencia exacta, luego parcial.
 */
function getBebidaImage(name) {
    if (!name) return null;
    const key = name.trim().toUpperCase();
    if (BEBIDA_IMAGES[key]) return BEBIDA_IMAGES[key];
    // Búsqueda parcial: la clave del mapa está contenida en el nombre del producto
    const match = Object.keys(BEBIDA_IMAGES).find(k => key.includes(k) || k.includes(key));
    return match ? BEBIDA_IMAGES[match] : null;
}

// Normaliza un nombre de categoría para compararlo
const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Placeholder cuando no hay imagen
function ItemPlaceholder({ isSnack }) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            {isSnack ? (
                <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            ) : (
                <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 3v1m6-1v1M9 19h6m-7 0h8a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2zm3-13v4" />
                </svg>
            )}
        </div>
    );
}

function ItemImage({ src, alt, isSnack }) {
    const [errored, setErrored] = useState(false);
    if (!src || errored) return <ItemPlaceholder isSnack={isSnack} />;
    return (
        <img
            src={src}
            alt={alt}
            onError={() => setErrored(true)}
            className="w-full h-full object-contain"
        />
    );
}

// Sección con scroll horizontal y flechas
function ScrollSection({ title, subtitle, icon, items, selected, onIncrement, onDecrement }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 8);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        return () => el.removeEventListener('scroll', checkScroll);
    }, [items, checkScroll]);

    const scroll = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * 200, behavior: 'smooth' });
    };

    if (!items || items.length === 0) return null;

    const isSnack = subtitle?.includes('nack');

    return (
        <div className="mb-5">
            {/* Encabezado de sección */}
            <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-base">{icon}</span>
                <div className="flex-1">
                    <p className="text-sm font-display font-bold text-white leading-none">{title}</p>
                    {subtitle && <p className="text-[10px] text-gray-600 mt-0.5">{subtitle}</p>}
                </div>
                {/* Flechas de navegación */}
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => scroll(-1)}
                        disabled={!canScrollLeft}
                        className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors disabled:opacity-25"
                        aria-label="Anterior"
                    >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => scroll(1)}
                        disabled={!canScrollRight}
                        className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors disabled:opacity-25"
                        aria-label="Siguiente"
                    >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Carrusel horizontal */}
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {items.map((item) => {
                    const qty = selected[item.id] || 0;
                    const isSelected = qty > 0;

                    return (
                        <div
                            key={item.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => onIncrement(item)}
                            onKeyDown={(e) => e.key === 'Enter' && onIncrement(item)}
                            style={{ scrollSnapAlign: 'start', minWidth: '80px', maxWidth: '80px' }}
                            className={`relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border cursor-pointer select-none transition-all duration-200 flex-shrink-0
                                ${isSelected
                                    ? 'bg-paninos-yellow/15 border-paninos-yellow/50'
                                    : 'bg-white/5 border-white/8 hover:border-white/20 hover:bg-white/8'
                                }`}
                        >
                            {/* Badge cantidad */}
                            {isSelected && (
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-paninos-yellow text-black text-[10px] font-bold rounded-full flex items-center justify-center z-10">
                                    {qty}
                                </div>
                            )}

                            {/* Botón quitar */}
                            {isSelected && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onDecrement(item.id); }}
                                    className="absolute top-1 left-1 w-4 h-4 rounded-full bg-red-500/80 text-white flex items-center justify-center text-[9px] font-bold z-10 hover:bg-red-500"
                                    aria-label={`Quitar ${item.name}`}
                                >
                                    ✕
                                </button>
                            )}

                            {/* Imagen */}
                            <div className="w-10 h-10 flex-shrink-0">
                                <ItemImage src={item.image} alt={item.name} isSnack={isSnack} />
                            </div>

                            <span className="text-[10px] text-center leading-tight font-display font-bold text-gray-300 line-clamp-2">
                                {item.name}
                            </span>
                            <span className="text-[10px] text-paninos-yellow font-bold">
                                ${parseFloat(item.price).toLocaleString('es-CO')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * UpsellDrinksModal
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onContinue: () => void
 */
export default function UpsellDrinksModal({ isOpen, onClose, onContinue }) {
    const { addItem } = useCart();
    const [selected, setSelected] = useState({});
    const [drinks, setDrinks] = useState([]);
    const [snacks, setSnacks] = useState([]);
    const [loadingItems, setLoadingItems] = useState(true);

    // Carga bebidas y snacks del API cuando el modal se abre
    useEffect(() => {
        if (!isOpen) return;
        let cancelled = false;

        const fetchExtras = async () => {
            setLoadingItems(true);
            try {
                const { data } = await api.get('menu/');

                const DRINK_KEYWORDS = ['bebida', 'gaseosa', 'bebidas', 'jugo', 'agua', 'refrescos'];
                const SNACK_KEYWORDS = ['snack', 'snacks', 'platano', 'platanos', 'papa', 'papas monterojo'];
                const EXCLUDED_NAME_PREFIXES = ['prueba', 'combo ', 'domi ', 'salsas 200gr pedido'];

                const filterProducts = (cat, isDrink = false) =>
                    cat.products.filter(p => {
                        if (!p.name || parseFloat(p.price) <= 0 || !p.is_available) return false;
                        const n = p.name.toLowerCase();
                        if (EXCLUDED_NAME_PREFIXES.some(pf => n.startsWith(pf))) return false;
                        return true;
                    }).map(p => ({
                        id: String(p.id),
                        name: p.name,
                        price: p.price,
                        // Bebidas: imagen real del mapa. Snacks: placeholder.
                        image: isDrink ? getBebidaImage(p.name) : null,
                    }));

                const drinksCategory = data.find(cat => {
                    const n = normalize(cat.name);
                    return DRINK_KEYWORDS.some(k => n.includes(k));
                });

                const snacksCategory = data.find(cat => {
                    const n = normalize(cat.name);
                    return SNACK_KEYWORDS.some(k => n.includes(k));
                });

                if (!cancelled) {
                    setDrinks(drinksCategory ? filterProducts(drinksCategory, true) : []);
                    setSnacks(snacksCategory ? filterProducts(snacksCategory, false) : []);
                }
            } catch {
                // Silently fail — el modal puede mostrar secciones vacías
            } finally {
                if (!cancelled) setLoadingItems(false);
            }
        };

        fetchExtras();
        return () => { cancelled = true; };
    }, [isOpen]);

    const increment = (item) => {
        setSelected(prev => ({
            ...prev,
            [item.id]: Math.min((prev[item.id] || 0) + 1, 5),
        }));
    };

    const decrement = (itemId) => {
        setSelected(prev => {
            const next = { ...prev };
            if ((next[itemId] || 0) <= 1) delete next[itemId];
            else next[itemId] -= 1;
            return next;
        });
    };

    // Todos los items (bebidas + snacks) para calcular totales
    const allItems = [...drinks, ...snacks];

    const handleContinue = () => {
        Object.entries(selected).forEach(([itemId, qty]) => {
            const item = allItems.find(i => i.id === itemId);
            if (!item) return;
            const product = {
                id: item.id,
                name: item.name,
                price: String(item.price),
                is_available: true,
                stock: 99,
            };
            for (let i = 0; i < qty; i++) addItem(product);
        });
        setSelected({});
        onContinue();
    };

    const handleSkip = () => {
        setSelected({});
        onContinue();
    };

    const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0);
    const extraCost = Object.entries(selected).reduce((acc, [id, qty]) => {
        const item = allItems.find(i => i.id === id);
        return acc + (item ? parseFloat(item.price) * qty : 0);
    }, 0);

    const hasContent = drinks.length > 0 || snacks.length > 0;

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
                onClick={handleSkip}
            />

            {/* Modal — bottom sheet en móvil, centrado en desktop */}
            <div className="fixed z-[210] bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full">
                <div className="bg-[#1A1A1A] rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

                    {/* Handle bar (móvil) */}
                    <div className="flex justify-center pt-3 pb-1 sm:hidden">
                        <div className="w-10 h-1 rounded-full bg-white/20" />
                    </div>

                    <div className="p-6 pb-8">
                        {/* Título */}
                        <div className="text-center mb-6">
                            <p className="text-xs font-bold text-paninos-yellow tracking-widest uppercase mb-1">
                                Antes de finalizar...
                            </p>
                            <h2 className="font-display font-bold text-xl text-white leading-snug">
                                ¿Le agregamos algo más?
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Acompaña tu pedido con una bebida o snack
                            </p>
                        </div>

                        {/* Contenido */}
                        {loadingItems ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-6 h-6 border-2 border-paninos-yellow border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : hasContent ? (
                            <>
                                {drinks.length > 0 && (
                                    <ScrollSection
                                        title="Bebidas"
                                        subtitle="Refresca tu pedido"
                                        icon="🥤"
                                        items={drinks}
                                        selected={selected}
                                        onIncrement={increment}
                                        onDecrement={decrement}
                                    />
                                )}
                                {snacks.length > 0 && (
                                    <ScrollSection
                                        title="Snacks"
                                        subtitle="Para picar algo"
                                        icon="🍟"
                                        items={snacks}
                                        selected={selected}
                                        onIncrement={increment}
                                        onDecrement={decrement}
                                    />
                                )}
                            </>
                        ) : (
                            // Fallback si la API no trae nada
                            <p className="text-center text-gray-600 text-sm py-4">
                                No hay extras disponibles en este momento
                            </p>
                        )}

                        {/* Resumen de seleccionados */}
                        {totalSelected > 0 && (
                            <div className="bg-paninos-yellow/10 border border-paninos-yellow/20 rounded-xl px-4 py-2.5 flex items-center justify-between mb-4 mt-2">
                                <span className="text-sm text-gray-300">
                                    {totalSelected} extra{totalSelected > 1 ? 's' : ''} seleccionado{totalSelected > 1 ? 's' : ''}
                                </span>
                                <span className="font-display font-bold text-paninos-yellow text-sm">
                                    +${extraCost.toLocaleString('es-CO')}
                                </span>
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="space-y-2 mt-4">
                            <button
                                type="button"
                                onClick={handleContinue}
                                className="w-full py-3.5 bg-paninos-yellow text-black font-display font-bold text-base rounded-2xl hover:bg-white transition-colors"
                            >
                                {totalSelected > 0 ? 'Agregar y finalizar pedido' : 'Continuar sin agregar'}
                            </button>
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="w-full py-2.5 text-gray-500 text-sm font-bold hover:text-gray-300 transition-colors"
                            >
                                No gracias, continuar sin extras
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
