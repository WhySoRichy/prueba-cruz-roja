# Cruz Roja — Sistema de Inventario

Sistema CRUD full-stack para gestión de productos/inventario, desarrollado con **Next.js 16**, **Prisma ORM** y **MySQL**. Personalizado para Cruz Roja Colombiana.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Tailwind CSS 4, TypeScript |
| Backend | Next.js 16 App Router (Route Handlers) |
| ORM | Prisma 6 |
| Base de datos | MySQL 8 |
| Validación | Zod 4 |
| Testing | Vitest |

## Características

- **CRUD completo** — Crear, Leer, Actualizar y Eliminar productos
- **Validación robusta** — Schemas Zod server-side + validación client-side
- **Paginación** — API paginada con controles de navegación en el frontend
- **Búsqueda en tiempo real** — Filtro por nombre, descripción o ID
- **Responsive** — Tabla en escritorio, tarjetas en móvil
- **API REST** — Endpoints con manejo de errores y códigos HTTP correctos (200, 201, 400, 404)
- **Toast notifications** — Feedback visual para éxito y errores (sin `alert()`)
- **Precisión decimal** — Precios con `Decimal(10,2)` para evitar errores de punto flotante
- **Security headers** — HSTS, X-Frame-Options, CSP, Referrer-Policy
- **Tests** — Suite de 15 tests unitarios para validación de datos
- **Singleton de Prisma** — Previene múltiples conexiones en desarrollo

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts          # GET (paginado) + POST
│   │       └── [id]/
│   │           └── route.ts      # GET one + PUT + DELETE
│   ├── page.tsx                  # Página principal (Client Component)
│   ├── layout.tsx                # Layout raíz con metadata
│   └── globals.css               # Estilos globales + Tailwind
├── components/
│   ├── ProductForm.tsx           # Formulario con validación
│   ├── ProductTable.tsx          # Tabla responsive
│   └── Toast.tsx                 # Sistema de notificaciones
└── lib/
    ├── prisma.ts                 # Singleton PrismaClient
    └── validations.ts            # Schemas Zod (create + update)
tests/
└── validations.test.ts           # 15 tests unitarios
```

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products?page=1&limit=10` | Listar productos (paginado) |
| POST | `/api/products` | Crear producto (validado con Zod) |
| GET | `/api/products/:id` | Obtener un producto |
| PUT | `/api/products/:id` | Actualizar producto (validado con Zod) |
| DELETE | `/api/products/:id` | Eliminar producto |

## Modelo de datos

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(255)
  description String?  @db.Text
  price       Decimal  @db.Decimal(10, 2)
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([name])
}
```

## Instalación y ejecución

### Requisitos previos
- Node.js 18+
- MySQL 8+

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/WhySoRichy/prueba-cruz-roja.git
cd prueba-cruz-roja

# 2. Instalar dependencias
npm install

# 3. Crear base de datos en MySQL
mysql -u root -p -e "CREATE DATABASE crud_nextjs;"

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu contraseña de MySQL:
# DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/crud_nextjs"

# 5. Ejecutar migración
npx prisma migrate dev --name init

# 6. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Tests

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

## Autor

**Ricardo Hernández Vega**

---

Desarrollado como prueba técnica para Cruz Roja Colombiana.
