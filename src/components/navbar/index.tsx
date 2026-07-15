'use client'

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Bell,
  ChevronDown,
  User,
  BookOpen,
  Heart,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import ConfirmSignOutModal from "../confirm-signout-modal";

const navLinks = [
  { label: "Cours", href: "/courses" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.charAt(0).toUpperCase();
}

export default function Navbar() {
    const { user, isAuthenticated, loading } = useAuth();

  const [notifCount] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-shadow duration-200">
      {/* Promo banner */}
      <div className="bg-black text-gray-200 text-xs md:text-sm font-medium">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center">
          <span>
            🎓 Accès illimité à +500 cours — <span className="font-semibold underline decoration-2">Offre Été 2026</span>
          </span>
          <Link
            href="/offres"
            className="inline-flex items-center font-bold hover:opacity-90 transition-opacity ml-1 text-orange-500"
          >
            Commencer →
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center align-content-center mb-4 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg transition-transform active:scale-[0.98]">
          <Image
          src={'/images/EduSparkL.svg'}
          alt='Eduspark'
          width={120}
          height={60}
          />
        </Link>

        {/* Center nav links — Clean flex positioning instead of absolute */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground rounded-md transition-colors  hover:underline hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth zone */}
        <div className="flex items-center gap-2 sm:gap-4">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <button
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center hover:cursor-pointer justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Bell className="h-6 w-6" />
                {notifCount > 0 && (
                  <span className="absolute right-2.5 top-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                  </span>
                )}
              </button>
              
              <div className="hidden h-8 w-px bg-border sm:block" />

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1   transition-all hover:border-border hover:bg-muted/30 outline-none focus-visible:ring-2 focus-visible:ring-brand">
                  <Avatar className="h-10 w-10  border-2 border-orange-500">
                    <AvatarFallback className="bg-orange-50 text-xs font-semibold text-orange-800">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-foreground max-w-30 truncate lg:inline">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:inline transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-64 mt-2 p-1.5 shadow-lg rounded-xl">
                  <DropdownMenuLabel className="py-2.5 px-3">
                    <div className="text-sm font-semibold text-foreground">{user.name}</div>
                    <div className="truncate text-xs text-muted-foreground font-normal mt-0.5">
                      {user.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem className="cursor-pointer rounded-md py-2">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" /> Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-md py-2">
                    <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" /> Mes cours
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-md py-2">
                    <Heart className="mr-2 h-4 w-4 text-muted-foreground" /> Favoris
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutModal(true)} 
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-md py-2"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                
                className="hidden h-9 text-sm border border-orange-500 bg-white font-medium text-orange-500 hover:cursor-pointer hover:underline hover:bg-white sm:inline-flex"
              >
                <Link href={'/sign-in'}>Connexion</Link>
              </Button>
              <Button className="h-9 bg-orange-500 font-medium text-white hover:bg-orange-400 transition-colors  hover:cursor-pointer">
                 <Link href={'/sign-up'}>{"S'inscrire gratuitement"}</Link>
              </Button>
            </>
          )}

          {/* Mobile hamburger menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Ouvrir le menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-[320px] p-0 flex flex-col justify-between">
              <div>
                <SheetHeader className="border-b border-border px-6 py-4.5">
                  <SheetTitle className="flex items-center gap-2.5 text-left">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-bold tracking-tight">
                      Edu<span className="text-brand">Spark</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1 px-4 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center w-full rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile Auth Zone Footer */}
              <div className="border-t border-border p-4 bg-muted/20">
                {isAuthenticated && user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-2 py-1">
                      <Avatar className="h-9 w-9 border border-brand/10">
                        <AvatarFallback className="bg-brand text-xs font-semibold text-brand-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-foreground truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                       onClick={() => setShowLogoutModal(true)} 
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full h-10 font-medium">
                      Connexion
                    </Button>
                    <Button className="w-full h-10 bg-brand font-medium text-brand-foreground hover:bg-brand/90">
                      {"S'inscrire gratuitement"}
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ConfirmSignOutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} />
      
    </header>
  );
}