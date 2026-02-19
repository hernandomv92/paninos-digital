'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import UpsellDrinksModal from './UpsellDrinksModal';

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
    return PRODUCT_IMAGES[key] ? `/images/products/${PRODUCT_IMAGES[key]}` : null;
};

// IDs de bebidas locales (deben coincidir con UpsellDrinksModal)
const DRINK_IDS = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'];

export default function CartDrawer({ isOpen, onClose }) {
    const router = useRouter();
    const { items, totalItems, totalPrice, updateQuantity, removeItem, location } = useCart();

    const [showUpsell, setShowUpsell] = useState(false);

    // Bloquear scroll del body
    useEffect(() => {
        document.body.style.overflow = (isOpen || showUpsell) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, showUpsell]);

    // Cerrar con Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    // Detectar si el carrito tiene solo sandwiches (sin bebidas ya agregadas)
    const hasOnlySandwiches = items.length > 0 && items.every(
        ({ product }) => !DRINK_IDS.includes(product.id)
    );

    const handleCheckoutClick = () => {
        if (hasOnlySandwiches) {
            // Mostrar upsell antes de ir al checkout
            setShowUpsell(true);
        } else {
            goToCheckout();
        }
    };

    const goToCheckout = () => {
        setShowUpsell(false);
        onClose();
        router.push('/checkout');
    };

    return (
        <>
            {/* Modal de upsell de bebidas */}
            <UpsellDrinksModal
                isOpen={showUpsell}
                onClose={() => setShowUpsell(false)}
                onContinue={goToCheckout}
            />

            {/* Backdrop del drawer */}
            <div
                className={`fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:max-w-md z-[95] flex flex-col bg-[#161616] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div>
                        <h2 className="font-display font-bold text-xl text-white">Tu Pedido</h2>
                        {location && (
                            <p className="text-xs text-paninos-yellow font-bold tracking-wide mt-0.5 flex items-center gap-1.5">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {location.name} &middot; Recoger
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {totalItems > 0 && (
                            <span className="text-xs text-gray-500 font-bold">
                                {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
                            </span>
                        )}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            aria-label="Cerrar carrito"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Contenido */}
                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="font-display font-bold text-white text-lg mb-2">Carrito vacío</p>
                        <p className="text-sm text-gray-500 mb-6">Agrega productos del menú para comenzar tu pedido</p>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-paninos-yellow text-black font-display font-bold rounded-xl hover:bg-white transition-colors text-sm"
                        >
                            Ver Menú
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto py-4 space-y-3 px-5">
                        {items.map(({ product, quantity }) => {
                            const imageUrl = getProductImage(product);
                            return (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-3 bg-[#1E1E1E] rounded-2xl p-3 border border-white/5"
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">
                                                🥤
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-display font-bold text-sm text-white truncate">{product.name}</p>
                                        <p className="text-paninos-yellow font-bold text-sm mt-0.5">
                                            ${(parseFloat(product.price) * quantity).toLocaleString('es-CO')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => updateQuantity(product.id, quantity - 1)}
                                            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                            aria-label="Reducir cantidad"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="font-display font-bold text-white text-sm w-5 text-center">{quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(product.id, quantity + 1)}
                                            className="w-7 h-7 rounded-full bg-paninos-yellow/20 flex items-center justify-center hover:bg-paninos-yellow hover:text-black transition-all text-paninos-yellow"
                                            aria-label="Aumentar cantidad"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => removeItem(product.id)}
                                            className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center hover:bg-red-500/30 transition-colors text-red-400 ml-1"
                                            aria-label="Eliminar producto"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-white/10 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Subtotal</span>
                            <span className="font-display font-bold text-white text-lg">
                                ${totalPrice.toLocaleString('es-CO')}
                            </span>
                        </div>

                        {location && (
                            <div className="bg-paninos-yellow/10 border border-paninos-yellow/20 rounded-xl px-4 py-3 flex items-center gap-3">
                                <svg className="w-4 h-4 text-paninos-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-xs font-bold text-paninos-yellow">Tiempo estimado</p>
                                    <p className="text-xs text-gray-400">Listo en ~{location.prepTimeMinutes} min en {location.name}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleCheckoutClick}
                            className="w-full py-4 bg-paninos-yellow text-black font-display font-bold text-lg rounded-2xl hover:bg-white transition-colors shadow-lg shadow-paninos-yellow/20 flex items-center justify-center gap-2"
                        >
                            <span>Finalizar Pedido</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
