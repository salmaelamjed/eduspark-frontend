'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';

import ConfirmSignOutModal from '@/components/confirm-signout-modal'; 

export default function Navbar() {
  const { user, isAuthenticated, loading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.trim().split(/\s+/);
    return names.length >= 2
      ? (names[0][0] + names[1][0]).toUpperCase()
      : user.name.charAt(0).toUpperCase();
  };

  const authContent = loading ? (
    <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
  ) : isAuthenticated && user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="h-12 w-12 cursor-pointer border-2 border-orange-100 hover:border-orange-300 transition-all">
            <AvatarImage src={user.avatarUrl} alt={user.name || 'Profil'} />
            <AvatarFallback className="bg-orange-100 text-orange-800 font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/mes-cours" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Mes cours
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/saved" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favoris
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-700 cursor-pointer flex items-center gap-2"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        className="border-2 border-orange-500 text-orange-500 bg-transparent hover:bg-orange-50 hover:border-orange-600 px-6 py-6"
      >
        <Link href="/sign-in">Connexion</Link>
      </Button>
      <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-6">
        <Link href="/sign-up">Inscription</Link>
      </Button>
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm w-full">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Image
                  src="/images/EduSparkL.svg"
                  alt="EduSpark logo"
                  width={150}
                  height={150}
                  priority
                />
              </Link>
            </div>

            {/* Center links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/courses"
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
              >
                Cours
              </Link>
              <Link
                href="/about-us"
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
              >
                À propos
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Auth section */}
            <div className="hidden md:flex items-center gap-8">{authContent}</div>
          </div>
        </div>
      </nav>

      {/* Logout confirmation modal – always rendered, visibility controlled */}
      <ConfirmSignOutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} />
    </>
  );
}