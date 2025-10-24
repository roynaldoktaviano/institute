"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  BookOpen,
  ClipboardList,
  Package,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  user: {
    name: string;
    avatar_urls?: { [key: string]: string };
  };
  handleLogout: () => void;
    onCollapseChange?: (collapsed: boolean) => void;
}

const menus = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Trainings", href: "/trainings", icon: BookOpen },
  { name: "Quizzes", href: "/quizzes", icon: ClipboardList },
  { name: "Products", href: "/products", icon: Package },
];

export default function Sidebar({ user, handleLogout, onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex h-screen bg-[#31569A] text-white flex-col justify-between shadow-xl fixed top-0 left-0 z-50 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center border-b border-white/10 p-4">
          <Image
            src="/logo-test.png"
            width={isCollapsed ? 40 : 140}
            height={40}
            alt="Logo"
            className="transition-all"
          />
      <button
  onClick={() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState); // ✅ kirim ke parent
  }}
  className="absolute right-[-12px] top-1/2 -translate-y-1/2 bg-[#31569A] border border-white/20 p-1 rounded-full hover:bg-black top-[40vw] transition-all"
>
  {isCollapsed ? (
    <ChevronRight className="h-4 w-4" />
  ) : (
    <ChevronLeft className="h-4 w-4" />
  )}
</button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 space-y-1 px-2">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                  isActive
                    ? "bg-white text-[#31569A] font-semibold"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{menu.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-white/10 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={`flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-md p-2 transition-all ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <Avatar className="h-9 w-9 border border-white/20">
                  <AvatarImage src={user.avatar_urls?.["96"]} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-white/70">View profile</span>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>

            {/* FIX: Use Portal so dropdown tidak terpotong sidebar */}
            <DropdownMenuPortal>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white text-black rounded-md p-2"
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-[#31569A] text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetTitle className="hidden">Menu</SheetTitle>
          <SheetContent
            side="left"
            className="w-64 bg-[#31569A] text-white border-none"
          >
            <nav className="flex flex-col space-y-2 mt-8">
              {menus.map((menu) => {
                const Icon = menu.icon;
                const isActive = pathname === menu.href;
                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white text-[#31569A] font-semibold"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{menu.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User info + logout */}
            <div className="border-t border-white/10 mt-8 pt-4 px-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 border border-white/20">
                  <AvatarImage src={user.avatar_urls?.["96"]} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-white/70">View profile</p>
                </div>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left text-sm hover:bg-white/10 rounded-md px-3 py-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
