import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio" })
    .min(1, "El nombre es obligatorio")
    .max(255, "El nombre no puede exceder 255 caracteres"),
  description: z
    .string()
    .max(5000, "La descripción no puede exceder 5000 caracteres")
    .nullable()
    .optional()
    .transform((val) => val || null),
  price: z
    .number({ error: "El precio debe ser un número" })
    .nonnegative("El precio no puede ser negativo")
    .max(99999999.99, "El precio excede el máximo permitido")
    .transform((val) => Math.round(val * 100) / 100),
  stock: z
    .number({ error: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .nonnegative("El stock no puede ser negativo")
    .default(0),
});

export const updateProductSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio" })
    .min(1, "El nombre es obligatorio")
    .max(255, "El nombre no puede exceder 255 caracteres")
    .optional(),
  description: z
    .string()
    .max(5000, "La descripción no puede exceder 5000 caracteres")
    .nullable()
    .optional()
    .transform((val) => (val === undefined ? undefined : val || null)),
  price: z
    .number({ error: "El precio debe ser un número" })
    .nonnegative("El precio no puede ser negativo")
    .max(99999999.99, "El precio excede el máximo permitido")
    .transform((val) => Math.round(val * 100) / 100)
    .optional(),
  stock: z
    .number({ error: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .nonnegative("El stock no puede ser negativo")
    .optional(),
}).refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: "Debe enviar al menos un campo para actualizar" }
);

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
