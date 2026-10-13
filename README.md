<div align="center">

# 🥕 FeriApp

### Plataforma web para la gestión de inventarios y la venta directa en plazas de mercado de Bogotá, Colombia

[![SENA](https://img.shields.io/badge/SENA-ADSO-39A900?style=for-the-badge)](https://www.sena.edu.co/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)

[🌐 Ver demo en vivo](https://gerson-hc.github.io/feriapp-page/) · [📦 Repositorio](https://github.com/Gerson-hc/feriapp-page) · [🐛 Reportar problema](../../issues)

</div>

---

## 📌 Tabla de contenido

- [📖 Acerca del proyecto](#-acerca-del-proyecto)
- [🎯 Objetivos](#-objetivos)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologías](#️-tecnologías)
- [📁 Estructura del proyecto](#-estructura-del-proyecto)
- [🚀 Instalación y ejecución](#-instalación-y-ejecución)
- [🏛️ Arquitectura del sistema](#️-arquitectura-del-sistema)
- [🗺️ Estado del proyecto](#️-estado-del-proyecto)
- [🔄 Metodología de trabajo](#-metodología-de-trabajo)
- [👥 Equipo de desarrollo](#-equipo-de-desarrollo)
- [🎓 Contexto académico](#-contexto-académico)
- [🤝 Contribuciones](#-contribuciones)
- [📄 Licencia](#-licencia)

---

## 📖 Acerca del proyecto

Las plazas de mercado cumplen un papel importante en el abastecimiento de alimentos y la economía local. Sin embargo, algunos comerciantes todavía gestionan sus productos, inventarios y registros de ventas mediante herramientas tradicionales, como cuadernos y documentos digitales.

**FeriApp** busca explorar una alternativa digital que permita organizar esta información y mejorar la experiencia de compra y venta, conectando a vendedores y compradores mediante una plataforma web.

El proyecto se desarrolla como parte del proceso de formación en **Análisis y Desarrollo de Software (ADSO)** del **Servicio Nacional de Aprendizaje (SENA)**.

---

## 🎯 Objetivos

- Facilitar la consulta de productos disponibles.
- Explorar herramientas digitales para la gestión de inventarios.
- Organizar la información relacionada con productos y ventas.
- Diseñar una experiencia de usuario clara e intuitiva.
- Aplicar conocimientos de programación, bases de datos y desarrollo web.
- Trabajar colaborativamente mediante una metodología ágil.

---

## ✨ Funcionalidades

El prototipo contempla los siguientes módulos:

| Módulo | Descripción |
|---|---|
| 🛍️ **Catálogo de productos** | Presentación y consulta de productos disponibles. |
| 🔍 **Búsqueda y filtros** | Exploración de productos por categorías. |
| 📊 **Ordenamiento** | Organización de productos según criterios disponibles. |
| 🛒 **Carrito de compras** | Interacción con los productos seleccionados. |
| 👤 **Usuarios y perfiles** | Interfaces relacionadas con las cuentas de usuario. |
| 📦 **Pedidos y devoluciones** | Módulos para consultar y organizar estos procesos. |
| 📦 **Gestión de vendedores** | Interfaces orientadas a la administración de productos. |
| ⚙️ **Administración** | Interfaz destinada a funciones administrativas. |

> 💡 **Nota:** La disponibilidad y el funcionamiento de cada característica dependen de la implementación actual del prototipo. Los módulos visuales no implican necesariamente que exista un backend o una base de datos conectada.

---

## 🛠️ Tecnologías

### Implementadas en el prototipo

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura de las páginas web. |
| **CSS3** | Estilos, diseño visual y animaciones. |
| **JavaScript (ES6+)** | Interactividad y lógica del frontend. |
| **LocalStorage** | Persistencia local de datos en el navegador. |
| **Git y GitHub** | Control de versiones y alojamiento del código. |
| **GitHub Pages** | Publicación de la página web. |

### Tecnologías consideradas para futuras fases

| Tecnología | Propósito |
|---|---|
| **React** | Desarrollo de una interfaz basada en componentes. |
| **Node.js** | Entorno de ejecución para el servidor. |
| **Express** | Construcción de una API REST. |
| **MySQL 8** | Gestión de una base de datos relacional. |
| **JWT y bcrypt** | Autenticación y protección de credenciales. |

> ⚠️ Estas tecnologías futuras representan una propuesta de evolución y no deben interpretarse como funcionalidades ya implementadas.

---

## 📁 Estructura del proyecto

```

feriapp-page/
├── index.html
├── README.md
├── LICENSE
├── css/
│   ├── principal.css
│   └── autenticacion.css
├── js/
│   ├── principal.js
│   └── autenticacion.js
├── Imagenes/
└── html/
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

> 📝 Esta estructura es orientativa. Los nombres y las rutas deben coincidir con los archivos que realmente existen en el repositorio.

---

## 🚀 Instalación y ejecución

Puedes explorar el proyecto directamente desde GitHub Pages o ejecutarlo localmente.

### Opción 1. Desde la página web

Visita:

```

https://gerson-hc.github.io/feriapp-page/

```

### Opción 2. En un computador

**1. Clona el repositorio:**

```bash
git clone https://github.com/Gerson-hc/feriapp-page.git
```

2. Entra en la carpeta:

```bash
cd feriapp-page
```

3. Abre index.html en el navegador.

También puedes utilizar la extensión Live Server de Visual Studio Code para ejecutar el frontend durante el desarrollo.

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
· 🛒 Módulo de Ventas: catálogo público, venta directa y calificación de productos y locales.

📊 Requerimientos y diseño

· 20 requerimientos funcionales (RF-01 a RF-20) organizados por módulo.
· 7 requerimientos no funcionales clasificados según ISO 25010.
· 19 historias de usuario con criterios de aceptación.
· 15 casos de uso documentados en UML.
· Modelo Entidad-Relación con 12 entidades.
· Script SQL completo para MySQL 8.

📄 Ver Documento de Especificación de Arquitectura para más detalle.

---

🗺️ Estado del proyecto

Etapa actual: prototipo frontend y desarrollo formativo.

El proyecto está orientado a construir una solución digital para la gestión de productos e inventarios en plazas de mercado.

Próximos pasos propuestos

☐ Revisar y mejorar la interfaz de usuario.
☐ Validar los flujos principales de navegación.
☐ Mejorar las validaciones de formularios.
☐ Completar las pruebas funcionales.
☐ Consolidar los requerimientos del sistema.
☐ Diseñar e implementar una API REST.
☐ Integrar una base de datos relacional.
☐ Implementar autenticación segura.
☐ Realizar pruebas de integración y seguridad.

📝 La lista representa tareas propuestas; su estado debe actualizarse conforme avance el desarrollo.

---

🔄 Metodología de trabajo

El equipo utiliza el marco de trabajo ágil Scrum como referencia para organizar las actividades, priorizar funcionalidades y hacer seguimiento al desarrollo.

Entre sus prácticas se encuentran:

· Organización y priorización del trabajo.
· Definición de historias de usuario.
· Seguimiento de tareas.
· Revisión de avances.
· Identificación de oportunidades de mejora.

---

👥 Equipo de desarrollo

Integrante Rol en Scrum
Gerson H. C. Scrum Master
Heller Tobito Product Owner
Sergio González Developer

📝 Los roles corresponden a la organización del equipo para el proyecto formativo.

---

🎓 Contexto académico

· Institución: Servicio Nacional de Aprendizaje (SENA).
· Programa: Tecnología en Análisis y Desarrollo de Software (ADSO).
· Ficha: 3478080.
· Tipo de proyecto: proyecto formativo.

---

🤝 Contribuciones

Las sugerencias y propuestas de mejora son bienvenidas.

1. Realiza un fork del repositorio.
2. Crea una rama para tu contribución:

```bash
git checkout -b feature/nueva-mejora
```

3. Implementa y prueba tus cambios.
4. Registra las modificaciones:

```bash
git add .
git commit -m "feat: añadir nueva funcionalidad"
```

5. Publica tu rama:

```bash
git push origin feature/nueva-mejora
```

6. Abre un Pull Request explicando los cambios realizados.

También puedes reportar errores o proponer mejoras en la sección Issues.

---

📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y compartirlo libremente dando el crédito correspondiente.

Consulta el archivo LICENSE para más detalles.

---

<div align="center">

🌱 Hecho con dedicación para las plazas de mercado de Bogotá 🇨🇴

Proyecto formativo SENA - ADSO - Ficha 3478080

⭐ ¡Dale una estrella si te gusta el proyecto! ⭐

</div>
```