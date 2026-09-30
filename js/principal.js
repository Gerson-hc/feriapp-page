/* =====================================================================
   FeriApp | Núcleo de tienda, sesión opcional y carrito
   ===================================================================== */
(function () {
    'use strict';

    function safeParse(value, fallback) {
        try {
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.warn('FeriApp: dato local inválido.', error);
            return fallback;
        }
    }

    function getSession() {
        const active = localStorage.getItem('sesion_activa') === 'true';
        const role = localStorage.getItem('rolferiapp') || localStorage.getItem('usuario_rol');
        const name = localStorage.getItem('nombreferiapp') || localStorage.getItem('usuario_nombre') || 'visitante';
        const email = localStorage.getItem('correoferiapp') || '';
        const userId = localStorage.getItem('usuario_id') || '';
        return active && role ? { active: true, role, name, email, userId } : null;
    }

    function storageSuffix() {
        const session = getSession();
        const raw = (session && (session.userId || session.email)) || 'anonimo';
        return String(raw).replace(/[^a-zA-Z0-9_-]/g, '_');
    }

    function getCartKey() {
        const session = getSession();
        return session ? `carritoferiapp_${storageSuffix()}` : null;
    }

    function getOrdersKey() {
        const session = getSession();
        return session ? `historialpedidos_${storageSuffix()}` : null;
    }

    function getCart() {
        const key = getCartKey();
        return key ? safeParse(localStorage.getItem(key), []) : [];
    }

    function setCart(cart) {
        const key = getCartKey();
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(Array.isArray(cart) ? cart : []));
    }

    function getOrders() {
        const key = getOrdersKey();
        return key ? safeParse(localStorage.getItem(key), []) : [];
    }

    function setOrders(orders) {
        const key = getOrdersKey();
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(Array.isArray(orders) ? orders : []));
    }

    function buildLoginUrl(returnTo, reason) {
        const params = new URLSearchParams();
        if (returnTo) params.set('return', returnTo);
        if (reason) params.set('reason', reason);
        return `login.html${params.toString() ? '?' + params.toString() : ''}`;
    }

    function requireAuth(returnTo = 'principal.html', reason = 'auth') {
        if (getSession()) return true;
        window.location.href = buildLoginUrl(returnTo, reason);
        return false;
    }

    function escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function logout() {
        localStorage.removeItem('sesion_activa');
        localStorage.removeItem('rolferiapp');
        localStorage.removeItem('nombreferiapp');
        localStorage.removeItem('correoferiapp');
        localStorage.removeItem('usuario_id');
        localStorage.removeItem('usuario_nombre');
        localStorage.removeItem('usuario_rol');
        localStorage.removeItem('fotoferiapp');
        localStorage.removeItem('bioferiapp');
        localStorage.removeItem('feriapp_accion_pendiente');
        window.location.href = 'principal.html';
    }

    const PUBLIC_ROUTES = new Set([
        'principal.html', 'asesoria.html', 'logistica.html', 'contacto.html',
        'soporte.html', 'proveedores.html', 'login.html', 'registro.html', 'recuperacion.html', 'index.html'
    ]);
    function currentPage() {
        return window.location.pathname.split('/').pop().toLowerCase() || 'principal.html';
    }

    function protectRoute() {
        const page = currentPage();
        if (PUBLIC_ROUTES.has(page)) return true;

        const session = getSession();
        if (!session) {
            const returnTo = page || 'principal.html';
            window.location.href = buildLoginUrl(returnTo, 'protected');
            return false;
        }

        if (page === 'mis_productos.html' && session.role !== 'vendedor') {
            window.location.href = 'principal.html';
            return false;
        }

        if (page === 'admin.html' && session.role !== 'admin') {
            window.location.href = 'principal.html';
            return false;
        }

        return true;
    }

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

    document.addEventListener('DOMContentLoaded', function () {
        if (!protectRoute()) return;

        const session = getSession();
        const rolactual = session ? session.role : null;
        const nombreactual = session ? session.name : 'visitante';
        const fotoguardada = localStorage.getItem('fotoferiapp');

        const primernombre = nombreactual.split(' ')[0];
        const textobienvenida = document.getElementById('textobienvenida');
        if (textobienvenida) textobienvenida.textContent = session ? `¡hola, ${primernombre}!` : '¡hola, visitante!';

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
                    <a href="login.html?return=principal.html">iniciar sesión</a>
                    <a href="registro.html">crear una cuenta</a>
                `;
            } else {
                let enlacesExtra = '';
                if (rolactual === 'vendedor') {
                    enlacesExtra = `<a href="mis_productos.html" style="color:#bc6c25; font-weight:bold;">📦 gestionar mis productos</a>`;
                    const btnAgregar = document.getElementById('botonagregarprod');
                    if (btnAgregar) btnAgregar.classList.remove('oculto');
                } else if (rolactual === 'admin') {
                    enlacesExtra = `<a href="admin.html" style="color:#d90429; font-weight:bold;">⚙️ panel de administrador</a>`;
                }

                menuPerfil.innerHTML = `
                    <p><strong id="textobienvenida">¡hola, ${escapeHTML(primernombre)}!</strong></p>
                    <p style="font-size:0.75rem; color:#666; text-align:center; margin-top:-5px; margin-bottom:10px;">(${escapeHTML(rolactual)})</p>
                    <hr>
                    ${enlacesExtra}
                    <a href="perfil.html">editar mi perfil</a>
                    <a href="pedidos.html">mis compras / historial</a>
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

        const menuServicios = document.querySelector('.contenidodesplegable');
        const tituloServicios = document.querySelector('.menudesplegable .enlacenav');
        if (menuServicios && tituloServicios) {
            if (!session) {
                tituloServicios.textContent = 'servicios ▼';
            } else if (rolactual === 'comprador') {
                tituloServicios.textContent = 'atención al cliente ▼';
                menuServicios.innerHTML = `
                    <a href="soporte.html">centro de ayuda (PQR)</a>
                    <a href="#" onclick="abrirModalCalificar(event)">⭐ calificar FeriApp</a>
                `;
            } else if (rolactual === 'vendedor') {
                tituloServicios.textContent = 'herramientas B2B ▼';
                menuServicios.innerHTML = `
                    <a href="asesoria.html">🌱 asesoría agrícola</a>
                    <a href="logistica.html">🚚 logística y fletes</a>
                    <a href="proveedores.html">🏭 proveedores de insumos</a>
                    <a href="soporte.html">🎧 soporte técnico</a>
                `;
            } else if (rolactual === 'admin') {
                tituloServicios.textContent = 'accesos rápidos ▼';
                menuServicios.innerHTML = `<a href="admin.html">⚙️ ir al panel de control</a>`;
            }
        }

// 5. MODAL PARA CALIFICAR APP
    if (!document.getElementById('modal-calificar-app')) {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'modal-calificar-app';
        modalDiv.className = 'fondomodal';
        modalDiv.innerHTML = `
            <div class="cajamodal" style="text-align: center;">
                <span class="cerrarmodal" onclick="document.getElementById('modal-calificar-app').style.display='none'">&times;</span>
                <h3 style="color:#2d5a27; margin-bottom: 5px;">Califica tu experiencia</h3>
                <p style="font-size:0.9rem; color:#666; margin-bottom:20px;">¿Qué te parece Feriapp en general?</p>
                <select id="nota-app" style="width:100%; padding:10px; margin-bottom:15px; border-radius:4px;">
                    <option value="5">⭐⭐⭐⭐⭐ ¡Excelente, me encanta!</option>
                    <option value="4">⭐⭐⭐⭐ Muy buena plataforma</option>
                    <option value="3">⭐⭐⭐ Funciona, pero puede mejorar</option>
                    <option value="2">⭐⭐ Tiene muchos errores</option>
                    <option value="1">⭐ Pésima experiencia</option>
                </select>
                <textarea id="comentario-app" placeholder="Déjanos un comentario o sugerencia..." style="width:100%; height:80px; padding:10px; border:1px solid #ccc; border-radius:4px; margin-bottom:15px; resize:none;"></textarea>
                <button class="botonaccion" style="width:100%;" onclick="guardarCalificacionApp()">Enviar mi Opinión</button>
            </div>
        `;
        document.body.appendChild(modalDiv);
    }
    
    window.abrirModalCalificar = function(e) {
        e.preventDefault();
        document.getElementById('modal-calificar-app').style.display = 'flex';
    };

    window.guardarCalificacionApp = function() {
        const nota = document.getElementById('nota-app').value;
        const coment = document.getElementById('comentario-app').value.trim();
        if(!coment) { alert("Por favor, déjanos un comentario.", true); return; }
        
        let ratings = safeParse(localStorage.getItem('feriapp_ratings'), []);
        ratings.push({ user: nombreactual, nota: Number(nota), comentario: coment, fecha: new Date().toLocaleDateString() });
        localStorage.setItem('feriapp_ratings', JSON.stringify(ratings));
        
        alert("¡Gracias por ayudarnos a mejorar Feriapp!");
        document.getElementById('modal-calificar-app').style.display = 'none';
    };

    // ================== MOTOR DEL CATÁLOGO Y CARTAS ==================
    const grillaproductos = document.getElementById('grillaproductos');
    const titulocatalogo = document.getElementById('titulocatalogo');
    const contenedorCatalogo = document.getElementById('seccioncatalogo');
    const cajafiltros = document.getElementById('cajafiltros');
    
    const productosBase = [
        { id: 'P1', nombre: 'manzanas frescas', categoria: 'frutas', precio: 3500, desc: 'manzana roja dulce, cultivada sin químicos.', imagen: '', icono: '🍎', destacado: true },
        { id: 'P2', nombre: 'banano criollo', categoria: 'frutas', precio: 2000, desc: 'banano fresco del eje cafetero.', imagen: '', icono: '🍌', destacado: false },
        { id: 'P3', nombre: 'rosas de exportación', categoria: 'flores', precio: 15000, desc: 'rosas frescas recién cortadas.', imagen: '', icono: '🌹', destacado: true },
        { id: 'P4', nombre: 'orquídeas moradas', categoria: 'flores', precio: 45000, desc: 'hermosa planta ideal para decoración.', imagen: '', icono: '🌺', destacado: false },
        { id: 'P5', nombre: 'carne de res', categoria: 'carnicos', precio: 25000, desc: 'corte de primera calidad.', imagen: '', icono: '🥩', destacado: true },
        { id: 'P6', nombre: 'pechuga de pollo', categoria: 'carnicos', precio: 14000, desc: 'pollo campesino fresco.', imagen: '', icono: '🍗', destacado: false },
        { id: 'P7', nombre: 'queso campesino', categoria: 'lacteos', precio: 12000, desc: 'queso fresco pasteurizado.', imagen: '', icono: '🧀', destacado: false },
        { id: 'P8', nombre: 'yogurt artesanal', categoria: 'lacteos', precio: 6000, desc: 'yogurt de mora espeso.', imagen: '', icono: '🥛', destacado: true }
    ];

    if (!localStorage.getItem('catalogo_v3')) {
        localStorage.setItem('catalogo_v3', JSON.stringify(productosBase));
    }

    let categoriaActual = 'destacados'; 
    let ordenActual = 'defecto';
    let catalogoAbierto = true;

    window.renderizarProductos = function() {
        if (!grillaproductos) return;
        let inventario = safeParse(localStorage.getItem('catalogo_v3'), []);
        let filtrados = inventario;

        if (categoriaActual === 'destacados') {
            filtrados = inventario.filter(p => p.destacado === true);
            if(titulocatalogo) titulocatalogo.textContent = "⭐ destacados del día";
        } else if (categoriaActual !== 'todos') {
            filtrados = inventario.filter(p => p.categoria === categoriaActual);
            if(titulocatalogo) titulocatalogo.textContent = "categoría: " + categoriaActual;
        } else {
            if(titulocatalogo) titulocatalogo.textContent = "todos los productos";
        }

        if (ordenActual === 'az') filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        else if (ordenActual === 'za') filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        else if (ordenActual === 'minmax') filtrados.sort((a, b) => a.precio - b.precio);
        else if (ordenActual === 'maxmin') filtrados.sort((a, b) => b.precio - a.precio);

        grillaproductos.innerHTML = "";
        if (filtrados.length === 0) {
            grillaproductos.innerHTML = "<p style='color: #666; font-size: 1.2rem; width: 100%; text-align: center;'>no hay productos en esta categoría por ahora.</p>";
            return;
        }

        filtrados.forEach(prod => {
            let htmlImagen = prod.imagen ? `<img src="${prod.imagen}" class="imgfrente" alt="${prod.nombre}">` : `<span class="icono">${prod.icono}</span>`;
            let htmlEstrella = (prod.destacado && categoriaActual !== 'destacados') ? `<div class="estrelladestacado" title="producto destacado">⭐</div>` : ``;
            
            grillaproductos.innerHTML += `
            <div class="tarjeta" data-id="${prod.id}" data-cat="${prod.categoria}" data-nombre="${prod.nombre}">
                ${htmlEstrella}
                <div class="tarjetainterna">
                    <div class="frente">
                        ${htmlImagen}
                        <h3>${prod.nombre}</h3>
                        <p style="color: #666; font-size: 0.8rem; margin-top: 10px;">(click para ver info)</p>
                    </div>
                    <div class="dorso">
                        <h3>detalles</h3>
                        <p>${prod.desc}</p>
                        <p class="preciotexto">$${prod.precio.toLocaleString('es-CO')}</p>
                        <button class="botonaccion botoncomprar">añadir al carrito</button>
                    </div>
                </div>
            </div>`;
        });
    };

    // 6. GIRO DE LOS CÍRCULOS
    document.querySelectorAll('.circulocategoria').forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const categoriaClickeada = this.getAttribute('data-cat');
            
            if (categoriaActual === categoriaClickeada && catalogoAbierto) {
                catalogoAbierto = false;
                this.classList.remove('activo');
                if(contenedorCatalogo) contenedorCatalogo.style.display = 'none';
                if(cajafiltros) cajafiltros.style.display = 'none';
            } else {
                categoriaActual = categoriaClickeada;
                catalogoAbierto = true;
                
                document.querySelectorAll('.circulocategoria').forEach(b => b.classList.remove('activo'));
                this.classList.add('activo');
                
                if(contenedorCatalogo) contenedorCatalogo.style.display = 'block';
                if(cajafiltros) cajafiltros.style.display = 'flex';
                
                const sFiltro = document.getElementById('filtroorden');
                if(sFiltro) sFiltro.value = 'defecto';
                ordenActual = 'defecto';
                
                renderizarProductos();
            }
        });
    });

    // 7. FILTROS Y BUSCADORES
    const selectFiltro = document.getElementById('filtroorden');
    if (selectFiltro) selectFiltro.addEventListener('change', function() { ordenActual = this.value; renderizarProductos(); });

    const inputBuscador = document.getElementById('inputbuscador');
    if (inputBuscador) {
        inputBuscador.addEventListener('input', function() {
            const texto = this.value.toLowerCase().trim();
            if (texto === "") {
                categoriaActual = 'destacados'; 
                renderizarProductos();
                return;
            }
            let inventario = safeParse(localStorage.getItem('catalogo_v3'), []);
            let resultados = inventario.filter(p => p.nombre.toLowerCase().includes(texto));
            
            if(titulocatalogo) titulocatalogo.textContent = 'resultados para: "' + texto + '"';
            if(grillaproductos) {
                grillaproductos.innerHTML = "";
                resultados.forEach(prod => {
                    let htmlImagen = prod.imagen ? `<img src="${prod.imagen}" class="imgfrente" alt="${prod.nombre}">` : `<span class="icono">${prod.icono}</span>`;
                    grillaproductos.innerHTML += `
                    <div class="tarjeta" data-id="${prod.id}" data-cat="${prod.categoria}" data-nombre="${prod.nombre}">
                        <div class="tarjetainterna">
                            <div class="frente">
                                ${htmlImagen}
                                <h3>${prod.nombre}</h3>
                            </div>
                            <div class="dorso">
                                <p>${prod.desc}</p>
                                <p class="preciotexto">$${prod.precio.toLocaleString('es-CO')}</p>
                                <button class="botonaccion botoncomprar">añadir al carrito</button>
                            </div>
                        </div>
                    </div>`;
                });
            }
        });
    }

    // 8. CLICS GLOBALES (Giro de cartas y Carrito)
    document.addEventListener('click', function(e) {
        // Girar cartas
        const tarjeta = e.target.closest('.tarjeta');
        if (tarjeta && !e.target.classList.contains('botoncomprar')) {
            tarjeta.classList.toggle('girada');
        }

        // Comprar: el catálogo es público, pero añadir al carrito requiere sesión.
        if (e.target.classList.contains('botoncomprar')) {
            e.stopPropagation();
            const tarj = e.target.closest('.tarjeta');
            if (!tarj) return;

            const productoId = tarj.getAttribute('data-id');
            const inventory = safeParse(localStorage.getItem('catalogo_v3'), []);
            const producto = inventory.find((item) => item.id === productoId);
            if (!producto) {
                alert('No se pudo encontrar el producto.', true);
                return;
            }

            if (!getSession()) {
                localStorage.setItem('feriapp_accion_pendiente', JSON.stringify({
                    type: 'add_to_cart',
                    productId: producto.id
                }));
                window.location.href = buildLoginUrl('principal.html', 'cart');
                return;
            }

            const carrito = getCart();
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: Number(producto.precio) || 0,
                imagen: producto.imagen || '',
                categoria: producto.categoria || ''
            });
            setCart(carrito);
            actualizarContadorCarrito();
            alert('¡' + producto.nombre + ' añadido al carrito!');
        }

        // Modal Vendedor
        const modal = document.getElementById('modalproducto');
        if (modal) {
            if (e.target.id === 'botonagregarprod') modal.style.display = "flex";
            if (e.target.id === 'cerrarmodal' || e.target.classList.contains('cerrarmodal')) modal.style.display = "none";
        }
    });

    // 9. PUBLICAR PRODUCTOS
    let imagenBase64Temporal = "";
    const modImagen = document.getElementById('modimagen');
    if (modImagen) {
        modImagen.addEventListener('change', function(e) {
            const archivo = e.target.files[0];
            if (archivo) {
                const lector = new FileReader();
                lector.onload = function(evento) { imagenBase64Temporal = evento.target.result; };
                lector.readAsDataURL(archivo);
            }
        });
    }

    // ====================================================================
