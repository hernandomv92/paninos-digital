'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Menu() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await api.get('menu/');

                // Filter products to only show Sandwiches (starting with "SAND")
                const filteredData = response.data.map(category => ({
                    ...category,
                    products: category.products.filter(product =>
                        product.name.toUpperCase().startsWith('SAND')
                    )
                })).filter(category => category.products.length > 0);

                setCategories(filteredData);
                setError(null);
            } catch (err) {
                console.error('Error fetching menu:', err);
                setError('No se pudo cargar el menú. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const handleAddToCart = (product) => {
        setCartCount(prev => prev + 1);
        // TODO: Implementar lógica de carrito completa
        console.log('Producto agregado:', product.name);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 font-medium">Cargando menú...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <p className="text-red-600 text-center">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Header */}
            <header className="sticky top-0 z-50 bg-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo/Brand */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Restobar</h1>
                                <p className="text-xs text-gray-500">Menú Digital</p>
                            </div>
                        </div>

                        {/* Cart Icon */}
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 pb-20">
                {categories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay productos disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {categories.map((category) => (
                            <section key={category.id}>
                                {/* Category Header */}
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-3">
                                        {category.name}
                                    </h2>
                                </div>

                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {category.products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                        >
                                            {/* Product Image */}
                                            <div className="relative w-full h-32 bg-gray-200 overflow-hidden">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                        <svg
                                                            className="w-12 h-12 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}

                                                {/* Stock Badge */}
                                                <div className="absolute top-2 left-2">
                                                    {product.is_available && product.stock > 0 ? (
                                                        <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                                            {product.stock} disp.
                                                        </div>
                                                    ) : (
                                                        <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                                            Agotado
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                                                    {product.name}
                                                </h3>

                                                {product.description && (
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                        {product.description}
                                                    </p>
                                                )}

                                                {/* Price and Add Button */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-2xl font-bold text-orange-600">
                                                            ${parseFloat(product.price).toLocaleString('es-CO')}
                                                        </span>
                                                        {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                                                            <span className="text-sm text-gray-400 line-through">
                                                                ${parseFloat(product.original_price).toLocaleString('es-CO')}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={!product.is_available}
                                                        className={`
                              w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                              transition-all duration-200 transform hover:scale-110
                              ${product.is_available
                                                                ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            }
                            `}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-4 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-gray-600">
                        Powered by <span className="font-semibold text-orange-600">Loggro Restobar POS</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}
