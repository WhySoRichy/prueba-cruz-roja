import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations";

const DEFAULT_PAGE_SIZE = 10;

// GET /api/products - Obtener productos con paginación
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE));

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count(),
  ]);

  return NextResponse.json({
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/products - Crear un producto
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido" },
      { status: 400 }
    );
  }

  const result = createProductSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return NextResponse.json(
      { error: "Datos inválidos", details: errors },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: result.data,
  });

  return NextResponse.json(product, { status: 201 });
}