// MODALES PROFESIONALES PARA EL VENDEDOR (CAMBIAR PRECIO Y BORRAR)
// ====================================================================

// 1. CARTA PARA CAMBIAR PRECIO
window.cambiarPrecio = function(id) {
    let inv = safeParse(localStorage.getItem('catalogo_v3'), []);
    let producto = inv.find(p => p.id === id);
    if (!producto) return;

    let modalPrecio = document.getElementById('modal-cambiar-precio');
    if (!modalPrecio) {
        modalPrecio = document.createElement('div');
        modalPrecio.id = 'modal-cambiar-precio';
        modalPrecio.className = 'fondomodal';
        document.body.appendChild(modalPrecio);
    }

    modalPrecio.innerHTML = `
        <div class="cajamodal" style="text-align: center; max-width: 350px;">
            <span class="cerrarmodal" onclick="document.getElementById('modal-cambiar-precio').style.display='none'">&times;</span>
            <h2 style="color: #072e58; margin-bottom: 10px;">Actualizar Precio</h2>
            <p style="color: #666; font-size: 0.95rem; margin-bottom: 20px;">Producto: <strong style="color:#fb6e0b;">${producto.nombre}</strong></p>
            
            <div style="position: relative; margin-bottom: 20px;">
                <span style="position: absolute; left: 15px; top: 12px; font-weight: bold; color: #34833c; font-size: 1.2rem;">$</span>
                <input type="number" id="nuevo-precio-input" value="${producto.precio}" style="width: 100%; padding: 12px 10px 12px 35px; border-radius: 6px; border: 2px solid #ccc; font-size: 1.2rem; font-weight: bold; color: #333; outline: none;">
            </div>
            
            <button class="botonaccion" style="width: 100%; background-color: #34833c;" onclick="guardarNuevoPrecio('${id}')">Guardar Nuevo Precio</button>
        </div>
    `;
    modalPrecio.style.display = 'flex';
};

