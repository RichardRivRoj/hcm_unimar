'use client';
import { usePathname } from 'next/navigation';

export default function PageTitle() {
  const pathname = usePathname();
  
  const getTitle = () => {
    switch (pathname) {
      case '/profile':
        return 'Perfil';
      default:
        return '';
    }
  };

  return (
    <div className="px-4 py-4 mb-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {pathname === '/profile' ? 'Datos generales del usuario' : 'Gestione y supervise los procesos de este módulo'}
      </p>
    </div>
  );
}