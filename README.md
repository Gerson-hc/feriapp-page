🥕 FeriApp

Plataforma web para la gestión de inventarios y la venta directa en plazas de mercado de Bogotá

<div align="center">""SENA" (https://img.shields.io/badge/SENA-ADSO-39a900?style=for-the-badge)" (https://www.sena.edu.co/)
""HTML5" (https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)" (https://developer.mozilla.org/es/docs/Web/HTML)
""CSS3" (https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)" (https://developer.mozilla.org/es/docs/Web/CSS)
""JavaScript" (https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)" (https://developer.mozilla.org/es/docs/Web/JavaScript)
""GitHub Pages" (https://img.shields.io/badge/Despliegue-GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)" (https://pages.github.com/)

"🌐 Ver demo en vivo" (https://gerson-hc.github.io/feriapp-page/) · "🐛 Reportar un problema" (../../issues) · "💡 Proponer una mejora" (../../issues)

</div>---

📖 1. Descripción del proyecto

FeriApp es una plataforma web orientada a la digitalización del comercio en las plazas de mercado de Bogotá. Su propósito es facilitar la gestión de productos y la conexión entre productores, comerciantes y compradores mediante herramientas digitales para consultar inventarios, visualizar precios y realizar pedidos.

El proyecto se desarrolla en el marco del programa Tecnología en Análisis y Desarrollo de Software (ADSO) del Servicio Nacional de Aprendizaje (SENA), como una iniciativa formativa que busca aplicar conocimientos de desarrollo de software a una necesidad del comercio local.

🎯 Objetivo general

Desarrollar una plataforma web que facilite la gestión de inventarios y la venta directa de productos en las plazas de mercado, mejorando su visibilidad digital y la interacción entre comerciantes y compradores.

🌱 Propósito

Contribuir a la modernización del comercio local mediante herramientas digitales accesibles que permitan organizar la información de los productos y explorar nuevas oportunidades de comercialización.

---

✨ 2. Funcionalidades principales

🏪 Gestión de productores y locales

- Interfaces para el registro y la gestión de productores.
- Organización de la información de plazas y locales.
- Propuesta de mapa interactivo para localizar establecimientos.

📦 Gestión de inventarios

- Publicación y administración de productos.
- Consulta de precios y existencias.
- Incorporación de imágenes de productos.
- Propuesta de alertas para niveles mínimos de inventario.

🛒 Ventas y compradores

- Catálogo interactivo de productos.
- Búsqueda por nombre y filtros por categoría.
- Ordenamiento por nombre y precio.
- Carrito de compras.
- Interfaces para la gestión de pedidos y devoluciones.
- Calificaciones y opiniones.

⚙️ Administración

- Panel administrativo con indicadores.
- Interfaces para moderar productos.
- Gestión de usuarios y estados de las cuentas.
- Visualización de reseñas de la plataforma.

🔐 Autenticación y gestión de usuarios

- Formularios de registro e inicio de sesión.
- Validación de campos y formatos de correo electrónico.
- Validación de edad durante el registro.
- Navegación según los roles de usuario.
- Gestión de sesiones en el navegador.

«Estado actual: el repositorio contiene un prototipo frontend desplegado en GitHub Pages. Las funcionalidades que dependen de un servidor, una base de datos compartida o autenticación segura requieren la implementación de la arquitectura backend. La existencia de una interfaz no implica que todos los procesos estén conectados o funcionen en producción.»

---

🛠️ 3. Tecnologías utilizadas

Implementación actual

Tecnología| Uso
HTML5| Estructura de las páginas web.
CSS3| Diseño adaptable, estilos y animaciones.
JavaScript ES6+| Lógica e interactividad del frontend.
DOM API| Manipulación dinámica de la interfaz.
LocalStorage| Persistencia local de información en el navegador.
Git| Control de versiones.
GitHub| Alojamiento y colaboración en el código.
GitHub Pages| Publicación de la aplicación web estática.

Tecnologías previstas para futuras fases

Tecnología| Propósito
React.js| Construcción de una interfaz frontend basada en componentes.
Node.js| Entorno de ejecución para el backend.
Express.js| Desarrollo de la API REST.
MySQL 8| Almacenamiento estructurado de datos.
JWT| Gestión de tokens de autenticación.
bcrypt| Hash de contraseñas.
SVG| Posible implementación del mapa interactivo.

Las tecnologías previstas no deben interpretarse como implementadas hasta que exista código funcional que las utilice.

---

📁 4. Estructura del proyecto

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

🚀 5. Instalación y ejecución local

Requisitos

- Navegador web actualizado.
- Git, para clonar el repositorio.
- Python 3, para ejecutar un servidor local.

Opción 1. Descargar el proyecto

1. Ingresa al "repositorio de FeriApp" (https://github.com/Gerson-hc/feriapp-page).
2. Selecciona Code → Download ZIP.
3. Descomprime el archivo.
4. Abre "index.html" en el navegador.

Opción 2. Clonar con Git

git clone https://github.com/Gerson-hc/feriapp-page.git
cd feriapp-page

Opción 3. Iniciar un servidor local

Desde la carpeta raíz del proyecto, ejecuta:

python3 -m http.server 8000

Después, abre la siguiente dirección en tu navegador:

http://localhost:8000

También puedes utilizar "npx live-server" si tienes Node.js instalado y deseas ejecutar un servidor de desarrollo compatible.

---

🖼️ 6. Capturas de pantalla

Las capturas de pantalla permiten visualizar la interfaz y las principales funcionalidades del proyecto.

Vista| Archivo sugerido
Catálogo principal| "Imagenes/catalogo.png"
Inicio de sesión| "Imagenes/login.png"
Carrito de compras| "Imagenes/carrito.png"
Panel administrativo| "Imagenes/admin.png"

Para mostrar una captura, agrega el archivo correspondiente al repositorio y utiliza una ruta relativa:

![Catálogo principal de FeriApp](Imagenes/catalogo.png)

Reemplaza los nombres sugeridos por las rutas de las capturas reales.

---

🗺️ 7. Roadmap

Fase 1. Prototipo frontend

- [x] Estructura inicial de la aplicación.
- [x] Catálogo interactivo con filtros.
- [x] Interfaz del carrito de compras.
- [x] Interfaces de registro e inicio de sesión.
- [x] Panel administrativo inicial.

Fase 2. Backend y persistencia

- [ ] Diseñar e implementar la API REST.
- [ ] Configurar el backend con Node.js y Express.
- [ ] Integrar la base de datos MySQL.
- [ ] Centralizar la gestión de productos, usuarios e inventarios.
- [ ] Implementar la gestión de pedidos.
- [ ] Implementar autenticación segura y autorización por roles.

Fase 3. Funcionalidades avanzadas

- [ ] Implementar el mapa interactivo de plazas y locales.
- [ ] Incorporar alertas de inventario.
- [ ] Evaluar una pasarela de pagos.
- [ ] Implementar notificaciones en tiempo real.
- [ ] Evaluar una Progressive Web App (PWA).
- [ ] Evaluar el desarrollo de una aplicación móvil.

El estado de cada tarea debe actualizarse según el avance real del equipo. Las casillas marcadas como completadas corresponden al alcance declarado del prototipo y deben verificarse en el código.

---

🏛️ 8. Arquitectura del sistema

Fase 1. Prototipo actual

Componente| Implementación
Frontend| HTML5, CSS3 y JavaScript ES6+
Persistencia| LocalStorage del navegador
Despliegue| GitHub Pages
Estado| Prototipo frontend con persistencia local y datos de demostración, según la funcionalidad implementada

El objetivo de esta fase es construir y evaluar la interfaz, la navegación y la experiencia de usuario antes de implementar los servicios backend.

Fase 2. Arquitectura propuesta

Capa| Tecnología o componente
Presentación| React.js
Backend| Node.js y Express.js
Comunicación| API REST
Base de datos| MySQL 8
Autenticación| JWT
Seguridad de contraseñas| bcrypt
Mapa interactivo| SVG
Despliegue| Servicio de alojamiento compatible con frontend y backend

La arquitectura definitiva deberá validarse durante el diseño técnico. La elección de tecnologías puede ajustarse a las necesidades y restricciones del proyecto.

---

📦 9. Módulos del sistema

🏪 Módulo de productores

Orientado a organizar la información de los productores y los establecimientos comerciales.

- Registro y gestión de productores.
- Gestión de plazas y locales.
- Consulta de información de establecimientos.
- Mapa interactivo para localizar locales, como funcionalidad prevista.

📦 Módulo de inventarios

Orientado a facilitar el control de los productos comercializados.

- Registro y actualización de productos.
- Gestión de existencias y precios.
- Consulta de disponibilidad.
- Alertas de inventario mínimo, como funcionalidad prevista.

🛒 Módulo de ventas

Orientado a facilitar la consulta de productos y la gestión de pedidos.

- Catálogo público.
- Búsqueda y filtrado de productos.
- Carrito de compras.
- Solicitud de pedidos para recoger en el local.
- Calificación de productos y establecimientos.

---

📊 10. Requerimientos y documentación

Según la planificación documental del proyecto, se contempla la siguiente especificación:

Artefacto| Cantidad prevista
Requerimientos funcionales| 20
Requerimientos no funcionales| 7
Historias de usuario| 19
Casos de uso UML| 15
Entidades del modelo de datos| 12

Documentación técnica

La documentación prevista incluye:

- Especificación de requerimientos funcionales RF-01 a RF-20.
- Requerimientos no funcionales con criterios basados en ISO/IEC 25010.
- Historias de usuario con criterios de aceptación.
- Diagramas de casos de uso UML.
- Modelo entidad-relación.
- Script SQL para MySQL 8.
- Documento de especificación de arquitectura.

Las cantidades corresponden a la planificación informada del proyecto. Los documentos y artefactos deben estar disponibles y completos para considerarse entregables terminados.

---

🧠 11. Aprendizajes y competencias

El desarrollo de FeriApp permite aplicar conocimientos de:

- Estructuración semántica con HTML5.
- Diseño adaptable mediante CSS3.
- Programación frontend con JavaScript.
- Manipulación del DOM y gestión de eventos.
- Validación de formularios.
- Persistencia de datos con LocalStorage.
- Organización y separación de responsabilidades del código.
- Control de versiones mediante Git y GitHub.
- Despliegue de sitios estáticos con GitHub Pages.
- Análisis y documentación de requerimientos.
- Modelado de datos y diseño de arquitectura.
- Trabajo colaborativo mediante Scrum.

---

🔄 12. Metodología de trabajo: Scrum

El equipo toma como referencia el marco de trabajo ágil Scrum, que promueve la transparencia, la inspección, la adaptación y la entrega incremental de valor.

👥 Organización del equipo

Integrante| Rol| Responsabilidades principales
Gerson H. C.| Scrum Master| Facilitar Scrum, ayudar a eliminar impedimentos, promover la colaboración y fomentar la mejora continua.
Heller Tobito| Product Owner| Comunicar la visión del producto, gestionar y priorizar el Product Backlog y maximizar el valor del producto.
Sergio González| Developer| Participar en la construcción, implementación, verificación y mejora de las funcionalidades.

Responsabilidades por rol

Scrum Master — Gerson H. C.

- Facilitar la aplicación correcta de Scrum.
- Promover la colaboración entre los integrantes.
- Ayudar a identificar y eliminar impedimentos.
- Fomentar la mejora continua del equipo.

Product Owner — Heller Tobito

- Definir y comunicar los objetivos del producto.
- Gestionar y ordenar el Product Backlog.
- Priorizar funcionalidades según su valor.
- Mantener claras las necesidades de los usuarios.

Developer — Sergio González

- Participar en la construcción del producto.
- Implementar y verificar funcionalidades.
- Colaborar con los demás integrantes.
- Contribuir a la calidad del incremento.

En Scrum, los roles tienen responsabilidades diferentes y complementarias. El Scrum Master no es el jefe del equipo y el Product Owner no dirige jerárquicamente a los Developers.

---

🤝 13. Contribuciones

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

6. Abre un Pull Request explicando los cambios.

También puedes informar errores o proponer funcionalidades mediante "GitHub Issues" (../../issues).

---

👥 14. Equipo de desarrollo

Proyecto colaborativo del programa Tecnología en Análisis y Desarrollo de Software (ADSO) del SENA.

Ficha de formación: 3478080.

Integrante| Rol en Scrum
Gerson H. C.| Scrum Master
Heller Tobito| Product Owner
Sergio González| Developer

Enlaces

- Repositorio: "Gerson-hc/feriapp-page" (https://github.com/Gerson-hc/feriapp-page)
- Demo en vivo: "FeriApp en GitHub Pages" (https://gerson-hc.github.io/feriapp-page/)

---

📄 15. Licencia

El proyecto declara utilizar la licencia MIT. Consulta el archivo ""LICENSE"" (LICENSE) para verificar los términos y condiciones aplicables.

---

<div align="center">🌱 FeriApp

Tecnología al servicio del comercio local colombiano 🇨🇴

Proyecto formativo SENA · ADSO · 2026

⭐ Si te interesa el proyecto, puedes darle una estrella al repositorio.

</div>