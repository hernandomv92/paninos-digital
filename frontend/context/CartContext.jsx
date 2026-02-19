'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

// ─── Cart Actions ──────────────────────────────────────────────────────────────
const ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    SET_LOCATION: 'SET_LOCATION',
    SET_ORDER_TYPE: 'SET_ORDER_TYPE',
};

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
    items: [],              // [{ product, quantity }]
    location: null,         // { id, name, address, whatsapp }
    orderType: null,        // 'pickup' | 'delivery'
    deliveryAddress: null,  // string (solo para domicilio)
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
    switch (action.type) {
        case ACTIONS.ADD_ITEM: {
            const existingIndex = state.items.findIndex(
                (item) => item.product.id === action.payload.id
            );
            if (existingIndex >= 0) {
                // Ya existe: incrementar cantidad
                const updatedItems = [...state.items];
                updatedItems[existingIndex] = {
                    ...updatedItems[existingIndex],
                    quantity: updatedItems[existingIndex].quantity + 1,
                };
                return { ...state, items: updatedItems };
            }
            // Producto nuevo
            return {
                ...state,
                items: [...state.items, { product: action.payload, quantity: 1 }],
            };
        }

        case ACTIONS.REMOVE_ITEM:
            return {
                ...state,
                items: state.items.filter((item) => item.product.id !== action.payload),
            };

        case ACTIONS.UPDATE_QUANTITY: {
            const { productId, quantity } = action.payload;
            if (quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter((item) => item.product.id !== productId),
                };
            }
            return {
                ...state,
                items: state.items.map((item) =>
                    item.product.id === productId ? { ...item, quantity } : item
                ),
            };
        }

        case ACTIONS.CLEAR_CART:
            return { ...state, items: [] };

        case ACTIONS.SET_LOCATION:
            return { ...state, location: action.payload };

        case ACTIONS.SET_ORDER_TYPE:
            return { ...state, orderType: action.payload };

        default:
            return state;
    }
}

// ─── Context ───────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
        // Hidratación desde localStorage al montar
        if (typeof window === 'undefined') return initial;
        try {
            const saved = localStorage.getItem('paninos_cart');
            return saved ? JSON.parse(saved) : initial;
        } catch {
            return initial;
        }
    });

    // Persistir en localStorage cada vez que cambia el estado
    useEffect(() => {
        try {
            localStorage.setItem('paninos_cart', JSON.stringify(state));
        } catch {
            // localStorage no disponible (ej: modo privado con storage lleno)
        }
    }, [state]);

    // ─── Helpers ────────────────────────────────────────────────────────────────
    const addItem = (product) => dispatch({ type: ACTIONS.ADD_ITEM, payload: product });

    const removeItem = (productId) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: productId });

    const updateQuantity = (productId, quantity) =>
        dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { productId, quantity } });

    const clearCart = () => dispatch({ type: ACTIONS.CLEAR_CART });

    const setLocation = (location) => dispatch({ type: ACTIONS.SET_LOCATION, payload: location });

    const setOrderType = (type) => dispatch({ type: ACTIONS.SET_ORDER_TYPE, payload: type });

    // ─── Computed values ────────────────────────────────────────────────────────
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = state.items.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
    );

    const isInCart = (productId) => state.items.some((item) => item.product.id === productId);

    const getQuantity = (productId) => {
        const item = state.items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
    };

    return (
        <CartContext.Provider
            value={{
                // State
                items: state.items,
                location: state.location,
                orderType: state.orderType,
                deliveryAddress: state.deliveryAddress,
                // Computed
                totalItems,
                totalPrice,
                // Actions
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                setLocation,
                setOrderType,
                // Helpers
                isInCart,
                getQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
}
