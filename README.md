```markdown
<div align="center">

# 🥕 FeriApp

### Plataforma web de gestión de inventarios y venta directa para las plazas de mercado de Bogotá

[![SENA](https://img.shields.io/badge/SENA-ADSO-39a900?style=for-the-badge)](https://www.sena.edu.co/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)

[🌐 Ver demo en vivo](https://gerson-hc.github.io/feriapp-page/) · [🐛 Reportar problema](../../issues) · [💡 Sugerir mejora](../../issues)

</div>

---

## 📖 Descripción

**FeriApp** es una plataforma web diseñada para digitalizar la operación de las plazas de mercado y ferias locales de Bogotá. Permite a los **feriantes** publicar y gestionar su inventario, y a los **compradores** explorar el catálogo, añadir productos al carrito y realizar pedidos de forma sencilla.

Este proyecto nace como parte del programa de formación **Análisis y Desarrollo de Software (ADSO)** del **SENA**, con el objetivo de aplicar los conocimientos de desarrollo frontend en una solución real con impacto social.

> 🎯 **Misión:** apoyar la economía local y a los pequeños productores, ofreciéndoles una vitrina digital accesible y moderna.

---

## ✨ Características principales

### 🛒 Para compradores
- Catálogo interactivo con tarjetas que giran al hacer clic
- Búsqueda en tiempo real por nombre de producto
- Filtros por categoría (frutas, flores, cárnicos, lácteos)
- Ordenamiento por nombre y precio (ascendente / descendente)
- Carrito de compras con persistencia en el navegador
- Sistema de pedidos y devoluciones
- Calificación de la plataforma

### 📦 Para vendedores
- Publicación de productos con imagen (convertida a base64)
- Gestión de precios en tiempo real
- Panel de opiniones y calificaciones de clientes
- Herramientas B2B (asesoría agrícola, logística, proveedores)

### ⚙️ Para administradores
- Dashboard con métricas (ventas totales, nota promedio, usuarios)
- Moderación de productos (banear del catálogo)
- Gestión de usuarios (activar / suspender)
- Visualización de reseñas de la app

### 🔐 Autenticación
- Registro con validación en tiempo real
- Validación de mayoría de edad
- Validación de correo (Gmail, Yahoo, Hotmail, Outlook, Live, Empresa)
- Redirección inteligente según el rol (comprador, vendedor, admin)
- Rutas protegidas y sesión persistente

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica de las páginas |
| **CSS3** | Diseño responsive, animaciones y tarjetas 3D |
| **JavaScript (ES6+)** | Lógica de la app, carrito, sesión y filtros |
| **LocalStorage** | Persistencia de datos en el navegador |
| **GitHub Pages** | Hosting y despliegue automático |

---

## 📁 Estructura del proyecto

```

feriapp-page/
│
├── index.html                # Catálogo principal (página de inicio)
├── README.md                 # Este archivo
│
├── css/                      # Hojas de estilo
│   ├── principal.css
│   └── autenticacion.css
│
├── js/                       # Lógica del cliente
│   ├── principal.js          # Núcleo: tienda, carrito y sesión
│   └── autenticacion.js      # Registro, login y validaciones
│
├── Imagenes/                 # Recursos gráficos
│
└── html/                     # Páginas secundarias
├── login.html
├── registro.html
├── recuperacion.html
├── carrito.html
├── perfil.html
├── pedidos.html
├── devoluciones.html
├── mis_productos.html
├── admin.html
├── asesoria.html
├── logistica.html
├── soporte.html
├── contacto.html
└── proveedores.html

```

---

## 🚀 Cómo ejecutar en local

### Opción 1: Descarga directa
1. Descarga el repositorio como ZIP
2. Descomprime la carpeta
3. Abre `index.html` con doble clic en tu navegador

### Opción 2: Clonar con Git
```bash
git clone https://github.com/Gerson-hc/feriapp-page.git
cd feriapp-page
# Abre index.html en tu navegador
```

Opción 3: Servidor local (recomendado)

```bash
# Con Python 3
python -m http.server 8000

