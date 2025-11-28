"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { lmsApi, ProductKnowledge } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ArrowLeft,
  BookOpen,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import {
  Sheet,
  SheetTrigger,
  SheetTitle,
  SheetContent,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<ProductKnowledge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const pathname = usePathname();

  const menus = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Trainings", href: "/trainings" },
    { name: "Quizzes", href: "/quizzes" },
    { name: "Products", href: "/products" },
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    router.push("/");
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const loadProducts = async () => {
      try {
        const data = await lmsApi.getProductKnowledge();
        setProducts(data);
      } catch (error) {
        toast({
          title: "Error loading products",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [user, router, toast]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto"></div>

          <div className="p-6 border border-gray-200 rounded-2xl shadow-sm space-y-4">
            <div className="w-full h-40 bg-gray-200 rounded-xl"></div>

            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
            </div>

            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-md w-full"></div>
              <div className="h-3 bg-gray-200 rounded-md w-11/12"></div>
            </div>

            <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Drone Product Knowledge
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore detailed information about the latest drone technology and
            specifications
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="bg-[#f7f8fc] p-4 flex justify-center items-center">
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-36 h-36 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-5 space-y-2">
                <h3
                  className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px]"
                  dangerouslySetInnerHTML={{ __html: product.product_name }}
                />

                <p className="text-xs text-gray-500">Product Knowledge</p>

                <div className="border-t border-gray-100 my-3"></div>

                <div className="flex justify-between items-center gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Lihat Detail
                  </Link>

                  <a
                    href={product.pdf_download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md text-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Prev
            </button>

            <div className="flex gap-1 flex-wrap justify-center">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm rounded-md border transition
                      ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md text-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new product knowledge articles.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
