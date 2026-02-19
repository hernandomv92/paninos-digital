'use client';

import { useRouter } from 'next/navigation';

/**
 * NoCobertura
 * Pantalla que se muestra cuando la dirección del cliente
 * no está dentro de las zonas de entrega activas.
 *
 * Props:
 *  - address: string       — dirección o barrio que ingresó el cliente
 *  - onTryAgain: () => void — volver a intentar con otra dirección
 *  - onPickup: () => void  — ir al flujo de recoger en tienda
 */
export default function NoCobertura({ address, onTryAgain, onPickup }) {
    const router = useRouter();

    const handlePickup = () => {
        if (onPickup) {
            onPickup();
        } else {
            router.push('/');
        }
    };

    const handleTryAgain = () => {
        if (onTryAgain) {
            onTryAgain();
        } else {
            router.back();
        }
    };

    return (
        <div className="min-h-screen bg-paninos-dark text-white font-sans flex flex-col">

            {/* Header */}
            <header className="flex items-center gap-3 px-4 py-4 border-b border-white/8">
                <button
                    onClick={handleTryAgain}
                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Volver"
                >
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="flex-1 flex justify-center">
                    <span className="font-display font-bold text-lg text-white tracking-wide">PANINOS</span>
                </div>
                {/* Spacer para centrar el título */}
                <div className="w-9" />
            </header>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-12">

                {/* Ícono de sin cobertura */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                        <svg className="w-11 h-11 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    {/* Badge de error */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center border-2 border-paninos-dark">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>

                {/* Mensaje principal */}
                <h1 className="font-display font-bold text-2xl text-white leading-snug mb-3 max-w-xs">
                    Lo sentimos, no tenemos cobertura en esta zona
                </h1>

                {/* Dirección intentada */}
                {address && (
                    <div className="mb-4 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl max-w-xs w-full">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Dirección ingresada</p>
                        <p className="text-sm text-gray-300 font-medium">{address}</p>
                    </div>
                )}

                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-10">
                    Por ahora nuestros domicilios tienen cobertura limitada en Cali.
                    ¿Te gustaría recoger tu pedido en una de nuestras sedes más cercanas?
                </p>

                {/* CTAs */}
                <div className="flex flex-col gap-3 w-full max-w-xs">

                    {/* Primaria — Recoger en Tienda */}
                    <button
                        onClick={handlePickup}
                        className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-paninos-yellow text-black font-display font-bold text-base rounded-2xl hover:bg-white transition-colors shadow-lg shadow-paninos-yellow/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Recoger en Tienda
                    </button>

                    {/* Secundaria — Ingresar otra dirección */}
                    <button
                        onClick={handleTryAgain}
                        className="w-full px-6 py-3.5 border border-white/15 text-gray-300 font-display font-bold text-sm rounded-2xl hover:border-white/30 hover:text-white transition-all"
                    >
                        Ingresar otra dirección
                    </button>
                </div>

                {/* Zonas con cobertura actual */}
                <div className="mt-10 max-w-xs w-full">
                    <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mb-3">
                        Zonas con cobertura activa
                    </p>
                    <div className="flex flex-col gap-2">
                        {[
                            { sede: 'Sede Caldas', barrios: 'Caldas, El Ingenio, La Flora, Meléndez, Univalle' },
                            { sede: 'Sede Libertadores', barrios: 'Libertadores, Alfonso López, Aguablanca, Sameco' },
                        ].map((z) => (
                            <div key={z.sede} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-left">
                                <p className="text-xs font-bold text-paninos-yellow mb-0.5">{z.sede}</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{z.barrios}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="px-6 py-6 border-t border-white/5 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-gray-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <a
                        href="https://wa.me/573137258091"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-600 hover:text-paninos-yellow transition-colors"
                    >
                        ¿Necesitas ayuda con tu pedido?
                    </a>
                </div>
                <p className="text-[10px] text-gray-700">© 2025 Paninos · Cali, Valle del Cauca</p>
            </footer>
        </div>
    );
}
