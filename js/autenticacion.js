/* ====================================================================
   FeriApp | AUTENTICACIÓN DEMOSTRATIVA
   --------------------------------------------------------------------
   - El catálogo puede abrirse sin iniciar sesión.
   - Registro y login validan los datos en tiempo real.
   - En esta etapa NO se guardan cuentas de usuario.
   - Un login válido de demostración crea solamente una sesión local.
   - El bloque para almacenamiento permanente está en /almaceninicios.
   ==================================================================== */
(function () {
    'use strict';

    const REGEX = {
        soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/,
        correoReal: /^[a-zA-Z0-9._-]+@(gmail|yahoo|hotmail|outlook|live|empresa)\.[a-zA-Z]{2,}$/,
        numeros: /^\d+$/,
        documento: /^\d{5,10}$/,
        password: /.{8,}/
    };

    const ROLES_LOGIN = new Set(['comprador', 'vendedor', 'admin']);
    const ROLES_REGISTRO = new Set(['comprador', 'vendedor']);

    const STORAGE = {
        session: 'sesion_activa',
        name: 'nombreferiapp',
        role: 'rolferiapp',
        email: 'correoferiapp',
        legacyName: 'usuario_nombre',
        legacyRole: 'usuario_rol',
        pendingAction: 'feriapp_accion_pendiente'
    };

    function safeParse(value, fallback) {
        try {
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.warn('FeriApp: dato local inválido.', error);
            return fallback;
        }
    }

    function getSession() {
        const active = localStorage.getItem(STORAGE.session) === 'true';
        const role = localStorage.getItem(STORAGE.role) || localStorage.getItem(STORAGE.legacyRole);
        const name = localStorage.getItem(STORAGE.name) || localStorage.getItem(STORAGE.legacyName) || 'Usuario';
        const email = localStorage.getItem(STORAGE.email) || '';

        if (!active || !role) return null;

        return {
            active: true,
            role,
            name,
            email
        };
    }

    function saveSession(name, email, role) {
        localStorage.setItem(STORAGE.session, 'true');
        localStorage.setItem(STORAGE.name, name);
        localStorage.setItem(STORAGE.role, role);
        localStorage.setItem(STORAGE.email, email || '');

        // Compatibilidad con código anterior de FeriApp.
        localStorage.setItem(STORAGE.legacyName, name);
        localStorage.setItem(STORAGE.legacyRole, role);
    }

    function clearSession() {
        [
            STORAGE.session,
            STORAGE.name,
            STORAGE.role,
            STORAGE.email,
            STORAGE.legacyName,
            STORAGE.legacyRole,
            'fotoferiapp',
            'bioferiapp',
            STORAGE.pendingAction
        ].forEach((key) => localStorage.removeItem(key));
    }

    function sanitizeReturnUrl(value) {
        if (!value) return null;
        let decoded = value;
        try {
            decoded = decodeURIComponent(value);
        } catch (error) {
            return null;
        }

        const allowed = new Set([
            'principal.html',
            'carrito.html',
            'pedidos.html',
            'perfil.html',
            'devoluciones.html',
            'mis_productos.html',
            'admin.html',
            'asesoria.html',
            'logistica.html',
            'contacto.html',
            'soporte.html',
            'proveedores.html'
        ]);

        return allowed.has(decoded) ? decoded : null;
    }

    function getDestination(role, isRegistration) {
        // El registro siempre vuelve al catálogo para evitar rebotes y bloqueos.
        if (isRegistration) return 'principal.html';
        if (role === 'admin') return 'admin.html';
        if (role === 'vendedor') return 'mis_productos.html';
        return 'principal.html';
    }

    function getPendingCartKey() {
        const session = getSession();
        if (!session) return null;
        const identity = session.email || session.name || 'anonimo';
        return `carritoferiapp_${String(identity).toLowerCase().replace(/[^a-z0-9_-]/gi, '_')}`;
    }

    function processPendingCartAction() {
        const raw = localStorage.getItem(STORAGE.pendingAction);
        if (!raw) return null;

        const action = safeParse(raw, null);
        localStorage.removeItem(STORAGE.pendingAction);

        if (!action || action.type !== 'add_to_cart' || !action.productId) return null;

        const inventory = safeParse(localStorage.getItem('catalogo_v3'), []);
        const product = Array.isArray(inventory)
            ? inventory.find((item) => item.id === action.productId)
            : null;

        if (!product) return null;

        const cartKey = getPendingCartKey();
        if (!cartKey) return null;

        const currentCart = safeParse(localStorage.getItem(cartKey), []);
        const cart = Array.isArray(currentCart) ? currentCart : [];
        cart.push({
            id: product.id,
            nombre: product.nombre,
            precio: Number(product.precio) || 0,
            imagen: product.imagen || '',
            categoria: product.categoria || ''
        });
        localStorage.setItem(cartKey, JSON.stringify(cart));

        return 'carrito.html';
    }

    function redirectAfterAuth(role, isRegistration) {
        const params = new URLSearchParams(window.location.search);
        const requested = sanitizeReturnUrl(params.get('return'));
        const pendingDestination = processPendingCartAction();
        const destination = pendingDestination || requested || getDestination(role, isRegistration);
        window.location.replace(destination);
    }

    function validarEdad(fechaStr) {
        if (!fechaStr) {
            return { invalid: true, message: 'Debes seleccionar una fecha.' };
        }

        const nacimiento = new Date(fechaStr + 'T00:00:00');
        if (Number.isNaN(nacimiento.getTime())) {
            return { invalid: true, message: 'La fecha no es válida.' };
        }

        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();
        if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        if (nacimiento > hoy) {
            return { invalid: true, message: 'La fecha no puede estar en el futuro.' };
        }
        if (edad < 18) {
            return { invalid: true, message: 'Debes tener al menos 18 años.' };
        }
        if (edad > 120) {
            return { invalid: true, message: 'Fecha inválida.' };
        }

        return { invalid: false, message: '' };
    }

    function mostrarErrorInline(input, error, mensaje, invalido) {
        if (!input || !error) return invalido;

        if (invalido) {
            error.textContent = '⚠️ ' + mensaje;
            error.style.display = 'block';
            input.style.borderColor = '#d90429';
            input.style.backgroundColor = '#fff0f0';
            input.setAttribute('aria-invalid', 'true');
        } else {
            error.textContent = '✓ Correcto';
            error.style.display = 'block';
            error.style.color = '#34833c';
            error.style.backgroundColor = 'transparent';
            input.style.borderColor = '#34833c';
            input.style.backgroundColor = '#fff';
            input.setAttribute('aria-invalid', 'false');
        }

        return invalido;
    }

    function resetInline(input, error) {
        if (!input || !error) return;
        error.textContent = '';
        error.style.display = 'none';
        error.style.color = '#d90429';
        error.style.backgroundColor = 'transparent';
        input.style.borderColor = '';
        input.style.backgroundColor = '#fff';
        input.setAttribute('aria-invalid', 'false');
    }

    function mostrarErrorGeneral(mensaje, esError) {
        const box = document.getElementById('msg-error');
        if (!box) return;

        box.textContent = mensaje;
        box.style.display = 'block';
        box.style.color = 'white';
        box.style.backgroundColor = esError ? '#d90429' : '#34833c';
        box.style.padding = '10px';
        box.style.borderRadius = '6px';
        box.style.fontWeight = 'bold';
    }

    function ocultarErrorGeneral() {
        const box = document.getElementById('msg-error');
        if (box) {
            box.textContent = '';
            box.style.display = 'none';
        }
    }

    function validarNombre(input, error) {
        const valor = input ? input.value.trim() : '';
        return mostrarErrorInline(
            input,
            error,
            'Solo letras, espacios, apóstrofes o guiones.',
            valor === '' || !REGEX.soloLetras.test(valor)
        );
    }

    function validarDocumento(input, error) {
        const valor = input ? input.value.trim() : '';
        return mostrarErrorInline(
            input,
            error,
            'Debe contener entre 5 y 10 dígitos numéricos.',
            valor === '' || !REGEX.numeros.test(valor) || !REGEX.documento.test(valor)
        );
    }

    function validarCorreo(input, error) {
        const valor = input ? input.value.trim() : '';
        return mostrarErrorInline(
            input,
            error,
            'Correo válido requerido. Usa Gmail, Yahoo, Hotmail, Outlook, Live o Empresa.',
            valor === '' || !REGEX.correoReal.test(valor)
        );
    }

    function validarPassword(input, error) {
        const valor = input ? input.value : '';
        return mostrarErrorInline(
            input,
            error,
            'Mínimo 8 caracteres.',
            valor.length < 8 || !REGEX.password.test(valor)
        );
    }

    function validarRegistroCompleto() {
        const nombre = document.getElementById('inp-nombre');
        const documento = document.getElementById('inp-documento');
        const fecha = document.getElementById('inp-fecha');
        const correo = document.getElementById('inp-correo');
        const pass = document.getElementById('inp-pass');
        const rol = document.getElementById('inp-rol');

        let hayErrores = false;
        hayErrores = validarNombre(nombre, document.getElementById('err-nombre')) || hayErrores;
        hayErrores = validarDocumento(documento, document.getElementById('err-documento')) || hayErrores;

        const edad = validarEdad(fecha ? fecha.value : '');
        hayErrores = mostrarErrorInline(fecha, document.getElementById('err-fecha'), edad.message, edad.invalid) || hayErrores;

        hayErrores = validarCorreo(correo, document.getElementById('err-correo')) || hayErrores;
        hayErrores = validarPassword(pass, document.getElementById('err-pass')) || hayErrores;

        if (!rol || !ROLES_REGISTRO.has(rol.value)) {
            mostrarErrorGeneral('⚠️ Selecciona un tipo de cuenta válido para el registro.', true);
            hayErrores = true;
        }

        return {
            hayErrores,
            nombre,
            documento,
            fecha,
            correo,
            pass,
            rol
        };
    }

    function validarLoginCompleto() {
        const nombre = document.getElementById('inp-nombre');
        const correo = document.getElementById('inp-correo');
        const pass = document.getElementById('inp-pass');
        const rol = document.getElementById('inp-rol');

        let hayErrores = false;
        hayErrores = validarNombre(nombre, document.getElementById('err-nombre')) || hayErrores;
        hayErrores = validarCorreo(correo, document.getElementById('err-correo')) || hayErrores;
        hayErrores = validarPassword(pass, document.getElementById('err-pass')) || hayErrores;

        if (!rol || !ROLES_LOGIN.has(rol.value)) {
            mostrarErrorGeneral('⚠️ Selecciona un rol válido.', true);
            hayErrores = true;
        }

        return { hayErrores, nombre, correo, pass, rol };
    }

    function registrar() {
        const datos = validarRegistroCompleto();
        if (datos.hayErrores) {
            mostrarErrorGeneral('⚠️ Revisa los campos marcados en rojo antes de continuar.', true);
            return;
        }

        // En esta etapa el registro NO se guarda en una base de cuentas.
        // Solo crea una sesión local para poder entrar al sitio inmediatamente.
        const nombre = datos.nombre.value.trim();
        const correo = datos.correo.value.trim().toLowerCase();
        const rol = datos.rol.value;

        saveSession(nombre, correo, rol);
        ocultarErrorGeneral();
        redirectAfterAuth(rol, true);
    }

    function iniciarSesion() {
        const datos = validarLoginCompleto();
        if (datos.hayErrores) {
            mostrarErrorGeneral('⚠️ Revisa los campos marcados en rojo antes de continuar.', true);
            return;
        }

        // Login DEMO: cualquier persona puede iniciar sesión si completa correctamente
        // las validaciones. Todavía no se consulta ni se guarda una cuenta.
        const nombre = datos.nombre.value.trim();
        const correo = datos.correo.value.trim().toLowerCase();
        const rol = datos.rol.value;

        saveSession(nombre, correo, rol);
        ocultarErrorGeneral();
        redirectAfterAuth(rol, false);
    }

    function togglePassword() {
        const input = document.getElementById('inp-pass');
        const button = document.getElementById('btn-ojo-pass');
        if (!input || !button) return;

        const shouldShow = input.type === 'password';
        input.type = shouldShow ? 'text' : 'password';
        button.textContent = shouldShow ? '🙈' : '👁️';
        button.setAttribute('aria-label', shouldShow ? 'Ocultar contraseña' : 'Mostrar contraseña');
        button.setAttribute('title', shouldShow ? 'Ocultar contraseña' : 'Mostrar contraseña');
    }

    function prepararValidacionEnTiempoReal() {
        const nombre = document.getElementById('inp-nombre');
        const documento = document.getElementById('inp-documento');
        const fecha = document.getElementById('inp-fecha');
        const correo = document.getElementById('inp-correo');
        const pass = document.getElementById('inp-pass');

        const touched = new WeakSet();

        function activar(input, callback) {
            if (!input) return;

            input.addEventListener('input', function () {
                touched.add(input);
                callback();
                ocultarErrorGeneral();
            });

            input.addEventListener('blur', function () {
                touched.add(input);
                callback();
            });
        }

        activar(nombre, () => validarNombre(nombre, document.getElementById('err-nombre')));
        activar(documento, () => validarDocumento(documento, document.getElementById('err-documento')));
        activar(correo, () => validarCorreo(correo, document.getElementById('err-correo')));
        activar(pass, () => validarPassword(pass, document.getElementById('err-pass')));

        if (fecha) {
            fecha.addEventListener('change', function () {
                touched.add(fecha);
                const resultado = validarEdad(fecha.value);
                mostrarErrorInline(fecha, document.getElementById('err-fecha'), resultado.message, resultado.invalid);
                ocultarErrorGeneral();
            });
            fecha.addEventListener('blur', function () {
                touched.add(fecha);
                const resultado = validarEdad(fecha.value);
                mostrarErrorInline(fecha, document.getElementById('err-fecha'), resultado.message, resultado.invalid);
            });
        }

        // Mantener el formulario limpio al abrir la página: los mensajes aparecen
        // cuando el usuario empieza a escribir o sale del campo.
        void touched;
    }

    function init() {
        const form = document.querySelector('.form-auth');
        const button = document.getElementById('btn-accion-auth');
        const eye = document.getElementById('btn-ojo-pass');
        const isRegistration = Boolean(document.getElementById('inp-documento'));

        if (eye) eye.addEventListener('click', togglePassword);
        prepararValidacionEnTiempoReal();

        if (!form || !button) return;

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            button.disabled = true;
            button.style.opacity = '0.7';

            try {
                if (isRegistration) {
                    registrar();
                } else {
                    iniciarSesion();
                }
            } finally {
                // Si hay redirección, la página se descarga. Si hay errores,
                // el botón vuelve a quedar disponible para otro intento.
                setTimeout(function () {
                    if (document.body.contains(button)) {
                        button.disabled = false;
                        button.style.opacity = '1';
                    }
                }, 350);
            }
        });
    }

    window.togglePassword = togglePassword;

    window.FeriAppAuth = {
        getSession,
        saveSession,
        clearSession,
        validarEdad,
        redirectAfterAuth
    };

    document.addEventListener('DOMContentLoaded', init);
})();
