import { describe, it, expect } from "vitest";
import { createProductSchema, updateProductSchema } from "../src/lib/validations";

describe("createProductSchema", () => {
  it("valida un producto correcto", () => {
    const result = createProductSchema.safeParse({
      name: "Vendas estériles",
      description: "Paquete de 10 unidades",
      price: 15.5,
      stock: 100,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Vendas estériles");
      expect(result.data.price).toBe(15.5);
      expect(result.data.stock).toBe(100);
      expect(result.data.description).toBe("Paquete de 10 unidades");
    }
  });

  it("rechaza nombre vacío", () => {
    const result = createProductSchema.safeParse({
      name: "",
      price: 10,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre mayor a 255 caracteres", () => {
    const result = createProductSchema.safeParse({
      name: "A".repeat(256),
      price: 10,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza precio negativo", () => {
    const result = createProductSchema.safeParse({
      name: "Alcohol",
      price: -5,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza precio no numérico", () => {
    const result = createProductSchema.safeParse({
      name: "Alcohol",
      price: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza stock negativo", () => {
    const result = createProductSchema.safeParse({
      name: "Guantes",
      price: 5,
      stock: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza stock decimal", () => {
    const result = createProductSchema.safeParse({
      name: "Guantes",
      price: 5,
      stock: 2.5,
    });
    expect(result.success).toBe(false);
  });

  it("asigna stock por defecto en 0", () => {
    const result = createProductSchema.safeParse({
      name: "Jeringa",
      price: 3.2,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stock).toBe(0);
    }
  });

  it("convierte descripción vacía a null", () => {
    const result = createProductSchema.safeParse({
      name: "Jeringa",
      price: 3,
      description: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeNull();
    }
  });

  it("redondea precio a 2 decimales", () => {
    const result = createProductSchema.safeParse({
      name: "Termómetro",
      price: 9.999,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(10);
    }
  });

  it("rechaza precio excesivamente alto", () => {
    const result = createProductSchema.safeParse({
      name: "Equipo",
      price: 100000000,
    });
    expect(result.success).toBe(false);
  });
});

describe("updateProductSchema", () => {
  it("acepta actualización parcial con solo nombre", () => {
    const result = updateProductSchema.safeParse({ name: "Nuevo nombre" });
    expect(result.success).toBe(true);
  });

  it("acepta actualización parcial con solo precio", () => {
    const result = updateProductSchema.safeParse({ price: 25.99 });
    expect(result.success).toBe(true);
  });

  it("rechaza objeto vacío", () => {
    const result = updateProductSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rechaza campos inválidos en actualización", () => {
    const result = updateProductSchema.safeParse({ price: -100 });
    expect(result.success).toBe(false);
  });
});