// Función interna para guardar el precio modificado
window.guardarNuevoPrecio = function(id) {
    let nuevoPrecio = document.getElementById('nuevo-precio-input').value;
    if (nuevoPrecio === '' || Number(nuevoPrecio) <= 0) {
        alert('Por favor ingresa un precio válido mayor a cero.', true);
        return;
    }
    
    let inv = safeParse(localStorage.getItem('catalogo_v3'), []);
    let index = inv.findIndex(p => p.id === id);
    if (index !== -1) {
        inv[index].precio = Number(nuevoPrecio);
        localStorage.setItem('catalogo_v3', JSON.stringify(inv));
        
        document.getElementById('modal-cambiar-precio').style.display = 'none';
        alert('¡Precio actualizado exitosamente!');
        
        // Refrescar la tabla o la página para ver el cambio
        setTimeout(() => location.reload(), 800);
    }
};

// 2. CARTA DE ADVERTENCIA PARA BORRAR PRODUCTO
window.eliminarProducto = function(id) {
    let inv = safeParse(localStorage.getItem('catalogo_v3'), []);
    let producto = inv.find(p => p.id === id);
    if (!producto) return;

    let modalBorrar = document.getElementById('modal-borrar-prod');
    if (!modalBorrar) {
        modalBorrar = document.createElement('div');
        modalBorrar.id = 'modal-borrar-prod';
        modalBorrar.className = 'fondomodal';
        document.body.appendChild(modalBorrar);
    }

    modalBorrar.innerHTML = `
        <div class="cajamodal" style="text-align: center; max-width: 380px; border-top: 6px solid #d90429;">
            <div style="font-size: 3.5rem; margin-bottom: 10px;">🗑️</div>
            <h2 style="color: #d90429; margin-bottom: 15px;">¿Eliminar producto?</h2>
            
            <p style="color: #555; font-size: 1rem; margin-bottom: 25px; line-height: 1.4;">
                Estás a punto de borrar <strong style="color:#072e58;">${producto.nombre}</strong> de tu catálogo.<br>
                <span style="font-size: 0.85rem; color: #999;">Esta acción es irreversible y desaparecerá de la tienda.</span>
            </p>
            
            <div style="display: flex; gap: 15px;">
                <button style="flex: 1; padding: 12px; background: #e2e8f0; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s;" onmouseover="this.style.background='#cbd5e1'" onmouseout="this.style.background='#e2e8f0'" onclick="document.getElementById('modal-borrar-prod').style.display='none'">Cancelar</button>
                
                <button style="flex: 1; padding: 12px; background: #d90429; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s;" onmouseover="this.style.background='#b00320'" onmouseout="this.style.background='#d90429'" onclick="confirmarBorrarProducto('${id}')">Sí, Eliminar</button>
            </div>
        </div>
    `;
    modalBorrar.style.display = 'flex';
};

