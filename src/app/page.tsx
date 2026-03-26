"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import ProductForm from "@/components/ProductForm";
import ProductTable from "@/components/ProductTable";
import Toast, { useToast } from "@/components/Toast";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  const fetchProducts = useCallback(async (targetPage = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${targetPage}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error("Error al cargar productos");
      const json = await res.json();
      setProducts(json.data);
      setPagination(json.pagination);
    } catch {
      addToast("No se pudieron cargar los productos", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [fetchProducts, page]);

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
    addToast(
      editingProduct ? "Producto actualizado" : "Producto creado",
      "success"
    );
    fetchProducts(page);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      addToast("Producto eliminado", "success");
      fetchProducts(page);
    } catch {
      addToast("No se pudo eliminar el producto", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Toast toasts={toasts} onRemove={removeToast} />

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
            onError={(msg) => addToast(msg, "error")}
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

          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-400 border-t-4 border-red-600">
              Cargando productos...
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onEdit={setEditingProduct}
              onDelete={handleDelete}
            />
          )}

          {/* Paginación */}
          {pagination && pagination.totalPages > 1 && !search.trim() && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Siguiente →
              </button>
            </div>
          )}

          {pagination && (
            <p className="text-center text-xs text-gray-400">
              Mostrando {filteredProducts.length} de {pagination.total} producto{pagination.total !== 1 && "s"}
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
        © {new Date().getFullYear()} Cruz Roja Colombiana — Sistema de Inventario
      </footer>
    </div>
  );
}
