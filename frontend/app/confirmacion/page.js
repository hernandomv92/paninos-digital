'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const orderId = searchParams.get('order') || '';
    const customerName = searchParams.get('name') || 'Cliente';
    const locationName = searchParams.get('location') || 'la tienda';

    return (
        <div className="min-h-screen bg-paninos-dark text-white font-sans flex flex-col items-center justify-center px-4 pb-10">

            {/* Logo */}
            <div className="mb-8">
                <Image
                    src="/images/logo.png"
                    alt="Paninos Logo"
                    width={120}
                    height={60}
                    className="object-contain"
                />
            </div>

            {/* Checkmark animado */}
            <div className="w-24 h-24 rounded-full bg-paninos-yellow/10 border-2 border-paninos-yellow flex items-center justify-center mb-6 animate-fade-in-up">
                <svg className="w-12 h-12 text-paninos-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            {/* Mensaje principal */}
            <div className="text-center max-w-sm animate-fade-in-up">
                <h1 className="font-display font-bold text-3xl text-white mb-2">
                    ¡Pedido Recibido!
                </h1>
                <p className="text-gray-400 text-base mb-1">
                    Gracias, <span className="text-white font-bold">{customerName}</span> 🙌
                </p>
                <p className="text-gray-500 text-sm">
                    Tu pedido está siendo preparado en <span className="text-paninos-yellow font-bold">{locationName}</span>
                </p>
            </div>

            {/* Order ID */}
            {orderId && (
                <div className="mt-6 bg-[#1A1A1A] border border-white/10 rounded-2xl px-6 py-4 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                        Número de pedido
                    </p>
                    <p className="font-display font-bold text-paninos-yellow text-xl tracking-wider">
                        {orderId}
                    </p>
                </div>
            )}

            {/* Instrucciones */}
            <div className="mt-8 max-w-sm w-full space-y-3">
                {[
                    {
                        icon: '⏱️',
                        title: 'Prepara un momento...',
                        desc: 'Estamos preparando tu pedido con toda la dedicación.',
                    },
                    {
                        icon: '📱',
                        title: 'Te notificamos por WhatsApp',
                        desc: 'Recibirás un mensaje cuando tu pedido esté listo.',
                    },
                    {
                        icon: '🏪',
                        title: 'Recoge tu pedido',
                        desc: `Pasa a ${locationName} y muestra este mensaje.`,
                    },
                ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
                        <span className="text-2xl flex-shrink-0">{step.icon}</span>
                        <div>
                            <p className="font-display font-bold text-white text-sm">{step.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
                <button
                    onClick={() => router.push('/')}
                    className="w-full py-4 bg-paninos-yellow text-black font-display font-bold text-lg rounded-2xl hover:bg-white transition-colors"
                >
                    Volver al Inicio
                </button>
                <button
                    onClick={() => router.push('/menu')}
                    className="w-full py-3 border border-white/10 text-gray-400 font-display font-bold text-sm rounded-2xl hover:border-white/20 hover:text-white transition-all"
                >
                    Hacer otro pedido
                </button>
            </div>
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-paninos-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-paninos-yellow border-t-transparent" />
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}
