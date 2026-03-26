"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import ProductForm from "@/components/ProductForm";
import ProductTable from "@/components/ProductTable";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProducts(data);
    } catch {
      console.error("No se pudieron cargar los productos");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.id.toString() === q
    );
  }, [products, search]);

  const handleSave = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      fetchProducts();
    } catch {
      alert("No se pudo eliminar el producto");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Cruz Roja */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <rect x="16" y="4" width="8" height="32" rx="1" fill="#DC2626" />
                <rect x="4" y="16" width="32" height="8" rx="1" fill="#DC2626" />
              </svg>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Cruz Roja — Inventario
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Sistema de gestión de productos | Next.js + Prisma + MySQL
            </p>
          </div>

          <ProductForm
            key={editingProduct?.id ?? "new"}
            onSave={handleSave}
            editingProduct={editingProduct}
            onCancelEdit={() => setEditingProduct(null)}
          />

          {/* Buscador */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <ProductTable
            products={filteredProducts}
            onEdit={setEditingProduct}
            onDelete={handleDelete}
          />

          {filteredProducts.length > 0 && (
            <p className="text-center text-xs text-gray-400">
              Mostrando {filteredProducts.length} de {products.length} producto{products.length !== 1 && "s"}
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
        © {new Date().getFullYear()} Ricardo Hernández Vega — Cruz Roja Colombiana
      </footer>
    </div>
  );
}
