import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/lib/validations";

function parseId(raw: string): number | null {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

// GET /api/products/[id] - Obtener un producto por ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

// PUT /api/products/[id] - Actualizar un producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const result = updateProductSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return NextResponse.json(
      { error: "Datos inválidos", details: errors },
      { status: 400 }
    );
  }

  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  const product = await prisma.product.update({
    where: { id },
    data: result.data,
  });

  return NextResponse.json(product);
}

// DELETE /api/products/[id] - Eliminar un producto
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ message: "Producto eliminado" });
}
