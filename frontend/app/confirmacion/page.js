'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const orderId = searchParams.get('order') || '';
    const customerName = searchParams.get('name') || 'Cliente';
    const locationName = searchParams.get('location') || 'la tienda';
    const paymentMethod = searchParams.get('payment') || 'store';

    return (
        <div className="min-h-screen bg-paninos-dark text-white font-sans flex flex-col items-center justify-center px-4 pb-10">

            {/* Logotipo en texto — siempre visible en fondo oscuro */}
            <div className="mb-8 px-6 py-3 bg-paninos-yellow rounded-2xl">
                <p className="font-display font-bold text-2xl text-black tracking-widest">PANINOS</p>
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
                    Gracias, <span className="text-white font-bold">{customerName}</span>
                </p>
                <p className="text-gray-500 text-sm">
                    Tu pedido está siendo preparado en <span className="text-paninos-yellow font-bold">{locationName}</span>
                </p>
            </div>

            {/* Order ID + método de pago */}
            {orderId && (
                <div className="mt-6 bg-[#1A1A1A] border border-white/10 rounded-2xl px-6 py-4 text-center w-full max-w-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                        Número de pedido
                    </p>
                    <p className="font-display font-bold text-paninos-yellow text-xl tracking-wider">
                        {orderId}
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <p className="text-xs text-gray-500">
                            {paymentMethod === 'online' ? 'Pago en línea · Bold' : 'Pago en tienda al recoger'}
                        </p>
                    </div>
                </div>
            )}

            {/* Instrucciones */}
            <div className="mt-6 max-w-sm w-full space-y-3">
                {[
                    {
                        svg: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                        title: 'Prepara un momento...',
                        desc: 'Estamos preparando tu pedido con toda la dedicación.',
                    },
                    {
                        svg: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
                        title: 'Te notificamos por WhatsApp',
                        desc: 'Recibirás un mensaje cuando tu pedido esté listo.',
                    },
                    {
                        svg: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                        title: 'Recoge tu pedido',
                        desc: `Pasa a ${locationName} y muestra este mensaje.`,
                    },
                ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-paninos-yellow/10 flex items-center justify-center flex-shrink-0 text-paninos-yellow">
                            {step.svg}
                        </div>
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