// Función interna para confirmar el borrado
window.confirmarBorrarProducto = function(id) {
    let inv = safeParse(localStorage.getItem('catalogo_v3'), []);
    let nuevoInv = inv.filter(p => p.id !== id);
    localStorage.setItem('catalogo_v3', JSON.stringify(nuevoInv));
    
    document.getElementById('modal-borrar-prod').style.display = 'none';
    alert('Producto eliminado correctamente.');
    
    // Refrescar la tabla o la página para ver el cambio
    setTimeout(() => location.reload(), 800);
};

    const btnGuardar = document.getElementById('botonguardar');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function() {
            const nombre = document.getElementById('modnombre').value.trim();
            const categoria = document.getElementById('modcat').value;
            const desc = document.getElementById('moddesc').value.trim();
            const precio = document.getElementById('modprecio').value.trim();
            const err = document.getElementById('errormodal'); // Tu caja de error roja

            // Expresiones regulares de seguridad
            const regexTextoLimpio = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,]+$/; // Letras, números, puntos y comas

            // 1. Verificar campos vacíos
            if (nombre === "" || desc === "" || precio === "" || imagenBase64Temporal === "") {
                err.textContent = "Error: Todos los campos y la imagen son obligatorios.";
                err.style.display = "block";
                err.style.color = "white"; 
                err.style.backgroundColor = "#d90429"; // Fondo rojo alerta
                err.style.padding = "10px";
                err.style.borderRadius = "6px";
                return; // Detiene la ejecución
            }

            // 2. Validar que el nombre no tenga símbolos extraños (como $%&/)
            if (!regexTextoLimpio.test(nombre)) {
                err.textContent = "Error: El nombre del producto no permite caracteres especiales.";
                err.style.display = "block";
                return;
            }

            // 3. Validar longitud de descripción
            if (desc.length < 15) {
                err.textContent = "Error: La descripción es muy corta. Sé más detallado (mín. 15 letras).";
                err.style.display = "block";
                return;
            }

            // 4. Validar precio real (mayor a cero)
            if (Number(precio) <= 0) {
                err.textContent = "Error: El precio debe ser un valor válido mayor a cero.";
                err.style.display = "block";
                return;
            }

            // Si pasa todas las validaciones, oculta el error y guarda el producto
            err.style.display = "none";
            
            let inventario = safeParse(localStorage.getItem('catalogo_v3'), []);
            const maxProductNumber = inventario.reduce((max, product) => {
                const match = String(product.id || '').match(/\d+/);
                return Math.max(max, match ? Number(match[0]) : 0);
            }, 0);

            inventario.push({
                id: 'P' + (maxProductNumber + 1),
                nombre: nombre,
                categoria: categoria,
                precio: Number(precio),
                desc: desc,
                imagen: imagenBase64Temporal,
                icono: '🛍️', 
                destacado: false
            });
            localStorage.setItem('catalogo_v3', JSON.stringify(inventario));

            alert("¡El producto '" + nombre + "' ha sido publicado exitosamente!");
            
            // Limpiar formulario y cerrar modal
            document.getElementById('modnombre').value = "";
            document.getElementById('moddesc').value = "";
            document.getElementById('modprecio').value = "";
            document.getElementById('modimagen').value = "";
            imagenBase64Temporal = "";
            document.getElementById('modalproducto').style.display = "none";

            categoriaActual = categoria; 
            document.querySelectorAll('.circulocategoria').forEach(b => b.classList.remove('activo'));
            const circuloDestino = document.querySelector(`.circulocategoria[data-cat="${categoria}"]`);
            if (circuloDestino) circuloDestino.classList.add('activo');

            renderizarProductos();
        });
    }
      // 10. CONTADOR DEL CARRITO
    window.actualizarContadorCarrito = function() {
        const carrito = getCart();
        const contador = document.getElementById('contadorcarrito');
        if (contador) {
            contador.textContent = carrito.length;
            contador.style.display = carrito.length > 0 ? 'flex' : 'none';
        }
    };
    actualizarContadorCarrito();

    // ================== ARRANQUE FINAL ==================
    if (document.getElementById('grillaproductos')) {
        setTimeout(() => {
            categoriaActual = 'destacados';
            renderizarProductos();
        }, 100);
    }

}); // <-- CIERRE MAESTRO. NADA DEBE ESTAR DESPUÉS DE ESTO EXCEPTO EL ESCUDO.

