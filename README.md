🥕 FeriApp

Plataforma web para la gestión de productos y la venta directa en plazas de mercado

<p align="center">
  <img src="https://img.shields.io/badge/SENA-ADSO-39a900?style=for-the-badge" alt="SENA ADSO">
  <img src="https://img.shields.io/badge/Metodología-Scrum-6C5CE7?style=for-the-badge" alt="Scrum">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p><p align="center">
  <a href="https://gerson-hc.github.io/feriapp-page/">🌐 Ver demo</a> ·
  <a href="../../issues">🐛 Reportar un problema</a> ·
  <a href="../../issues">💡 Proponer una mejora</a>
</p>---

📖 1. Descripción del proyecto

FeriApp es un proyecto de desarrollo web orientado a la digitalización del comercio en las plazas de mercado y ferias locales. Su propósito es facilitar la interacción entre vendedores y compradores mediante una plataforma digital en la que se puedan explorar productos, consultar precios y acceder a diferentes herramientas para la gestión comercial.

El proyecto se desarrolla en el marco del programa de formación Tecnología en Análisis y Desarrollo de Software (ADSO) del Servicio Nacional de Aprendizaje (SENA), aplicando conocimientos de programación web, diseño de interfaces y desarrollo frontend.

🎯 Objetivo general

Desarrollar una plataforma web que contribuya a la digitalización del comercio en las plazas de mercado, facilitando la presentación de productos y la interacción entre vendedores y compradores.

🌱 Propósito

Promover el uso de herramientas digitales para apoyar a pequeños comerciantes y productores, ampliar la visibilidad de sus productos y explorar nuevas oportunidades de comercialización.

---

✨ 2. Funcionalidades principales

🛒 Módulo de compradores

- Visualización del catálogo de productos.
- Búsqueda de productos por nombre.
- Filtrado por categorías.
- Ordenamiento por nombre y precio.
- Carrito de compras.
- Interfaces para consultar pedidos y gestionar devoluciones.
- Sistema de calificación de la plataforma.

📦 Módulo de vendedores

- Interfaces para publicar y gestionar productos.
- Gestión de información y precios.
- Incorporación de imágenes de productos.
- Visualización de opiniones y calificaciones.
- Secciones informativas sobre asesoría agrícola, logística y proveedores.

⚙️ Módulo de administración

- Panel administrativo con indicadores generales.
- Interfaz de moderación de productos.
- Gestión de usuarios y estados de las cuentas.
- Visualización de reseñas de la plataforma.

🔐 Registro e inicio de sesión

- Formularios de registro e inicio de sesión.
- Validación de campos y formatos de correo electrónico.
- Validación de edad durante el registro.
- Navegación según los roles de usuario.
- Gestión de sesión en el navegador.

«Estado técnico: FeriApp cuenta con un frontend web publicado mediante GitHub Pages. La disponibilidad de las interfaces no implica que todas las operaciones estén conectadas a un backend. La autenticación segura, la sincronización de datos entre usuarios y el procesamiento de pagos requieren servicios adicionales para un entorno de producción.»

---

🛠️ 3. Tecnologías utilizadas

Tecnología| Aplicación
HTML5| Estructura y contenido de las páginas.
CSS3| Estilos, diseño adaptable y animaciones.
JavaScript (ES6+)| Lógica e interactividad del frontend.
DOM API| Manipulación dinámica de la interfaz.
LocalStorage| Persistencia local de datos en el navegador.
Git| Control de versiones.
GitHub| Alojamiento del código y colaboración.
GitHub Pages| Despliegue de la aplicación web estática.

---

🔄 4. Metodología de trabajo: Scrum

El equipo utiliza como referencia el marco de trabajo ágil Scrum, orientado a la colaboración, la entrega incremental de valor, la transparencia y la mejora continua.

👥 Organización del equipo Scrum

Integrante| Rol| Responsabilidades
Gerson H. C.| Scrum Master| Facilitar Scrum, promover la colaboración, ayudar a eliminar impedimentos y fomentar la mejora continua.
Heller Tobito| Product Owner| Comunicar la visión del producto, priorizar el Product Backlog y procurar que el desarrollo genere valor para los usuarios.
Sergio Gonzales| Developer| Participar en la construcción, implementación, verificación y mejora de las funcionalidades del producto.

📌 Responsabilidades de cada rol

Scrum Master — Gerson H. C.

- Promover la comprensión y aplicación de Scrum.
- Facilitar los eventos de Scrum cuando corresponda.
- Ayudar a identificar y eliminar impedimentos.
- Fomentar la comunicación y la mejora continua del equipo.

Product Owner — Heller Tobito

- Definir y comunicar los objetivos del producto.
- Gestionar y ordenar el Product Backlog.
- Priorizar las funcionalidades según su valor.
- Mantener claros los objetivos y las necesidades de los usuarios.

Developer — Sergio Gonzales

- Contribuir al desarrollo del producto.
- Implementar y verificar funcionalidades.
- Colaborar con los demás integrantes.
- Procurar que el resultado cumpla los criterios de calidad acordados.

