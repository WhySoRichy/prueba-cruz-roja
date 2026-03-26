"use client";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500 border-t-4 border-red-600">
        No hay productos registrados. ¡Crea el primero!
      </div>
    );
  }

  return (
    <>
      {/* Vista tabla — escritorio */}
      <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-red-600">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Precio</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Stock</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{product.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                  {product.description || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{product.stock}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista cards — móvil */}
      <div className="sm:hidden space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 border-t-4 border-red-600">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-400">ID #{product.id}</p>
              </div>
              <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            </div>
            {product.description && (
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Stock: {product.stock}</span>
              <div className="space-x-3">
                <button
                  onClick={() => onEdit(product)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
