"use client";

import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormProps {
  onSave: () => void;
  onError?: (message: string) => void;
  editingProduct: Product | null;
  onCancelEdit: () => void;
}

export default function ProductForm({
  onSave,
  onError,
  editingProduct,
  onCancelEdit,
}: ProductFormProps) {
  const [name, setName] = useState(editingProduct?.name || "");
  const [description, setDescription] = useState(
    editingProduct?.description || ""
  );
  const [price, setPrice] = useState(
    editingProduct?.price?.toString() || ""
  );
  const [stock, setStock] = useState(
    editingProduct?.stock?.toString() || "0"
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    if (name.trim().length > 255) newErrors.name = "Máximo 255 caracteres";
    if (!price || Number.isNaN(Number.parseFloat(price)) || Number.parseFloat(price) < 0)
      newErrors.price = "Ingresa un precio válido (≥ 0)";
    if (Number.parseFloat(price) > 99999999.99)
      newErrors.price = "El precio excede el máximo permitido";
    if (stock && (Number.isNaN(Number.parseInt(stock)) || Number.parseInt(stock) < 0))
      newErrors.stock = "El stock debe ser un número ≥ 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const data = { name: name.trim(), description: description.trim() || null, price: Number.parseFloat(price), stock: Number.parseInt(stock) || 0 };

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const res = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        const message = err.error || "Error al guardar";
        onError?.(message);
        setLoading(false);
        return;
      }
    } catch {
      onError?.("Error de conexión con el servidor");
      setLoading(false);
      return;
    }

    setName("");
    setDescription("");
    setPrice("");
    setStock("0");
    setErrors({});
    setLoading(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 border-t-4 border-red-600">
      <h2 className="text-xl font-bold text-gray-800">
        {editingProduct ? "Editar Producto" : "Nuevo Producto"}
      </h2>

      <div>
        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Nombre *</label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: "" })); }}
          className={`mt-1 w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">Precio *</label>
          <input
            id="product-price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => { setPrice(e.target.value); setErrors((prev) => ({ ...prev, price: "" })); }}
            className={`mt-1 w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.price ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            id="product-stock"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => { setStock(e.target.value); setErrors((prev) => ({ ...prev, stock: "" })); }}
            className={`mt-1 w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.stock ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock}</p>}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Guardando..." : editingProduct ? "Actualizar" : "Crear"}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
