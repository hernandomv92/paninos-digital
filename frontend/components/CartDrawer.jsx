'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

// Image mapping (igual que en Menu.jsx)
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

/**
 * CartDrawer
 * Panel lateral (derecha) que muestra el carrito de compras.
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 */
export default function CartDrawer({ isOpen, onClose }) {
    const router = useRouter();
    const { items, totalItems, totalPrice, updateQuantity, removeItem, location, orderType } = useCart();

    // Bloquear scroll del body cuando el drawer está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Cerrar con Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleCheckout = () => {
        onClose();
        router.push('/checkout');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:max-w-md z-[95] flex flex-col bg-[#161616] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div>
                        <h2 className="font-display font-bold text-xl text-white">Tu Pedido</h2>
                        {location && (
                            <p className="text-xs text-paninos-yellow font-bold tracking-wide mt-0.5 flex items-center gap-1">
                                <span>🏪</span>
                                <span>{location.name} · Recoger</span>
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
                    /* Carrito vacío */
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
                    /* Lista de productos */
                    <div className="flex-1 overflow-y-auto py-4 space-y-3 px-5">
                        {items.map(({ product, quantity }) => {
                            const imageUrl = getProductImage(product);
                            return (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-3 bg-[#1E1E1E] rounded-2xl p-3 border border-white/5"
                                >
                                    {/* Imagen pequeña del producto */}
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-display font-bold text-sm text-white truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-paninos-yellow font-bold text-sm mt-0.5">
                                            ${(parseFloat(product.price) * quantity).toLocaleString('es-CO')}
                                        </p>
                                    </div>

                                    {/* Controles de cantidad */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => updateQuantity(product.id, quantity - 1)}
                                            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                                            aria-label="Reducir cantidad"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                                            </svg>
                                        </button>

                                        <span className="font-display font-bold text-white text-sm w-5 text-center">
                                            {quantity}
                                        </span>

                                        <button
                                            onClick={() => updateQuantity(product.id, quantity + 1)}
                                            className="w-7 h-7 rounded-full bg-paninos-yellow/20 flex items-center justify-center hover:bg-paninos-yellow hover:text-black transition-all text-paninos-yellow"
                                            aria-label="Aumentar cantidad"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>

                                        {/* Eliminar */}
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

                {/* Footer con total y checkout */}
                {items.length > 0 && (
                    <div className="border-t border-white/10 p-5 space-y-4">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Subtotal</span>
                            <span className="font-display font-bold text-white text-lg">
                                ${totalPrice.toLocaleString('es-CO')}
                            </span>
                        </div>

                        {/* Nota de recogida */}
                        {location && (
                            <div className="bg-paninos-yellow/10 border border-paninos-yellow/20 rounded-xl px-4 py-3 flex items-center gap-3">
                                <span className="text-lg">⏱️</span>
                                <div>
                                    <p className="text-xs font-bold text-paninos-yellow">Tiempo estimado</p>
                                    <p className="text-xs text-gray-400">
                                        Listo en ~{location.prepTimeMinutes} min en {location.name}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* CTA Checkout */}
                        <button
                            onClick={handleCheckout}
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
