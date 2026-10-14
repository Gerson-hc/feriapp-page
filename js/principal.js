// FeriApp - Equipo GAES 3 - SENA ADSO - Ficha 3478080
// Alineado con el documento de arquitectura V3 y los casos de uso aprobados.

// Rutas: la portada (index.html) está en la raíz y las demás páginas en html/.
// FERI_BASE_HTML es el prefijo para llegar a html/ desde la página actual; FERI_HOME lleva a la portada.
const FERI_BASE_HTML = window.location.pathname.includes('/html/') ? '' : 'html/';
const FERI_HOME = window.location.pathname.includes('/html/') ? '../index.html' : 'index.html';

/* =====================================================================
   FeriApp | Lógica compartida: sesión, protección de rutas, contador del
   pedido y menú de perfil por rol. NO contiene lógica de catálogo.
   ===================================================================== */
(function () {
    'use strict';

    // Convierte texto JSON en objeto; si está dañado devuelve el valor por defecto.
    function safeParse(value, fallback) {
        try {
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.warn('FeriApp: dato local inválido.', error);
            return fallback;
        }
    }

    // Devuelve la sesión activa { active, role, name, email, userId } o null si es visitante.
    function getSession() {
        const active = localStorage.getItem('sesion_activa') === 'true';
        const role = localStorage.getItem('rolferiapp') || localStorage.getItem('usuario_rol');
        const name = localStorage.getItem('nombreferiapp') || localStorage.getItem('usuario_nombre') || 'visitante';
        const email = localStorage.getItem('correoferiapp') || '';
        const userId = localStorage.getItem('usuario_id') || '';
        return active && role ? { active: true, role, name, email, userId } : null;
    }

    // Sufijo de las claves por usuario (id o correo de la sesión).
    function storageSuffix() {
        const session = getSession();
        const raw = (session && (session.userId || session.email)) || 'anonimo';
        return String(raw).replace(/[^a-zA-Z0-9_-]/g, '_');
    }

    // Clave de localStorage del carrito del usuario (null si no hay sesión).
    function getCartKey() {
        const session = getSession();
        return session ? `carritoferiapp_${storageSuffix()}` : null;
    }

    // Clave de localStorage del historial de pedidos del usuario (null si no hay sesión).
    function getOrdersKey() {
        const session = getSession();
        return session ? `historialpedidos_${storageSuffix()}` : null;
    }

    // Lee el carrito del usuario en sesión.
    function getCart() {
        const key = getCartKey();
        return key ? safeParse(localStorage.getItem(key), []) : [];
    }

    // Guarda el carrito del usuario en sesión.
    function setCart(cart) {
        const key = getCartKey();
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(Array.isArray(cart) ? cart : []));
    }

    // Lee el historial de pedidos del usuario en sesión.
    function getOrders() {
        const key = getOrdersKey();
        return key ? safeParse(localStorage.getItem(key), []) : [];
    }

    // Guarda el historial de pedidos del usuario en sesión.
    function setOrders(orders) {
        const key = getOrdersKey();
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(Array.isArray(orders) ? orders : []));
    }

    // Arma la URL de login con la página a la que volver y el motivo.
    function buildLoginUrl(returnTo, reason) {
        const params = new URLSearchParams();
        if (returnTo) params.set('return', returnTo);
        if (reason) params.set('reason', reason);
        return `${FERI_BASE_HTML}login.html${params.toString() ? '?' + params.toString() : ''}`;
    }

    // Exige sesión: si no la hay, redirige al login y devuelve false.
    function requireAuth(returnTo = 'catalogo.html', reason = 'auth') {
        if (getSession()) return true;
        window.location.href = buildLoginUrl(returnTo, reason);
        return false;
    }

    // Escapa texto para insertarlo de forma segura en HTML.
    function escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Cierra la sesión (borra solo las claves de sesión) y vuelve a la portada.
    function logout() {
        ['sesion_activa', 'rolferiapp', 'nombreferiapp', 'correoferiapp', 'usuario_id', 'usuario_nombre',
            'usuario_rol', 'fotoferiapp', 'bioferiapp', 'feriapp_accion_pendiente'
        ].forEach(k => localStorage.removeItem(k));
        window.location.href = FERI_HOME;
    }

    // Páginas que se pueden ver sin iniciar sesión.
    const PUBLIC_ROUTES = new Set([
        'index.html', 'catalogo.html', 'mapa.html', 'asesoria.html', 'logistica.html', 'contacto.html',
        'soporte.html', 'proveedores.html', 'login.html', 'registro.html', 'recuperacion.html'
    ]);

    // Nombre del archivo HTML actual (vacío = portada).
    function currentPage() {
        return window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    }

    // Protege las rutas: exige sesión en las privadas y el rol correcto en mis_productos y admin.
    function protectRoute() {
        const page = currentPage();
        if (PUBLIC_ROUTES.has(page)) return true;

        const session = getSession();
        if (!session) {
            window.location.href = buildLoginUrl(page, 'protected');
            return false;
        }
        if ((page === 'mis_productos.html' || page === 'mis_ventas.html') && session.role !== 'vendedor') {
            window.location.href = FERI_HOME;
            return false;
        }
        if (page === 'admin.html' && session.role !== 'admin') {
            window.location.href = FERI_HOME;
            return false;
        }
        return true;
    }

    // Actualiza la burbuja del carrito con la cantidad de productos del pedido en borrador
    // (el pedido se arma en catalogo.html y se guarda en feriapp_pedido_borrador).
    function actualizarContadorCarrito() {
        const borrador = safeParse(localStorage.getItem('feriapp_pedido_borrador'), null);
        const total = borrador && Array.isArray(borrador.items) ? borrador.items.length : 0;
        const contador = document.getElementById('contadorcarrito');
        if (contador) {
            contador.textContent = total;
            contador.style.display = total > 0 ? 'flex' : 'none';
        }
    }
    window.actualizarContadorCarrito = actualizarContadorCarrito;

    window.FeriApp = {
        safeParse,
        escapeHTML,
        getSession,
        getCartKey,
        getOrdersKey,
        getCart,
        setCart,
        getOrders,
        setOrders,
        requireAuth,
        buildLoginUrl,
        logout,
        protectRoute,
        isAuthenticated: () => Boolean(getSession())
    };

    // Pinta el menú de perfil y el menú de servicios según el rol (visitante / comprador / vendedor / admin).
    function pintarMenuPorRol() {
        const session = getSession();
        const rolactual = session ? session.role : null;
        const nombreactual = session ? session.name : 'visitante';
        const fotoguardada = localStorage.getItem('fotoferiapp');
        const primernombre = nombreactual.split(' ')[0];

        const btnPerfil = document.getElementById('botonperfil');
        if (fotoguardada && btnPerfil && session) {
            btnPerfil.innerHTML = `<img src="${fotoguardada}" alt="Foto de perfil" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        }

        const menuPerfil = document.getElementById('menuperfil');
        if (menuPerfil) {
            if (!session) {
                menuPerfil.innerHTML = `
                    <p><strong>¡hola, visitante!</strong></p>
                    <p style="font-size:0.75rem; color:#666; text-align:center; margin-top:-5px; margin-bottom:10px;">estás navegando como invitado</p>
                    <hr>
                    <a href="${FERI_BASE_HTML}login.html">iniciar sesión</a>
                    <a href="${FERI_BASE_HTML}registro.html">crear una cuenta</a>
                `;
            } else {
                let enlacesExtra = '';
                if (rolactual === 'vendedor') {
                    enlacesExtra = `<a href="${FERI_BASE_HTML}mis_productos.html" style="color:#bc6c25; font-weight:bold;">📦 gestionar mis productos</a><a href="${FERI_BASE_HTML}mis_ventas.html" style="color:#bc6c25; font-weight:bold;">🧾 mis ventas</a>`;
                } else if (rolactual === 'admin') {
                    enlacesExtra = `<a href="${FERI_BASE_HTML}admin.html" style="color:#d90429; font-weight:bold;">⚙️ panel de administrador</a>`;
                }
                menuPerfil.innerHTML = `
                    <p><strong>¡hola, ${escapeHTML(primernombre)}!</strong></p>
                    <p style="font-size:0.75rem; color:#666; text-align:center; margin-top:-5px; margin-bottom:10px;">(${escapeHTML(rolactual)})</p>
                    <hr>
                    ${enlacesExtra}
                    <a href="${FERI_BASE_HTML}perfil.html">editar mi perfil</a>
                    <a href="${FERI_BASE_HTML}pedidos.html">mis compras / historial</a>
                    <hr>
                    <a href="#" id="botoncerrarsesion" style="color: #d90429; font-weight: bold;">cerrar sesión</a>
                `;
                const closeSession = document.getElementById('botoncerrarsesion');
                if (closeSession) {
                    closeSession.addEventListener('click', function (e) {
                        e.preventDefault();
                        logout();
                    });
                }
            }
        }

        // Abrir y cerrar el menú de perfil
        if (btnPerfil && menuPerfil) {
            btnPerfil.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                menuPerfil.style.display = menuPerfil.style.display === 'block' ? 'none' : 'block';
            });
            document.addEventListener('click', function (e) {
                if (!menuPerfil.contains(e.target) && !btnPerfil.contains(e.target)) {
                    menuPerfil.style.display = 'none';
                }
            });
        }

        // Menú desplegable de servicios (solo existe en la portada)
        const menuServicios = document.querySelector('.contenidodesplegable');
        const tituloServicios = document.querySelector('.menudesplegable .enlacenav');
        if (menuServicios && tituloServicios) {
            if (!session) {
                tituloServicios.textContent = 'servicios ▼';
            } else if (rolactual === 'comprador') {
                tituloServicios.textContent = 'atención al cliente ▼';
                menuServicios.innerHTML = `
                    <a href="${FERI_BASE_HTML}soporte.html">centro de ayuda (PQR)</a>
                    <a href="${FERI_BASE_HTML}pedidos.html#calificar">⭐ calificar FeriApp</a>
                `;
            } else if (rolactual === 'vendedor') {
                tituloServicios.textContent = 'herramientas B2B ▼';
                menuServicios.innerHTML = `
                    <a href="${FERI_BASE_HTML}asesoria.html">🌱 asesoría agrícola</a>
                    <a href="${FERI_BASE_HTML}logistica.html">🚚 logística y fletes</a>
                    <a href="${FERI_BASE_HTML}proveedores.html">🏭 proveedores de insumos</a>
                    <a href="${FERI_BASE_HTML}soporte.html">🎧 soporte técnico</a>
                `;
            } else if (rolactual === 'admin') {
                tituloServicios.textContent = 'accesos rápidos ▼';
                menuServicios.innerHTML = `<a href="${FERI_BASE_HTML}admin.html">⚙️ ir al panel de control</a>`;
            }
        }
    }

    // Carrusel de imágenes de fondo del hero: cambia de imagen cada 4 segundos.
    function iniciarCarruselHero() {
        const fondos = document.querySelectorAll('.hero-bg');
        if (fondos.length < 2) return;
        let indice = 0;
        setInterval(() => {
            fondos[indice].classList.remove('activo');
            indice = (indice + 1) % fondos.length;
            fondos[indice].classList.add('activo');
        }, 4000);
    }

    // Botón del ojo: muestra u oculta la contraseña (campo #inp-pass, botón #btn-ojo-pass).
    function iniciarToggleContrasena() {
        const btnOjo = document.getElementById('btn-ojo-pass');
        const inputPassword = document.getElementById('inp-pass');
        if (!btnOjo || !inputPassword) return;
        btnOjo.addEventListener('click', function () {
            const mostrar = inputPassword.type === 'password';
            inputPassword.type = mostrar ? 'text' : 'password';
            btnOjo.textContent = mostrar ? '🙈' : '👁️';
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!protectRoute()) return;
        pintarMenuPorRol();
        actualizarContadorCarrito();
        iniciarCarruselHero();
        iniciarToggleContrasena();
    });
})();

// ================== ESCUDO CONTRA NÚMEROS NEGATIVOS ==================
// Quita "-" y "e" de los campos numéricos (y de los que tengan "precio" o "peso" en el id) mientras se escribe.
document.addEventListener('input', function (e) {
    const id = e.target.id ? e.target.id.toLowerCase() : '';
    if (e.target.type === 'number' || id.includes('precio') || id.includes('peso')) {
        let valor = e.target.value.replace(/[-e]/ig, '');
        if (valor !== '' && Number(valor) < 0) valor = Math.abs(valor);
        if (valor !== e.target.value) e.target.value = valor;
    }
});
// Bloquea las teclas "-" y "e" en esos mismos campos.
document.addEventListener('keydown', function (e) {
    const id = e.target.id ? e.target.id.toLowerCase() : '';
    if (e.target.type === 'number' || id.includes('precio') || id.includes('peso')) {
        if (e.key === '-' || e.key === 'e') e.preventDefault();
    }
});
