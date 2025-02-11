'use client'

import Link from 'next/link';
import { useAuth } from '@/hooks/auth';

const LoginLinks = () => {
  const { user } = useAuth({ middleware: 'guest' });

  return (
    <div className="flex items-center justify-between w-full px-4 py-4 bg-white dark:bg-gray-900">
      {/* Social Media Links */}
      <div className="flex justify-center flex-1 space-x-2">
        <Link href="#" className="flex items-center">
          <img
            src="/email.png"
            alt="Email"
            className="object-contain w-6 h-6"
          />
        </Link>
        <Link href="#" className="flex items-center">
          <img
            src="/facebook.png"
            alt="Facebook"
            className="object-contain w-6 h-6"
          />
        </Link>
        <Link href="#" className="flex items-center">
          <img
            src="/instagram.png"
            alt="Instagram"
            className="object-contain w-6 h-6"
          />
        </Link>
        <Link href="#" className="flex items-center">
          <img
            src="/youtube-03.png"
            alt="YouTube"
            className="object-contain w-6 h-6"
          />
        </Link>
        <Link href="#" className="flex items-center">
          <img
            src="/gorjeo.png"
            alt="Twitter"
            className="object-contain w-6 h-6"
          />
        </Link>
        <Link href="#" className="flex items-center">
          <img
            src="/linkedin.png"
            alt="LinkedIn"
            className="object-contain w-6 h-6"
          />
        </Link>
        <Link href="#" className="flex items-center">
          <img
            src="/bank-onlineb.png"
            alt="Bank"
            className="object-contain w-6 h-6"
          />
        </Link>
      </div>

      {/* User Login/Links */}
      <div className="text-right">
        {user ? (
          <Link
            href="/profile"
            className="ml-4 text-sm text-gray-700 underline dark:text-gray-300">
            {user?.email}
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-gray-700 underline dark:text-gray-300">
              Iniciar Sesión
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginLinks;
