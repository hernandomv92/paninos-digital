'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

// Bebidas disponibles para el upsell
// Cuando tengas las imágenes, sube los archivos a /public/images/drinks/
// y el campo `image` se mostrará automáticamente.
const DRINKS = [
    { id: 'b1', name: 'Agua', price: 3000, image: '/images/drinks/agua.png' },
    { id: 'b2', name: 'Gaseosa', price: 3000, image: '/images/drinks/gaseosa.png' },
    { id: 'b3', name: 'Jugo Valle', price: 3500, image: '/images/drinks/jugo.png' },
    { id: 'b4', name: 'Fuze Tea', price: 3500, image: '/images/drinks/fuzetea.png' },
    { id: 'b5', name: 'Coronita', price: 5000, image: '/images/drinks/coronita.png' },
];

// Placeholder SVG cuando no hay imagen todavía
function DrinkPlaceholder() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-xl">
            <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 3v1m6-1v1M9 19h6m-7 0h8a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2zm3-13v4" />
            </svg>
        </div>
    );
}

function DrinkImage({ src, alt }) {
    const [errored, setErrored] = useState(false);
    if (errored) return <DrinkPlaceholder />;
    return (
        <img
            src={src}
            alt={alt}
            onError={() => setErrored(true)}
            className="w-full h-full object-contain"
        />
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

    const increment = (drink) => {
        setSelected(prev => ({
            ...prev,
            [drink.id]: Math.min((prev[drink.id] || 0) + 1, 5),
        }));
    };

    const decrement = (drinkId) => {
        setSelected(prev => {
            const next = { ...prev };
            if ((next[drinkId] || 0) <= 1) {
                delete next[drinkId];
            } else {
                next[drinkId] = next[drinkId] - 1;
            }
            return next;
        });
    };

    const handleContinue = () => {
        Object.entries(selected).forEach(([drinkId, qty]) => {
            const drink = DRINKS.find(d => d.id === drinkId);
            if (!drink) return;
            const product = {
                id: drink.id,
                name: drink.name,
                price: String(drink.price),
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
        const d = DRINKS.find(d => d.id === id);
        return acc + (d ? d.price * qty : 0);
    }, 0);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
                onClick={handleSkip}
            />

            {/* Modal — bottom sheet en móvil */}
            <div className="fixed z-[210] bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-sm w-full">
                <div className="bg-[#1A1A1A] rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

                    {/* Handle bar */}
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
                                ¿Te gustaría agregar una bebida?
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Acompaña tu sandwich con la bebida perfecta
                            </p>
                        </div>

                        {/* Grid de bebidas — div, NO button, para evitar botones anidados */}
                        <div className="grid grid-cols-5 gap-2 mb-5">
                            {DRINKS.map((drink) => {
                                const qty = selected[drink.id] || 0;
                                const isSelected = qty > 0;

                                return (
                                    // ⚠️ div con role/onClick en lugar de <button> para evitar nesting de botones
                                    <div
                                        key={drink.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => increment(drink)}
                                        onKeyDown={(e) => e.key === 'Enter' && increment(drink)}
                                        className={`relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border cursor-pointer select-none transition-all duration-200
                                            ${isSelected
                                                ? 'bg-paninos-yellow/15 border-paninos-yellow/50'
                                                : 'bg-white/5 border-white/8 hover:border-white/20 hover:bg-white/8'
                                            }`}
                                    >
                                        {/* Badge de cantidad */}
                                        {isSelected && (
                                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-paninos-yellow text-black text-[10px] font-bold rounded-full flex items-center justify-center z-10">
                                                {qty}
                                            </div>
                                        )}

                                        {/* Botón quitar — hermano del badge, NO anidado */}
                                        {isSelected && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); decrement(drink.id); }}
                                                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-red-500/80 text-white flex items-center justify-center text-[9px] font-bold z-10 hover:bg-red-500"
                                                aria-label={`Quitar ${drink.name}`}
                                            >
                                                ✕
                                            </button>
                                        )}

                                        {/* Imagen */}
                                        <div className="w-10 h-10 flex-shrink-0">
                                            <DrinkImage src={drink.image} alt={drink.name} />
                                        </div>

                                        <span className="text-[10px] text-center leading-tight font-display font-bold text-gray-300">
                                            {drink.name}
                                        </span>
                                        <span className="text-[10px] text-paninos-yellow font-bold">
                                            ${drink.price.toLocaleString('es-CO')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Resumen */}
                        {totalSelected > 0 && (
                            <div className="bg-paninos-yellow/10 border border-paninos-yellow/20 rounded-xl px-4 py-2.5 flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-300">
                                    {totalSelected} bebida{totalSelected > 1 ? 's' : ''} seleccionada{totalSelected > 1 ? 's' : ''}
                                </span>
                                <span className="font-display font-bold text-paninos-yellow text-sm">
                                    +${extraCost.toLocaleString('es-CO')}
                                </span>
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={handleContinue}
                                className="w-full py-3.5 bg-paninos-yellow text-black font-display font-bold text-base rounded-2xl hover:bg-white transition-colors"
                            >
                                {totalSelected > 0 ? 'Agregar y finalizar pedido' : 'Continuar sin bebida'}
                            </button>
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="w-full py-2.5 text-gray-500 text-sm font-bold hover:text-gray-300 transition-colors"
                            >
                                No gracias, continuar sin bebida
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
