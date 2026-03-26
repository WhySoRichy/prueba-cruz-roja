import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products - Obtener todos los productos
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

// POST /api/products - Crear un producto
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, price, stock } = body;

  if (!name || price === undefined) {
    return NextResponse.json(
      { error: "Nombre y precio son obligatorios" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      price: Number(price),
      stock: Number(stock) || 0,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
