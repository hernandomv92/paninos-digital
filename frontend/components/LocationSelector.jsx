'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LOCATIONS } from '@/lib/locations';
import { useCart } from '@/context/CartContext';
import DeliveryFlow from './DeliveryFlow';

/**
 * LocationSelector
 * Modal de pantalla completa para que el usuario elija la sede
 * donde recogerá su pedido.
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 */
export default function LocationSelector({ isOpen, onClose }) {
    const router = useRouter();
    const { setLocation, setOrderType } = useCart();
    const [showDelivery, setShowDelivery] = useState(false);

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Cerrar con tecla Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSelectLocation = (location) => {
        setOrderType('pickup');
        setLocation(location);
        onClose();
        // Navegar al menú con la sede seleccionada como parámetro
        router.push(`/menu?location=${location.slug}&type=pickup`);
    };

    if (!isOpen) return null;

    // Mostrar el flujo de domicilio (pantalla completa)
    if (showDelivery) {
        return (
            <DeliveryFlow
                onClose={() => {
                    setShowDelivery(false);
                    onClose();
                }}
            />
        );
    }

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
            onClick={(e) => {
                // Cerrar al hacer click en el backdrop
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Overlay oscuro con blur */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />

            {/* Modal panel */}
            <div className="relative z-10 w-full sm:max-w-lg mx-4 sm:mx-auto">
                {/* Bottom sheet en móvil, card centrada en desktop */}
                <div className="bg-[#1A1A1A] rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

                    {/* Handle visual (solo móvil) */}
                    <div className="flex justify-center pt-3 pb-1 sm:hidden">
                        <div className="w-12 h-1 rounded-full bg-white/20" />
                    </div>

                    {/* Header del modal */}
                    <div className="px-6 pt-4 pb-2 sm:pt-8 sm:pb-4 flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold tracking-widest text-paninos-yellow uppercase mb-1">
                                Recoger en Tienda
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                                ¿En cuál sede<br />vas a recoger?
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0 mt-1"
                            aria-label="Cerrar"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Lista de sedes */}
                    <div className="px-6 pb-8 sm:pb-10 pt-4 space-y-4">
                        {LOCATIONS.map((location) => (
                            <button
                                key={location.id}
                                onClick={() => handleSelectLocation(location)}
                                className="w-full group relative bg-[#252525] hover:bg-[#2E2E2E] border border-white/5 hover:border-paninos-yellow/50 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-paninos-yellow/10"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icono/Emoji de la sede */}
                                    <div className="w-12 h-12 rounded-xl bg-paninos-yellow/10 border border-paninos-yellow/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-paninos-yellow/20 transition-colors">
                                        {location.emoji}
                                    </div>

                                    {/* Info de la sede */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-display font-bold text-lg text-white group-hover:text-paninos-yellow transition-colors">
                                                {location.name}
                                            </h3>
                                            {/* Badge de tiempo estimado */}
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-paninos-yellow/10 text-paninos-yellow border border-paninos-yellow/20">
                                                ~{location.prepTimeMinutes} min
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {location.address} · {location.neighborhood}
                                        </p>

                                        <p className="text-[11px] text-gray-600 mt-0.5 font-bold">
                                            Cali, Valle del Cauca
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {location.schedule}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-5 h-5 text-paninos-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))}

                        {/* Divider */}
                        <div className="flex items-center gap-3 py-2">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-gray-500 font-bold tracking-wider uppercase">o</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* CTA secundario: Domicilio */}
                        <button
                            onClick={() => setShowDelivery(true)}
                            className="w-full py-3.5 rounded-2xl border border-white/10 text-gray-400 text-sm font-bold hover:border-paninos-yellow/30 hover:text-paninos-yellow transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Prefiero pedir a domicilio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
