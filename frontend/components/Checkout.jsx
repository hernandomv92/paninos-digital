'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import Image from 'next/image';

// Image mapping
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

export default function Checkout() {
    const router = useRouter();
    const { items, totalPrice, totalItems, location, orderType, clearCart } = useCart();

    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Redirigir si el carrito está vacío
    if (totalItems === 0) {
        return (
            <div className="min-h-screen bg-paninos-dark flex flex-col items-center justify-center px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="font-display font-bold text-2xl text-white mb-2">Carrito vacío</h2>
                <p className="text-gray-500 text-sm mb-6">Agrega productos antes de finalizar tu pedido</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-paninos-yellow text-black font-display font-bold rounded-xl text-sm"
                >
                    Ir al Menú
                </button>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Formatear teléfono: solo números y limitar a 10 dígitos
        if (name === 'customerPhone') {
            const cleaned = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, customerPhone: cleaned }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validación básica
        if (!formData.customerName.trim()) {
            setError('Por favor ingresa tu nombre');
            return;
        }
        if (formData.customerPhone.length < 10) {
            setError('Por favor ingresa un número de WhatsApp válido (10 dígitos)');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderPayload = {
                customer_name: formData.customerName.trim(),
                customer_phone: formData.customerPhone,
                notes: formData.notes.trim(),
                order_type: orderType || 'pickup',
                location_id: location?.id,
                items: items.map(({ product, quantity }) => ({
                    product_id: product.id,
                    product_name: product.name,
                    quantity,
                    unit_price: product.price,
                })),
                total: totalPrice,
            };

            // TODO: Cuando el endpoint esté listo descomentar esta línea:
            // const response = await api.post('orders/', orderPayload);

            // Por ahora simular el envío con un delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = { data: { id: `PAN-${Date.now()}` } };

            // Limpiar carrito y redirigir a confirmación
            const orderId = response.data.id;
            clearCart();
            router.push(`/confirmacion?order=${orderId}&name=${encodeURIComponent(formData.customerName)}&location=${encodeURIComponent(location?.name || '')}`);

        } catch (err) {
            console.error('Error al crear pedido:', err);
            setError('Hubo un problema al enviar tu pedido. Por favor intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-paninos-dark text-white font-sans">

            {/* Header */}
            <header className="sticky top-0 z-50 bg-paninos-dark/95 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="font-display font-bold text-lg text-white leading-none">Finalizar Pedido</h1>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                            {location?.name} · Recoger en tienda
                        </p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-2xl pb-10">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Resumen del pedido ──────────────────────────────── */}
                    <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/5">
                            <h2 className="font-display font-bold text-white text-lg">
                                Tu Pedido
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                            </p>
                        </div>

                        <div className="divide-y divide-white/5">
                            {items.map(({ product, quantity }) => {
                                const imageUrl = getProductImage(product);
                                return (
                                    <div key={product.id} className="flex items-center gap-3 px-5 py-3">
                                        {/* Mini imagen */}
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-display font-bold text-sm text-white truncate">{product.name}</p>
                                            <p className="text-xs text-gray-500">x{quantity}</p>
                                        </div>

                                        <p className="font-display font-bold text-paninos-yellow text-sm flex-shrink-0">
                                            ${(parseFloat(product.price) * quantity).toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Total */}
                        <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between">
                            <span className="font-display font-bold text-white">TOTAL</span>
                            <span className="font-display font-bold text-2xl text-paninos-yellow">
                                ${totalPrice.toLocaleString('es-CO')}
                            </span>
                        </div>
                    </div>

                    {/* ── Sede de recogida ──────────────────────────────── */}
                    {location && (
                        <div className="bg-paninos-yellow/10 border border-paninos-yellow/20 rounded-2xl p-4 flex items-center gap-4">
                            <span className="text-3xl">{location.emoji}</span>
                            <div>
                                <p className="font-display font-bold text-paninos-yellow text-sm">{location.name}</p>
                                <p className="text-xs text-gray-400">{location.address}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    ⏱️ Listo en aproximadamente <strong className="text-white">{location.prepTimeMinutes} minutos</strong>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Datos del cliente ──────────────────────────────── */}
                    <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/5">
                            <h2 className="font-display font-bold text-white text-lg">Tus Datos</h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Te notificaremos cuando tu pedido esté listo
                            </p>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Nombre */}
                            <div>
                                <label htmlFor="customerName" className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                                    Nombre completo *
                                </label>
                                <input
                                    id="customerName"
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    placeholder="¿Cómo te llamamos?"
                                    autoComplete="name"
                                    className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 font-sans text-sm focus:outline-none focus:border-paninos-yellow/50 focus:ring-1 focus:ring-paninos-yellow/30 transition-all"
                                    required
                                />
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label htmlFor="customerPhone" className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                                    WhatsApp *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-500">
                                        <span className="text-sm">🇨🇴</span>
                                        <span className="text-sm font-bold">+57</span>
                                        <div className="w-px h-4 bg-white/10 ml-1" />
                                    </div>
                                    <input
                                        id="customerPhone"
                                        type="tel"
                                        name="customerPhone"
                                        value={formData.customerPhone}
                                        onChange={handleInputChange}
                                        placeholder="3001234567"
                                        autoComplete="tel"
                                        className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 pl-24 text-white placeholder-gray-600 font-sans text-sm focus:outline-none focus:border-paninos-yellow/50 focus:ring-1 focus:ring-paninos-yellow/30 transition-all"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-600 mt-1.5 pl-1">
                                    Te enviaremos la confirmación por WhatsApp
                                </p>
                            </div>

                            {/* Notas */}
                            <div>
                                <label htmlFor="notes" className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                                    Instrucciones especiales <span className="text-gray-600 normal-case font-normal">(opcional)</span>
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Ej: sin cebolla, extra ajo..."
                                    rows={3}
                                    className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 font-sans text-sm focus:outline-none focus:border-paninos-yellow/50 focus:ring-1 focus:ring-paninos-yellow/30 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Error Message ──────────────────────────────────── */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                            <p className="text-red-400 text-sm font-bold flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* ── Submit Button ──────────────────────────────────── */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-paninos-yellow text-black font-display font-bold text-xl rounded-2xl hover:bg-white transition-colors shadow-lg shadow-paninos-yellow/20 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                <span>Enviando pedido...</span>
                            </>
                        ) : (
                            <>
                                <span>Confirmar Pedido · ${totalPrice.toLocaleString('es-CO')}</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-600">
                        Al confirmar, aceptas nuestros términos de servicio. <br />
                        El pago se realiza en el local al recoger.
                    </p>
                </form>
            </main>
        </div>
    );
}