Los roles representan la organización acordada por el equipo. En Scrum, los Developers pueden ser una o varias personas, y todos los integrantes colaboran para alcanzar los objetivos del producto.

---

📁 5. Estructura del proyecto

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

Esta estructura es orientativa y debe verificarse frente a los archivos reales del repositorio.

---

🚀 6. Instalación y ejecución local

Requisitos

- Un navegador web actualizado.
- Git para clonar el repositorio.
- Python 3 para ejecutar un servidor local, si se desea.

Opción 1. Descargar el proyecto

1. Abre el "repositorio de FeriApp" (https://github.com/Gerson-hc/feriapp-page).
2. Selecciona Code → Download ZIP.
3. Descomprime el archivo.
4. Abre "index.html" en tu navegador.

Opción 2. Clonar con Git

Ejecuta los siguientes comandos en una terminal:

git clone https://github.com/Gerson-hc/feriapp-page.git
cd feriapp-page

Opción 3. Ejecutar un servidor local

Desde la carpeta raíz del proyecto, ejecuta:

python3 -m http.server 8000

Luego abre:

http://localhost:8000

El servidor local permite probar la aplicación y detectar posibles problemas de rutas o carga de recursos.

---

🖼️ 7. Capturas de pantalla

Las capturas permiten mostrar el diseño y las principales interfaces de FeriApp.

Vista| Archivo sugerido
Catálogo principal| "Imagenes/catalogo.png"
Inicio de sesión| "Imagenes/login.png"
Carrito de compras| "Imagenes/carrito.png"
Panel de administración| "Imagenes/admin.png"

Cuando las imágenes estén disponibles en el repositorio, puedes incorporarlas con Markdown:

![Catálogo principal de FeriApp](Imagenes/catalogo.png)

Utiliza capturas reales de la aplicación y verifica que las rutas y los nombres de los archivos coincidan.

---

🗺️ 8. Roadmap

Desarrollo del frontend

- [x] Estructura inicial de la aplicación web.
- [x] Catálogo interactivo con búsqueda y filtros.
- [x] Interfaz del carrito de compras.
- [x] Interfaces de registro e inicio de sesión.
- [x] Panel administrativo inicial.

Mejoras futuras

- [ ] Implementar un backend y una API.
- [ ] Integrar una base de datos.
- [ ] Implementar autenticación segura y autorización por roles.
- [ ] Centralizar la gestión de productos, usuarios y pedidos.
- [ ] Integrar una pasarela de pagos.
- [ ] Incorporar notificaciones en tiempo real.
- [ ] Evaluar una Progressive Web App (PWA).
- [ ] Evaluar el desarrollo de una aplicación móvil.

Las casillas deben actualizarse según el progreso real del proyecto y la verificación de cada funcionalidad.

---

🧠 9. Aprendizajes y competencias

El desarrollo de FeriApp permite aplicar y fortalecer conocimientos en:

- Estructuración de páginas con HTML5.
- Diseño de interfaces mediante CSS3.
- Programación frontend con JavaScript.
- Manipulación del DOM y gestión de eventos.
- Validación de formularios.
- Persistencia local con "localStorage".
- Organización y separación de responsabilidades del código.
- Control de versiones con Git y GitHub.
- Publicación de sitios estáticos con GitHub Pages.
- Colaboración y organización del trabajo mediante Scrum.

---

🤝 10. Contribuciones

Las sugerencias y propuestas de mejora son bienvenidas.

1. Realiza un fork del repositorio.

2. Crea una rama para tu contribución:
   
   git checkout -b feature/nueva-mejora

3. Implementa y prueba tus cambios.

4. Registra las modificaciones:
   
   git add .
git commit -m "feat: añadir nueva funcionalidad"

5. Publica tu rama:
   
   git push origin feature/nueva-mejora

6. Abre un Pull Request explicando los cambios realizados.

También puedes reportar errores o proponer mejoras en la sección "Issues" (../../issues).

---

👥 11. Equipo de desarrollo

FeriApp es un proyecto colaborativo desarrollado en el marco del programa de formación Tecnología en Análisis y Desarrollo de Software (ADSO) del SENA.

Integrante| Rol en Scrum
Gerson H. C.| Scrum Master
Heller Tobito| Product Owner
Sergio Gonzales| Developer

Enlaces del proyecto

- Repositorio: "Gerson-hc/feriapp-page" (https://github.com/Gerson-hc/feriapp-page)
- Demo: "FeriApp en GitHub Pages" (https://gerson-hc.github.io/feriapp-page/)

---

📄 12. Licencia

El proyecto declara utilizar la licencia MIT. Consulta el archivo ""LICENSE"" (LICENSE) para verificar sus términos y condiciones.

---

<p align="center">
  🥕 <strong>FeriApp</strong><br>
  Tecnología al servicio del comercio local colombiano 🇨🇴<br><br>
  Proyecto formativo · SENA · ADSO · 2026
</p>