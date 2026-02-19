'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkCoverage, getNeighborhoodSuggestions, COVERAGE_ZONES_DISPLAY } from '@/lib/deliveryZones';
import { getLocationBySlug } from '@/lib/locations';
import { useCart } from '@/context/CartContext';
import NoCobertura from './NoCobertura';

/**
 * DeliveryFlow
 * Flujo completo de domicilio:
 *  1. Input de barrio con autocomplete local (sin API)
 *  2. Verificación de cobertura contra deliveryZones.js
 *  3. Si cubre → setea sede en CartContext y va al menú
 *  4. Si no cubre → muestra NoCobertura con opción de pickup
 *
 * Props:
 *  - onClose: () => void   — cerrar el flujo (volver a la pantalla anterior)
 */
export default function DeliveryFlow({ onClose }) {
    const router = useRouter();
    const { setLocation, setOrderType } = useCart();

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [checking, setChecking] = useState(false);
    const [noCobertura, setNoCobertura] = useState(false);
    const [failedAddress, setFailedAddress] = useState('');
    const [error, setError] = useState('');

    const inputRef = useRef(null);
    const listRef = useRef(null);

    // Foco automático al abrir
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handler = (e) => {
            if (
                !inputRef.current?.contains(e.target) &&
                !listRef.current?.contains(e.target)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setError('');

        if (val.length >= 2) {
            const suggs = getNeighborhoodSuggestions(val, 8);
            setSuggestions(suggs);
            setShowSuggestions(suggs.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (suggestion) => {
        setQuery(suggestion.name);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleCheck = async (e) => {
        e?.preventDefault();

        const trimmed = query.trim();
        if (!trimmed) {
            setError('Por favor ingresa tu barrio');
            return;
        }
        if (trimmed.length < 3) {
            setError('Escribe al menos 3 caracteres');
            return;
        }

        setChecking(true);
        setError('');

        // Pequeño delay para feedback visual
        await new Promise(r => setTimeout(r, 600));

        const result = checkCoverage(trimmed);

        if (result.covered) {
            const location = getLocationBySlug(result.sede_slug);
            if (location) {
                setLocation(location);
                setOrderType('delivery');
                router.push(`/menu?location=${result.sede_slug}&type=delivery`);
            }
        } else {
            setFailedAddress(trimmed);
            setNoCobertura(true);
        }

        setChecking(false);
    };

    // ── Sin cobertura ──────────────────────────────────────────────────────────
    if (noCobertura) {
        return (
            <NoCobertura
                address={failedAddress}
                onTryAgain={() => {
                    setNoCobertura(false);
                    setQuery('');
                    setFailedAddress('');
                }}
                onPickup={() => {
                    setNoCobertura(false);
                    if (onClose) onClose();
                    // El usuario elige pickup desde el selector de sede
                    router.push('/');
                }}
            />
        );
    }

    // ── Formulario de barrio ───────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-[200] bg-paninos-dark text-white font-sans flex flex-col overflow-y-auto">

            {/* Header */}
            <header className="flex items-center justify-between px-4 py-4 border-b border-white/8">
                {/* Botón volver */}
                <button
                    onClick={onClose || (() => router.back())}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    aria-label="Volver"
                >
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold hidden sm:block">Volver</span>
                </button>

                {/* Título centrado opcional */}
                <p className="text-xs font-bold tracking-widest text-paninos-yellow uppercase">
                    Domicilio
                </p>

                {/* Botón cerrar (X) */}
                <button
                    onClick={onClose || (() => router.back())}
                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    aria-label="Cerrar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>


            {/* Contenido */}
            <div className="flex-1 flex flex-col px-5 pt-8 pb-10">

                {/* Ícono de delivery */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-paninos-yellow/10 border border-paninos-yellow/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-paninos-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </div>

                <h1 className="font-display font-bold text-2xl text-white text-center leading-snug mb-2">
                    ¿En qué barrio<br />te encontramos?
                </h1>
                <p className="text-gray-500 text-sm text-center mb-8 leading-relaxed">
                    Escribe tu barrio y verificamos si<br />tenemos cobertura en tu zona
                </p>

                {/* Input + autocomplete */}
                <form onSubmit={handleCheck} className="relative mb-4">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') { e.preventDefault(); handleCheck(); }
                                if (e.key === 'Escape') setShowSuggestions(false);
                            }}
                            placeholder="Ej: Granada, Ciudad Jardín, El Caney..."
                            autoComplete="off"
                            className={`w-full bg-[#1E1E1E] border rounded-2xl px-4 py-4 pl-12 text-white placeholder-gray-600 text-base focus:outline-none transition-all
                                ${error
                                    ? 'border-red-500/50 focus:border-red-500/70'
                                    : 'border-white/10 focus:border-paninos-yellow/50 focus:ring-1 focus:ring-paninos-yellow/20'
                                }`}
                        />

                        {/* Clear button */}
                        {query.length > 0 && (
                            <button
                                type="button"
                                onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false); setError(''); inputRef.current?.focus(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Dropdown de sugerencias — TODOS los barrios de Cali */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div
                            ref={listRef}
                            className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E1E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
                        >
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleSelect(s)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                                >
                                    {/* Indicador de cobertura */}
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.covered ? 'bg-green-500' : 'bg-white/20'
                                        }`} />

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white">{s.name}</p>
                                        <p className={`text-xs mt-0.5 ${s.covered ? 'text-green-500/70' : 'text-gray-600'
                                            }`}>
                                            {s.covered
                                                ? (s.sede === 'libertadores' ? 'Sede Libertadores · Con cobertura' : 'Sede Caldas · Con cobertura')
                                                : 'Sin cobertura de domicilio'
                                            }
                                        </p>
                                    </div>

                                    {s.covered && (
                                        <svg className="w-4 h-4 text-green-500/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                            <div className="px-4 py-2 border-t border-white/5">
                                <p className="text-[10px] text-gray-700 text-center">
                                    🟢 = Tenemos cobertura · ⚪ = Sin cobertura actualmente
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5 pl-1">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </p>
                    )}
                </form>

                {/* Botón de verificar */}
                <button
                    onClick={handleCheck}
                    disabled={checking || query.trim().length < 2}
                    className="w-full py-4 bg-paninos-yellow text-black font-display font-bold text-lg rounded-2xl hover:bg-white transition-colors shadow-lg shadow-paninos-yellow/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {checking ? (
                        <>
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>Verificando cobertura...</span>
                        </>
                    ) : (
                        <>
                            <span>Verificar cobertura</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </>
                    )}
                </button>

                {/* Zonas disponibles */}
                <div className="mt-8">
                    <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mb-3 text-center">
                        Zonas con cobertura activa
                    </p>
                    <div className="space-y-2">
                        {COVERAGE_ZONES_DISPLAY.map((zone) => (
                            <div key={zone.slug} className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <p className="text-sm font-display font-bold text-paninos-yellow">{zone.sede}</p>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {zone.destacados.join(' · ')}
                                    <span className="text-gray-700"> · y más...</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