// ================== ESCUDO CONTRA NÚMEROS NEGATIVOS ==================
document.addEventListener('input', function(e) {
    const id = e.target.id ? e.target.id.toLowerCase() : '';
    if (e.target.type === 'number' || id.includes('precio') || id.includes('peso')) {
        let valor = e.target.value.replace(/[-e]/ig, '');
        if (valor !== "" && Number(valor) < 0) valor = Math.abs(valor);
        e.target.value = valor;
    }
});
document.addEventListener('keydown', function(e) {
    const id = e.target.id ? e.target.id.toLowerCase() : '';
    if (e.target.type === 'number' || id.includes('precio') || id.includes('peso')) {
        if (e.key === '-' || e.key === 'e') e.preventDefault();
    }
});

// ================== CARRUSEL DE FONDO AUTOMÁTICO ==================
document.addEventListener('DOMContentLoaded', function() {
    let fondos = document.querySelectorAll('.hero-bg');
    if (fondos.length > 0) {
        let indiceFondo = 0;
        setInterval(() => {
            fondos[indiceFondo].classList.remove('activo');
            indiceFondo = (indiceFondo + 1) % fondos.length;
            fondos[indiceFondo].classList.add('activo');
        }, 4000); // Rota cada 4 segundos
    }

    // =========================================
    // 3. TOGGLE PARA VER/OCULTAR CONTRASEÑA
    // =========================================
    const btnOjo = document.getElementById('btn-ojo-pass');
    const inputPassword = document.getElementById('inp-pass'); 
    
    if (btnOjo && inputPassword) {
        btnOjo.addEventListener('click', function() {
            // Si está oculta, la muestra y cambia el icono
            if (inputPassword.type === 'password') {
                inputPassword.type = 'text';
                btnOjo.textContent = '🙈'; // Cambia el icono para indicar que la oculte
            } else {
                // Si está visible, la oculta y vuelve al ojo normal
                inputPassword.type = 'password';
                btnOjo.textContent = '👁️';
            }
        });
    }
});
})();
