# MetalForma CNC

## Propósito

MetalForma CNC es un sitio web para mostrar proyectos de fabricación y mecanizado CNC, permitir el registro de clientes y recibir solicitudes de presupuestos.

El administrador puede gestionar los proyectos desde un panel privado servido directamente por Express.

## Tecnologías utilizadas

- React
- React Router
- Node.js
- Express
- Handlebars
- MySQL
- PHPMyAdmin
- Express Session  
- Bcrypt

## Aplicaciones externas

### Cloudinary

Se utiliza para almacenar las imágenes nuevas de los proyectos.

El administrador selecciona una imagen desde su computadora, Express la envía a Cloudinary y la URL resultante se guarda en MySQL.

### Resend

Se utiliza para enviar por correo las solicitudes de presupuesto realizadas por los clientes.

## Estructura del proyecto

```text
transportes/
├── frontend/       → aplicación React
├── backend/        → servidor Node y Express
├── database/
│   └── proyecto.sql → script de la base de datos
└── README.md       → documentación del proyecto
```

## Comunicación entre frontend y backend

El frontend React se comunica con el backend Express mediante una API.

React utiliza solicitudes HTTP para enviar y recibir información en formato JSON.

Algunos ejemplos de rutas de la API son:

```text
POST /api/usuarios/registro
POST /api/usuarios/login
GET  /api/usuarios/sesion
GET  /api/admin/novedades
POST /api/solicitudes
GET  /api/solicitudes/mis-solicitudes
```

El frontend no se conecta directamente con MySQL. Todas las operaciones pasan primero por Express.

El login y el panel del administrador funcionan exclusivamente en el backend:

```text
http://localhost:3001/admin/login
```

## Instalación

### 1. Instalar las dependencias del backend

```powershell
cd backend
npm install
```

### 2. Instalar las dependencias del frontend

En otra terminal:

```powershell
cd frontend
npm install
```

### 3. Configurar la base de datos

1. Iniciar MySQL.
2. Abrir PHPMyAdmin.
3. Crear una base de datos llamada:

```text
metalforma_cnc
```

4. Importar el archivo:

```text
database/proyecto.sql
```

### 4. Configurar las variables de entorno

Crear o completar el archivo:

```text
backend/.env
```

Debe contener las credenciales de MySQL, Cloudinary y Resend.

Las claves privadas no deben publicarse ni colocarse en el frontend.

### 5. Ejecutar el backend

```powershell
cd backend
npm start
```

El backend se ejecuta en:

```text
http://localhost:3001
```

### 6. Ejecutar el frontend

En otra terminal:

```powershell
cd frontend
npm start
```

El frontend se ejecuta en:

```text
http://localhost:3002
```

## Accesos principales

Sitio público:

```text
http://localhost:3002
```

Registro de clientes:

```text
http://localhost:3002/registro
```

Login de clientes:

```text
http://localhost:3002/login-usuario
```

Login del administrador:

```text
http://localhost:3001/admin/login
```