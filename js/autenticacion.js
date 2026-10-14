// FeriApp - Equipo GAES 3 - SENA ADSO - Ficha 3478080
// Alineado con el documento de arquitectura V3 y los casos de uso aprobados.

/* ====================================================================
   FeriApp | AUTENTICACIÓN DEMOSTRATIVA CON USUARIOS EN localStorage
   --------------------------------------------------------------------
   - Requiere js/datos.js cargado antes (FeriUsuarios: lectura, hash y cuentas demo).
   - Registro: crea el usuario en feriapp_usuarios_bd y abre sesión. Solo rol "comprador".
   - Login: busca por correo y contraseña; rechaza cuentas inexistentes o inactivas.
   - Las cuentas de vendedor y admin las gestiona el administrador (panel admin.html).
   - Es una demo realista, NO autenticación real: en producción esto va en el servidor.
   ==================================================================== */
(function () {
    'use strict';

    // Expresiones regulares de validación (se mantienen las del prototipo anterior)
    const REGEX = {
        soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/,
        correoReal: /^[a-zA-Z0-9._-]+@(gmail|yahoo|hotmail|outlook|live|empresa)\.[a-zA-Z]{2,}$/,
        numeros: /^\d+$/,
        documento: /^\d{5,10}$/,
        password: /.{8,}/
    };

    // Reglas de contraseña del registro (se muestran como checklist en registro.html).
    const REGLAS_PASSWORD = [
        { id: 'len', ok: v => v.length >= 8 },
        { id: 'may', ok: v => /[A-Z]/.test(v) },
        { id: 'min', ok: v => /[a-z]/.test(v) },
        { id: 'num', ok: v => /[0-9]/.test(v) },
        { id: 'esp', ok: v => /[!@#$%^&*()_+\-=\[\]{};:,.<>?]/.test(v) }
    ];
    // ¿Estamos en la página de registro? (la regla estricta solo se exige al crear la cuenta).
    const esRegistro = () => Boolean(document.getElementById('inp-documento'));
    // Marca en verde (☑) o gris (☐) cada requisito del checklist según lo escrito.
    function actualizarChecklist(valor) {
        REGLAS_PASSWORD.forEach(r => {
            const li = document.querySelector(`#checklist-pass [data-regla="${r.id}"]`);
            if (!li) return;
            const cumple = r.ok(valor);
            li.firstElementChild.textContent = cumple ? '☑' : '☐';
            li.style.color = cumple ? '#34833c' : '#666';
            li.style.fontWeight = cumple ? 'bold' : 'normal';
        });
    }

    // Desde registro.html solo se puede crear una cuenta de comprador.
    const ROL_AUTO_REGISTRO = 'comprador';
    // Nombre del campo de la contraseña cifrada en cada usuario.
    const CAMPO_CLAVE = 'contraseña_hash';

    // Claves de localStorage de la sesión (compatibles con principal.js y datos.js)
    const STORAGE = {
        session: 'sesion_activa',
        name: 'nombreferiapp',
        role: 'rolferiapp',
        email: 'correoferiapp',
        userId: 'usuario_id',
        legacyName: 'usuario_nombre',
        legacyRole: 'usuario_rol',
        pendingAction: 'feriapp_accion_pendiente'
    };

    // Convierte la contraseña con btoa() (base64).
    // NOTA: btoa NO es cifrado seguro; en producción usar bcrypt o similar en el servidor.
    function hashClave(texto) {
        return FeriUsuarios.hash(texto);
    }

    // Convierte texto JSON en objeto; si está dañado devuelve el valor por defecto.
    function safeParse(value, fallback) {
        try {
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.warn('FeriApp: dato local inválido.', error);
            return fallback;
        }
    }

    // Devuelve la sesión guardada o null si no hay sesión activa.
    function getSession() {
        const active = localStorage.getItem(STORAGE.session) === 'true';
        const role = localStorage.getItem(STORAGE.role) || localStorage.getItem(STORAGE.legacyRole);
        const name = localStorage.getItem(STORAGE.name) || localStorage.getItem(STORAGE.legacyName) || 'Usuario';
        const email = localStorage.getItem(STORAGE.email) || '';
        const userId = localStorage.getItem(STORAGE.userId) || '';
        if (!active || !role) return null;
        return { active: true, role, name, email, userId };
    }

    // Guarda la sesión de un usuario (objeto de feriapp_usuarios_bd).
    function saveSession(usuario) {
        localStorage.setItem(STORAGE.session, 'true');
        localStorage.setItem(STORAGE.userId, String(usuario.id));
        localStorage.setItem(STORAGE.name, usuario.nombre);
        localStorage.setItem(STORAGE.role, usuario.rol);
        localStorage.setItem(STORAGE.email, usuario.correo || '');
        // Compatibilidad con claves anteriores de FeriApp.
        localStorage.setItem(STORAGE.legacyName, usuario.nombre);
        localStorage.setItem(STORAGE.legacyRole, usuario.rol);
    }

    // Borra las claves de sesión.
    function clearSession() {
        [STORAGE.session, STORAGE.userId, STORAGE.name, STORAGE.role, STORAGE.email, STORAGE.legacyName,
            STORAGE.legacyRole, 'fotoferiapp', 'bioferiapp', STORAGE.pendingAction
        ].forEach((key) => localStorage.removeItem(key));
    }

    // Acepta solo destinos internos conocidos en el parámetro ?return= (evita redirecciones abiertas).
    function sanitizeReturnUrl(value) {
        if (!value) return null;
        let decoded = value;
        try {
            decoded = decodeURIComponent(value);
        } catch (error) {
            return null;
        }
        const allowed = new Set([
            '../index.html', 'catalogo.html', 'mapa.html', 'pedidos.html', 'perfil.html', 'devoluciones.html',
            'mis_productos.html', 'admin.html', 'asesoria.html', 'logistica.html', 'contacto.html',
            'soporte.html', 'proveedores.html'
        ]);
        return allowed.has(decoded) ? decoded : null;
    }

    // Página de destino por defecto según el rol.
    function getDestination(role, isRegistration) {
        if (isRegistration) return '../index.html';
        if (role === 'admin') return 'admin.html';
        if (role === 'vendedor') return 'mis_productos.html';
        return '../index.html';
    }

    // Redirige después de autenticarse: primero la página pedida (?return=), si no el destino por rol.
    function redirectAfterAuth(role, isRegistration) {
        const params = new URLSearchParams(window.location.search);
        const requested = sanitizeReturnUrl(params.get('return'));
        // Un comprador no debe aterrizar en paneles de otro rol.
        const panelAjeno = (requested === 'admin.html' && role !== 'admin') || (requested === 'mis_productos.html' && role !== 'vendedor');
        window.location.replace(!requested || panelAjeno ? getDestination(role, isRegistration) : requested);
    }

    // Valida la fecha de nacimiento: obligatoria, no futura y edad entre 18 y 120.
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

    // Muestra el error (rojo) o el visto bueno (verde) debajo de un campo. Devuelve si es inválido.
    function mostrarErrorInline(input, error, mensaje, invalido) {
        if (!input || !error) return invalido;
        if (invalido) {
            error.textContent = '⚠️ ' + mensaje;
            error.style.display = 'block';
            error.style.color = '#d90429';
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

    // Muestra el mensaje general del formulario (rojo si es error, verde si no).
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

    // Oculta el mensaje general del formulario.
    function ocultarErrorGeneral() {
        const box = document.getElementById('msg-error');
        if (box) {
            box.textContent = '';
            box.style.display = 'none';
        }
    }

    // Valida el nombre: solo letras, espacios, apóstrofes o guiones.
    function validarNombre(input, error) {
        const valor = input ? input.value.trim() : '';
        return mostrarErrorInline(input, error, 'Solo letras, espacios, apóstrofes o guiones.',
            valor === '' || !REGEX.soloLetras.test(valor));
    }

    // Valida el documento: entre 5 y 10 dígitos numéricos.
    function validarDocumento(input, error) {
        const valor = input ? input.value.trim() : '';
        return mostrarErrorInline(input, error, 'Debe contener entre 5 y 10 dígitos numéricos.',
            valor === '' || !REGEX.numeros.test(valor) || !REGEX.documento.test(valor));
    }

    // Valida el correo: debe ser de un proveedor real (Gmail, Yahoo, Hotmail, Outlook, Live o Empresa).
    function validarCorreo(input, error) {
        const valor = input ? input.value.trim() : '';
        return mostrarErrorInline(input, error, 'Correo válido requerido. Usa Gmail, Yahoo, Hotmail, Outlook, Live o Empresa.',
            valor === '' || !REGEX.correoReal.test(valor));
    }

    // Valida la contraseña. En el registro exige 8+ caracteres, mayúscula, minúscula, número y carácter especial;
    // en el login solo revisa el mínimo de 8 para no bloquear cuentas creadas antes de esta regla.
    function validarPassword(input, error) {
        const valor = input ? input.value : '';
        if (esRegistro()) {
            return mostrarErrorInline(input, error, 'La contraseña debe cumplir todos los requisitos de la lista.',
                !REGLAS_PASSWORD.every(r => r.ok(valor)));
        }
        return mostrarErrorInline(input, error, 'Mínimo 8 caracteres.',
            valor.length < 8 || !REGEX.password.test(valor));
    }

    // Valida todos los campos de registro (nombre, documento, edad, correo, contraseña).
    function validarRegistroCompleto() {
        const nombre = document.getElementById('inp-nombre');
        const documento = document.getElementById('inp-documento');
        const fecha = document.getElementById('inp-fecha');
        const correo = document.getElementById('inp-correo');
        const pass = document.getElementById('inp-pass');

        let hayErrores = false;
        hayErrores = validarNombre(nombre, document.getElementById('err-nombre')) || hayErrores;
        hayErrores = validarDocumento(documento, document.getElementById('err-documento')) || hayErrores;
        const edad = validarEdad(fecha ? fecha.value : '');
        hayErrores = mostrarErrorInline(fecha, document.getElementById('err-fecha'), edad.message, edad.invalid) || hayErrores;
        hayErrores = validarCorreo(correo, document.getElementById('err-correo')) || hayErrores;
        hayErrores = validarPassword(pass, document.getElementById('err-pass')) || hayErrores;

        return { hayErrores, nombre, documento, fecha, correo, pass };
    }

    // Valida los campos de login (correo y contraseña).
    function validarLoginCompleto() {
        const correo = document.getElementById('inp-correo');
        const pass = document.getElementById('inp-pass');

        let hayErrores = false;
        hayErrores = validarCorreo(correo, document.getElementById('err-correo')) || hayErrores;
        hayErrores = validarPassword(pass, document.getElementById('err-pass')) || hayErrores;

        return { hayErrores, correo, pass };
    }

    // Registro: crea el usuario en feriapp_usuarios_bd (siempre como comprador) y abre sesión.
    function registrar() {
        const datos = validarRegistroCompleto();
        if (datos.hayErrores) {
            mostrarErrorGeneral('⚠️ Revisa los campos marcados en rojo antes de continuar.', true);
            return;
        }

        const correo = datos.correo.value.trim().toLowerCase();
        if (FeriUsuarios.buscarPorCorreo(correo)) {
            mostrarErrorGeneral('⚠️ Ya existe una cuenta con ese correo. Inicia sesión.', true);
            return;
        }

        // El rol NO se toma del formulario: vendedor y admin no pueden auto-registrarse.
        const usuarios = FeriUsuarios.leer();
        const usuario = {
            id: FeriUsuarios.siguienteId(),
            nombre: datos.nombre.value.trim(),
            correo: correo,
            [CAMPO_CLAVE]: hashClave(datos.pass.value),
            rol: ROL_AUTO_REGISTRO,
            estado: 'activo',
            fecha_registro: new Date().toISOString()
        };
        usuarios.push(usuario);
        if (!FeriUsuarios.guardar(usuarios)) {
            mostrarErrorGeneral('⚠️ No se pudo guardar la cuenta en este navegador.', true);
            return;
        }

        saveSession(usuario);
        ocultarErrorGeneral();
        redirectAfterAuth(usuario.rol, true);
    }

    // Login: busca el usuario por correo y contraseña, valida su estado y crea la sesión.
    function iniciarSesion() {
        const datos = validarLoginCompleto();
        if (datos.hayErrores) {
            mostrarErrorGeneral('⚠️ Revisa los campos marcados en rojo antes de continuar.', true);
            return;
        }

        const usuario = FeriUsuarios.buscarPorCorreo(datos.correo.value);
        if (!usuario) {
            mostrarErrorGeneral('⚠️ Usuario no registrado.', true);
            return;
        }
        if (usuario[CAMPO_CLAVE] !== hashClave(datos.pass.value)) {
            mostrarErrorGeneral('⚠️ Contraseña incorrecta.', true);
            return;
        }
        if (usuario.estado === 'inactivo') {
            mostrarErrorGeneral('⚠️ Cuenta inactiva. Comunícate con el administrador.', true);
            return;
        }

        saveSession(usuario);
        ocultarErrorGeneral();
        redirectAfterAuth(usuario.rol, false);
    }

    // Muestra u oculta la contraseña (botón del ojo).
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

    // Activa la validación en tiempo real (al escribir y al salir de cada campo).
    function prepararValidacionEnTiempoReal() {
        const nombre = document.getElementById('inp-nombre');
        const documento = document.getElementById('inp-documento');
        const fecha = document.getElementById('inp-fecha');
        const correo = document.getElementById('inp-correo');
        const pass = document.getElementById('inp-pass');

        function activar(input, callback) {
            if (!input) return;
            input.addEventListener('input', function () { callback(); ocultarErrorGeneral(); });
            input.addEventListener('blur', callback);
        }

        activar(nombre, () => validarNombre(nombre, document.getElementById('err-nombre')));
        activar(documento, () => validarDocumento(documento, document.getElementById('err-documento')));
        activar(correo, () => validarCorreo(correo, document.getElementById('err-correo')));
        activar(pass, () => { actualizarChecklist(pass.value); validarPassword(pass, document.getElementById('err-pass')); });

        if (fecha) {
            const revisarFecha = () => {
                const r = validarEdad(fecha.value);
                mostrarErrorInline(fecha, document.getElementById('err-fecha'), r.message, r.invalid);
            };
            fecha.addEventListener('change', function () { revisarFecha(); ocultarErrorGeneral(); });
            fecha.addEventListener('blur', revisarFecha);
        }
    }

    // Arranque: conecta el ojo, la validación y el envío del formulario (registro o login según la página).
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
                if (isRegistration) registrar(); else iniciarSesion();
            } finally {
                // Si hubo errores el botón vuelve a quedar disponible para otro intento.
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
    window.FeriAppAuth = { getSession, saveSession, clearSession, validarEdad, redirectAfterAuth };

    document.addEventListener('DOMContentLoaded', init);
})();
