# Cruz Roja — Sistema de Inventario

Sistema CRUD full-stack para gestión de productos/inventario, desarrollado con **Next.js 16**, **Prisma ORM** y **MySQL**. Personalizado para Cruz Roja Colombiana.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Tailwind CSS 4, TypeScript |
| Backend | Next.js 16 App Router (Route Handlers) |
| ORM | Prisma 6 |
| Base de datos | MySQL 8 |

## Características

- **CRUD completo** — Crear, Leer, Actualizar y Eliminar productos
- **Validación** — Formulario con validación client-side y mensajes de error
- **Búsqueda en tiempo real** — Filtro por nombre, descripción o ID
- **Responsive** — Tabla en escritorio, tarjetas en móvil
- **API REST** — Endpoints con manejo de errores y códigos HTTP correctos (200, 201, 400, 404)
- **Singleton de Prisma** — Previene múltiples conexiones en desarrollo

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts          # GET all + POST
│   │       └── [id]/
│   │           └── route.ts      # GET one + PUT + DELETE
│   ├── page.tsx                  # Página principal (Client Component)
│   ├── layout.tsx                # Layout raíz con metadata
│   └── globals.css               # Estilos globales + Tailwind
├── components/
│   ├── ProductForm.tsx           # Formulario con validación
│   └── ProductTable.tsx          # Tabla responsive
└── lib/
    └── prisma.ts                 # Singleton PrismaClient
```

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Listar todos los productos |
| POST | `/api/products` | Crear producto |
| GET | `/api/products/:id` | Obtener un producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |

## Modelo de datos

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(255)
  description String?  @db.Text
  price       Float
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Instalación y ejecución

### Requisitos previos
- Node.js 18+
- MySQL 8+

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/prueba-cruz-roja.git
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

## Autor

**Ricardo Hernández Vega**

---

Desarrollado como prueba técnica para Cruz Roja Colombiana.
