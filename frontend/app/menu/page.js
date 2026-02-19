import { Suspense } from 'react';
import Menu from '@/components/Menu';

export const metadata = {
    title: 'Menú · Paninos',
    description: 'Todos nuestros sándwiches disponibles para pedir.',
};

function MenuFallback() {
    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FFDE59] border-t-transparent" />
        </div>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={<MenuFallback />}>
            <Menu />
        </Suspense>
    );
}