# O con Node.js (si tienes live-server instalado)
npx live-server
```

Luego abre http://localhost:8000 en tu navegador.

---

🎨 Capturas de pantalla

<div align="center">

🏠 Página principal (catálogo)

Agrega aquí una captura de la página principal

🔐 Inicio de sesión

Agrega aquí una captura del login

🛒 Carrito de compras

Agrega aquí una captura del carrito

⚙️ Panel de administrador

Agrega aquí una captura del admin

</div>

💡 Tip: puedes subir capturas a la carpeta Imagenes/ y enlazarlas aquí.

---

🗺️ Roadmap

☑ Prototipo del frontend
☑ Catálogo interactivo con filtros
☑ Carrito y gestión de pedidos
☑ Autenticación demo con roles
☑ Panel de administrador
☐ Backend real (Node.js + Express)
☐ Base de datos (MongoDB / MySQL)
☐ Autenticación con JWT
☐ Pasarela de pagos
☐ Notificaciones en tiempo real
☐ PWA (Progressive Web App)
☐ App móvil

---

📚 Aprendizajes aplicados

· Manipulación del DOM sin frameworks
· Event delegation y manejo de eventos globales
· Persistencia de datos con localStorage
· Validación de formularios en tiempo real con expresiones regulares
· Arquitectura modular con IIFE y 'use strict'
· Diseño responsive mobile-first
· Protección de rutas según el rol del usuario
· Despliegue con GitHub Pages

---

🏛️ Arquitectura del sistema

📍 Prototipo actual (Fase 1 — Completada)

Aspecto Detalle
Frontend HTML5, CSS3, JavaScript vanilla (ES6+)
Persistencia localStorage del navegador
Despliegue GitHub Pages
Estado Prototipo funcional del frontend con datos simulados

Este repositorio contiene un prototipo del frontend que valida la interfaz y la experiencia de usuario. La implementación completa con backend, base de datos y autenticación segura corresponde a las siguientes fases del proyecto.

🎯 Arquitectura planeada (Fase 2 — Próxima)

Capa Tecnología
Frontend React.js
Backend Node.js + Express
Base de datos MySQL 8 (12 tablas normalizadas)
API REST
Autenticación JWT + hash de contraseñas con bcrypt
Mapa interactivo SVG con posición de locales
Despliegue Nube (accesible desde navegador)

📦 Módulos oficiales del sistema

· 🏪 Módulo de Productores: registro de productores, gestión de plazas y locales, mapa interactivo.
· 📦 Módulo de Inventarios: gestión de productos, existencias, precios y alertas de stock mínimo.
· 🛒 Módulo de Ventas: catálogo público, venta directa (cliente separa pedido y lo recoge en el local), calificación de productos y locales.

📊 Requerimientos y diseño

· 20 requerimientos funcionales (RF-01 a RF-20) organizados por módulo
· 7 requerimientos no funcionales clasificados según ISO 25010
· 19 historias de usuario con criterios de aceptación
· 15 casos de uso documentados en UML
· Modelo Entidad-Relación con 12 entidades
· Script SQL completo para MySQL 8

📄 Ver Documento de Especificación de Arquitectura para más detalle.

---

🤝 Contribuciones

Este es un proyecto formativo, pero cualquier sugerencia es bienvenida:

1. Haz un fork del proyecto
2. Crea una rama: git checkout -b feature/nueva-mejora
3. Commit: git commit -m 'Añadir nueva mejora'
4. Push: git push origin feature/nueva-mejora
5. Abre un Pull Request

---

👥 Equipo de desarrollo

Proyecto formativo del programa Tecnología en Análisis y Desarrollo de Software (ADSO) del SENA, Ficha 3478080.

Integrante Rol en Scrum Responsabilidades principales
Gerson H. C. Scrum Master Facilitar Scrum, promover la colaboración y eliminar impedimentos.
Heller Tobito Product Owner Comunicar la visión del producto y priorizar el Product Backlog.
Sergio González Developer Construir, implementar y verificar las funcionalidades del producto.

📅 Metodología

El proyecto se desarrolla con base en el marco de trabajo ágil Scrum, con entregas incrementales y revisión continua.

---

📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y compartirlo libremente dando el crédito correspondiente.

Consulta el archivo LICENSE para más detalles.

---

<div align="center">

🌱 Hecho con dedicación para las plazas de mercado de Bogotá 🇨🇴

Proyecto formativo SENA - ADSO 2026

⭐ ¡Dale una estrella si te gusta el proyecto! ⭐

</div>
```

---

📝 Pasos para aplicarlo

1️⃣ Abre el README en modo edición

https://github.com/Gerson-hc/feriapp-page/edit/main/README.md

2️⃣ Selecciona TODO y borra

Ctrl+A (o mantén presionado en el celular) y borra

3️⃣ Pega el README completo

Intenta pegar todo de una vez. Si se corta, avísame y te lo paso en 3 partes.

4️⃣ Verifica con "Preview"

· Debería verse con el título 🥕, badges, secciones y todo bonito

5️⃣ Commit changes

· Mensaje: Actualizar README con arquitectura y equipo

---

⚠️ Detalles importantes

📄 Sobre el enlace al PDF

El README menciona:

```
📄 Ver [Documento de Especificación de Arquitectura](docs/FeriApp_Arquitectura.pdf)
```

Si no has subido el PDF todavía, ese enlace dará 404. No pasa nada grave — el jurado verá el texto aunque el enlace falle. Cuando puedas, súbelo así:

1. Convierte tu .docx a PDF
2. En GitHub: Add file → Create new file
3. Escribe: docs/FeriApp_Arquitectura.pdf (creará la carpeta docs/)
4. Pon cualquier texto y commit
5. Luego reemplaza ese archivo subiendo el PDF real

📸 Sobre las capturas

Dejé la sección de capturas con placeholders. Cuando puedas:

1. Toma capturas de tu página
2. Súbelas a Imagenes/ como catalogo.png, login.png, carrito.png, admin.png
3. Reemplaza los textos *Agrega aquí...* por:
   ```markdown
   ![Catálogo principal](Imagenes/catalogo.png)
   ```

---