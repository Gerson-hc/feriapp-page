// FeriApp - Equipo GAES 3 - SENA ADSO - Ficha 3478080
// Alineado con el documento de arquitectura V3 y los casos de uso aprobados.
// FeriApp - datos de ejemplo compartidos por el mapa y el catálogo.
// Son los mismos INSERT del script SQL (Anexo A del documento de arquitectura).
// Cuando exista la API REST, estas listas se reemplazan por consultas a la base de datos.
const categorias = { 1: 'Frutas', 2: 'Verduras', 3: 'Lácteos y derivados', 4: 'Tubérculos', 5: 'Hierbas aromáticas' };
const iconosCategoria = { 1: '🍎', 2: '🥬', 3: '🧀', 4: '🥔', 5: '🌿' };

const plazas = [
    { id: 1, nombre: 'Plaza de Mercado La Perseverancia', localidad: 'Santa Fe' },
    { id: 2, nombre: 'Plaza de Mercado Quirigua', localidad: 'Engativá' }
];
const productores = { 1: 'Frutas Don Carlos', 2: 'Verduras La Huerta', 3: 'Lácteos Torres' };
const locales = [
    { id: 1, plaza: 1, productor: 1, codigo: 'A-01', nombre: 'Frutas Don Carlos', x: 1, y: 1, estado: 'abierto', calif: [4] },
    { id: 2, plaza: 1, productor: 2, codigo: 'A-02', nombre: 'Verduras La Huerta', x: 2, y: 1, estado: 'abierto', calif: [5] },
    { id: 3, plaza: 1, productor: 3, codigo: 'B-01', nombre: 'Lácteos Torres', x: 1, y: 2, estado: 'abierto', calif: [5] },
    { id: 4, plaza: 1, productor: null, codigo: 'B-02', nombre: 'Local disponible B-02', x: 2, y: 2, estado: 'disponible', calif: [] },
    { id: 5, plaza: 2, productor: 2, codigo: 'C-05', nombre: 'Verduras La Huerta Quirigua', x: 3, y: 1, estado: 'cerrado', calif: [] }
];
// producto: local, cat (categoria), u (unidad de medida), cant (existencias), min (stock mínimo), calif (puntajes)
const productos = [
    { id: 1, local: 1, cat: 1, nombre: 'Mango Tommy', u: 'kg', precio: 6500, cant: 40, min: 10, activo: 1, fecha: '2026-10-01T08:00:00', calif: [4] },
    { id: 2, local: 1, cat: 1, nombre: 'Banano', u: 'kg', precio: 3200, cant: 60, min: 15, activo: 1, fecha: '2026-10-01T08:00:00', calif: [] },
    { id: 3, local: 1, cat: 1, nombre: 'Mora de Castilla', u: 'libra', precio: 4500, cant: 8, min: 10, activo: 1, fecha: '2026-10-01T08:00:00', calif: [] },
    { id: 4, local: 2, cat: 2, nombre: 'Tomate chonto', u: 'kg', precio: 3800, cant: 50, min: 10, activo: 1, fecha: '2026-10-01T08:00:00', calif: [5] },
    { id: 5, local: 2, cat: 2, nombre: 'Cebolla larga', u: 'atado', precio: 2500, cant: 30, min: 10, activo: 1, fecha: '2026-10-01T08:00:00', calif: [] },
    { id: 6, local: 2, cat: 4, nombre: 'Papa pastusa', u: 'kg', precio: 2800, cant: 120, min: 30, activo: 1, fecha: '2026-10-01T08:00:00', calif: [] },
    { id: 7, local: 2, cat: 5, nombre: 'Cilantro', u: 'atado', precio: 1000, cant: 25, min: 10, activo: 1, fecha: '2026-10-01T08:00:00', calif: [] },
    { id: 8, local: 3, cat: 3, nombre: 'Queso campesino', u: 'libra', precio: 11000, cant: 20, min: 5, activo: 1, fecha: '2026-10-01T08:00:00', calif: [5] },
    { id: 9, local: 3, cat: 3, nombre: 'Cuajada', u: 'libra', precio: 9000, cant: 12, min: 5, activo: 1, fecha: '2026-10-01T08:00:00', calif: [4] },
    { id: 10, local: 5, cat: 2, nombre: 'Zanahoria', u: 'kg', precio: 2600, cant: 35, min: 10, activo: 1, fecha: '2026-10-01T08:00:00', calif: [] }
];

// Almacenamiento del prototipo (localStorage). En producción: tablas venta, detalle_venta e inventario.
const FeriStore = {
    // Lee y convierte a objeto un valor de localStorage (devuelve `defecto` si no existe o está dañado).
    leer(clave, defecto) {
        try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : defecto; } catch (e) { return defecto; }
    },
    // Guarda un valor como JSON en localStorage; devuelve false si falla (por ejemplo, almacenamiento lleno).
    guardar(clave, valor) {
        try { localStorage.setItem(clave, JSON.stringify(valor)); return true; } catch (e) { return false; }
    }
};

// Formatea una cantidad con coma decimal (1.5 → "1,5").
const fmtCant = n => String(Math.round(n * 100) / 100).replace('.', ',');

/* =====================================================================
   REGLAS DE INVENTARIO  (tabla inventario: relación 1 a 1 con producto)
   1. cantidad = existencias actuales y nunca puede ser negativa.
      stock_minimo = umbral para alertar la reposición.
   2. Estado del stock:  agotado (cantidad = 0) · bajo (0 < cantidad < stock_minimo) · disponible.
   3. Unidades de venta: kg y libra admiten medias (paso 0,5); atado, unidad y demás, solo enteros.
   4. Una venta se registra solo si TODAS sus líneas caben en las existencias; entonces se
      descuentan juntas (todo o nada). Así nunca se vende más de lo que hay (RNF-03).
   5. Las existencias se descuentan al confirmar la venta (estado "registrada"). Marcarla
      "lista" o "entregada" no cambia el inventario.
   6. Si la venta se cancela antes de entregarla, sus cantidades regresan al inventario.
      Una venta "entregada" no se puede cancelar.
   7. Todo cambio (venta, cancelación o ajuste del productor) actualiza fecha_actualizacion.
   ===================================================================== */
const Inventario = {
    // ÚNICA fuente de verdad del salto de cantidad: kg y libra → 0,5; atado, unidad y demás → 1.
    paso(unidad) { return (unidad === 'kg' || unidad === 'libra') ? 0.5 : 1; },
    // Estado del stock de un producto: agotado, bajo o disponible.
    estado(p) { return p.cant <= 0 ? 'agotado' : (p.cant < p.min ? 'bajo' : 'disponible'); },

    // Valida cantidad > 0, múltiplo del paso de la unidad y dentro de las existencias.
    validar(p, cantidad, yaEnPedido = 0) {
        if (!(cantidad > 0)) return { ok: false, msg: 'Indica una cantidad mayor que cero.' };
        const paso = this.paso(p.u), n = cantidad / paso;
        if (Math.abs(n - Math.round(n)) > 1e-9) {
            return { ok: false, msg: paso === 1 ? `${p.nombre} se vende por ${p.u} completo (cantidades enteras).` : `${p.nombre} se vende en múltiplos de 0,5 ${p.u}.` };
        }
        if (cantidad + yaEnPedido > p.cant + 1e-9) {
            return { ok: false, msg: p.cant <= 0 ? `${p.nombre} está agotado.` : `Solo hay ${fmtCant(p.cant)} ${p.u} de ${p.nombre.toLowerCase()} disponibles.` };
        }
        return { ok: true };
    },

    // Guarda en localStorage el estado editable de cada producto: existencias, fecha, precio y activo/baneado.
    _guardar() {
        const mapa = {};
        productos.forEach(p => { mapa[p.id] = { cant: p.cant, fecha: p.fecha, precio: p.precio, activo: p.activo, baneado: p.baneado || 0 }; });
        return FeriStore.guardar('feriapp_inventario', mapa);
    },
    // Lee lo guardado y lo aplica sobre la lista base `productos` (acepta el formato anterior, solo número).
    _cargar() {
        const g = FeriStore.leer('feriapp_inventario', {});
        productos.forEach(p => {
            p.baneado = p.baneado || 0;
            const v = g[p.id];
            if (v === undefined) return;
            if (typeof v === 'number') { p.cant = v; return; }
            p.cant = v.cant; p.fecha = v.fecha || p.fecha;
            if (typeof v.precio === 'number' && v.precio > 0) p.precio = v.precio;
            if (v.activo !== undefined) p.activo = v.activo;
            p.baneado = v.baneado || 0;
        });
    },

    // Valida todas las líneas y descuenta existencias todo o nada (se guarda con _guardar()).
    descontar(lineas) {
        for (const l of lineas) {
            const p = productos.find(x => x.id === l.id), r = this.validar(p, l.cant);
            if (!r.ok) return r;
        }
        const antes = productos.map(p => [p, p.cant, p.fecha]);
        const ahora = new Date().toISOString();
        lineas.forEach(l => { const p = productos.find(x => x.id === l.id); p.cant = Math.round((p.cant - l.cant) * 100) / 100; p.fecha = ahora; });
        if (!this._guardar()) { antes.forEach(([p, c, f]) => { p.cant = c; p.fecha = f; }); return { ok: false, msg: 'No se pudo actualizar el inventario.' }; }
        return { ok: true };
    },

    // Cancela una venta no entregada y devuelve sus cantidades al inventario.
    cancelarVenta(idVenta) {
        const ventas = FeriStore.leer('feriapp_ventas', []);
        const v = ventas.find(x => x.id === idVenta);
        if (!v) return { ok: false, msg: 'La venta no existe.' };
        if (v.estado === 'entregada') return { ok: false, msg: 'Una venta entregada no se puede cancelar.' };
        if (v.estado === 'cancelada') return { ok: false, msg: 'La venta ya estaba cancelada.' };
        const ahora = new Date().toISOString();
        v.detalle.forEach(d => { const p = productos.find(x => x.id === d.producto); p.cant = Math.round((p.cant + d.cantidad) * 100) / 100; p.fecha = ahora; });
        v.estado = 'cancelada';
        this._guardar(); FeriStore.guardar('feriapp_ventas', ventas);
        return { ok: true };
    }
};
Inventario._cargar();

// Códigos de descuento vigentes (CU-22). porcentaje = % que se resta al subtotal del pedido.
const descuentos = [
    { codigo: 'FERIAPP10', porcentaje: 10 },
    { codigo: 'BIENVENIDO', porcentaje: 5 },
    { codigo: 'MERCADO20', porcentaje: 20 }
];
// Busca un código de descuento (sin distinguir mayúsculas); devuelve null si no existe.
const buscarDescuento = codigo => descuentos.find(d => d.codigo === String(codigo || '').trim().toUpperCase()) || null;

// Sesión del prototipo (mismas claves que usa el login existente)
const FeriSesion = {
    // Sesión activa { rol, id, correo, nombre } o null si es visitante.
    actual() {
        try {
            const activa = localStorage.getItem('sesion_activa') === 'true';
            const rol = localStorage.getItem('rolferiapp') || localStorage.getItem('usuario_rol');
            if (!activa || !rol) return null;
            return { rol, id: localStorage.getItem('usuario_id') || '', correo: localStorage.getItem('correoferiapp') || '', nombre: localStorage.getItem('nombreferiapp') || localStorage.getItem('usuario_nombre') || '' };
        } catch (e) { return null; }
    },
    // Borra las claves de sesión de localStorage.
    cerrar() {
        ['sesion_activa', 'rolferiapp', 'nombreferiapp', 'correoferiapp', 'usuario_id', 'usuario_nombre', 'usuario_rol', 'fotoferiapp', 'bioferiapp', 'feriapp_accion_pendiente']
            .forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
    }
};

/* =====================================================================
   USUARIOS DEL PROTOTIPO  (tabla usuario: id, nombre, correo, contraseña, rol, estado, fecha_registro)
   Se guardan en localStorage bajo la clave feriapp_usuarios_bd. Es una demo: no hay autenticación real.
   Campo extra solo para vendedores: productor = id del productor dueño de los locales/productos que gestiona.
   ===================================================================== */
const FeriUsuarios = {
    CLAVE: 'feriapp_usuarios_bd',
    // Convierte la contraseña a base64 (texto ofuscado, NO es seguro). En producción usar bcrypt o similar.
    hash(texto) { return btoa(String.fromCharCode(...new TextEncoder().encode(String(texto)))); },
    // Devuelve la lista de usuarios guardada (siempre un arreglo).
    leer() { const l = FeriStore.leer(this.CLAVE, []); return Array.isArray(l) ? l : []; },
    // Guarda la lista completa de usuarios.
    guardar(lista) { return FeriStore.guardar(this.CLAVE, lista); },
    // Busca un usuario por correo (sin distinguir mayúsculas).
    buscarPorCorreo(correo) { const c = String(correo || '').trim().toLowerCase(); return this.leer().find(u => u.correo === c) || null; },
    // Busca un usuario por id (se compara como texto).
    buscarPorId(id) { return this.leer().find(u => String(u.id) === String(id)) || null; },
    // Genera el siguiente id consecutivo con formato U1, U2, U3…
    siguienteId() {
        const n = this.leer().reduce((m, u) => { const k = parseInt(String(u.id).replace(/\D/g, ''), 10); return Math.max(m, isNaN(k) ? 0 : k); }, 0);
        return 'U' + (n + 1);
    },
    // Si no hay usuarios, crea las cuentas de demostración (administrador, tres productores y un cliente).
    sembrar() {
        const ahora = new Date().toISOString();
        const demo = [
            { id: 'U1', nombre: 'Administrador FeriApp', correo: 'admin@empresa.com', clave: 'Admin2026!', rol: 'admin', productor: null },
            { id: 'U2', nombre: 'Frutas Don Carlos', correo: 'carlos@empresa.com', clave: 'Productor2026#', rol: 'vendedor', productor: 1 },
            { id: 'U3', nombre: 'Verduras La Huerta', correo: 'huerta@empresa.com', clave: 'Productor2026#', rol: 'vendedor', productor: 2 },
            { id: 'U4', nombre: 'Lácteos Torres', correo: 'torres@empresa.com', clave: 'Productor2026#', rol: 'vendedor', productor: 3 },
            { id: 'U5', nombre: 'Cliente Demo', correo: 'cliente@gmail.com', clave: 'Cliente2026*', rol: 'comprador', productor: null }
        ];
        const lista = this.leer();
        if (lista.length) {
            // Navegadores con cuentas demo antiguas: se actualiza solo la contraseña (una vez) para cumplir la regla estricta.
            if (localStorage.getItem('feriapp_seed_v') !== '2') {
                demo.forEach(d => { const u = lista.find(x => x.correo === d.correo); if (u) u['contraseña_hash'] = this.hash(d.clave); });
                this.guardar(lista); localStorage.setItem('feriapp_seed_v', '2');
            }
            return;
        }
        localStorage.setItem('feriapp_seed_v', '2');
        this.guardar(demo.map(d => ({
            id: d.id, nombre: d.nombre, correo: d.correo, 'contraseña_hash': this.hash(d.clave),
            rol: d.rol, estado: 'activo', fecha_registro: ahora, productor: d.productor
        })));
    }
};
FeriUsuarios.sembrar();

/* =====================================================================
   RECIBO DE VENTA  (CU-23 Generar recibo)
   El recibo es un HTML imprimible que se guarda como texto en feriapp_recibos (arreglo de { venta, fecha, html }).
   ===================================================================== */
const FeriRecibo = {
    CLAVE: 'feriapp_recibos',
    // Escapa texto para insertarlo de forma segura dentro del HTML del recibo.
    _esc(v) { return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); },
    // Construye el HTML completo del recibo a partir de una venta (con sus líneas de detalle).
    construir(venta) {
        const e = v => this._esc(v), cop = n => '$' + Math.round(n).toLocaleString('es-CO');
        const l = locales.find(x => x.id === venta.local) || {}, pz = plazas.find(x => x.id === l.plaza) || {};
        const vendedor = l.productor ? productores[l.productor] : '—';
        const filas = venta.detalle.map(d => {
            const p = productos.find(x => x.id === d.producto) || { nombre: 'Producto #' + d.producto, u: '' };
            return `<tr><td>${e(p.nombre)}</td><td class="num">${fmtCant(d.cantidad)} ${e(p.u)}</td><td class="num">${cop(d.precio_unitario)}</td><td class="num">${cop(d.subtotal)}</td></tr>`;
        }).join('');
        const subtotal = venta.detalle.reduce((s, d) => s + d.subtotal, 0), descuento = Number(venta.descuento) || 0;
        const fecha = new Date(venta.fecha).toLocaleString('es-CO');
        const metodoTxt = { presencial: 'Presencial en el local', virtual: 'Virtual (PSE)' }[venta.metodo_pago] || 'Presencial en el local';
        return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Recibo de venta #${e(venta.id)} - FeriApp</title>
<style>
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#FAF6EF;color:#23281F;margin:0;padding:24px}
.recibo{max-width:640px;margin:0 auto;background:#fff;border:1px solid #E3DED2;border-radius:12px;padding:32px}
h1{color:#1B4332;margin:0}.sub{color:#5C6660;margin:4px 0 20px}
.meta{width:100%;border-collapse:collapse;margin-bottom:20px}.meta td{padding:4px 0;vertical-align:top}.meta td:first-child{color:#5C6660;width:38%}
table.det{width:100%;border-collapse:collapse}.det th{background:#1B4332;color:#fff;text-align:left;padding:8px}
.det td{padding:8px;border-bottom:1px solid #E3DED2}.num{text-align:right}
.tot{margin-top:16px;margin-left:auto;width:60%}.tot div{display:flex;justify-content:space-between;padding:4px 0}
.tot .gran{font-size:1.2rem;font-weight:bold;border-top:2px solid #1B4332;margin-top:6px;padding-top:8px;color:#1B4332}
.nota{color:#5C6660;font-size:.8rem;margin-top:24px}
button{margin-top:20px;background:#BC6C25;color:#fff;border:0;border-radius:6px;padding:10px 18px;font-weight:bold;cursor:pointer}
.barra{max-width:640px;margin:0 auto 16px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.barra .logo{color:#1B4332;font-weight:bold;font-size:1.5rem;text-decoration:none}
button.sec{background:#1B4332;margin-top:0}.acciones{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}.acciones button{margin-top:0}
@media print{body{background:#fff;padding:0}.recibo{border:0}.no-imprimir{display:none}}
</style></head><body>
<div class="barra no-imprimir"><a class="logo" href="../index.html">FeriApp</a><span style="display:flex;gap:8px">
<button class="sec" onclick="if(window.history.length>1){window.history.back()}else{window.location.href='catalogo.html'}">← volver al catálogo</button>
<button class="sec" onclick="window.close()">✕ cerrar</button></span></div>
<div class="recibo">
<h1>FeriApp</h1><p class="sub">Recibo de venta</p>
<table class="meta">
<tr><td>Número de venta</td><td><strong>#${e(venta.id)}</strong></td></tr>
<tr><td>Fecha</td><td>${e(fecha)}</td></tr>
${venta.cliente_nombre ? `<tr><td>Cliente</td><td>${e(venta.cliente_nombre)}</td></tr>` : ''}
<tr><td>Local</td><td>${e(l.codigo || '')} · ${e(l.nombre || '')}${pz.nombre ? '<br>' + e(pz.nombre) : ''}</td></tr>
<tr><td>Vendedor</td><td>${e(vendedor)}</td></tr>
<tr><td>Método de pago</td><td>${e(metodoTxt)}</td></tr>
</table>
<table class="det"><thead><tr><th>Producto</th><th class="num">Cantidad</th><th class="num">Precio unit.</th><th class="num">Subtotal</th></tr></thead><tbody>${filas}</tbody></table>
<div class="tot">
<div><span>Subtotal</span><span>${cop(subtotal)}</span></div>
${descuento > 0 ? `<div><span>Descuento:</span><span>-${cop(descuento)}</span></div>` : ''}
<div class="gran"><span>Total</span><span>${cop(venta.total)}</span></div>
</div>
<p class="nota">Presenta este número de venta en el local para recoger tu pedido. FeriApp no ofrece financiación de productos.</p>
<div class="acciones no-imprimir"><button onclick="window.print()">imprimir / guardar como PDF</button>
<button class="sec" onclick="window.location.href='pedidos.html'">ver mis compras</button></div>
</div></body></html>`;
    },
    // Construye el recibo, lo guarda en feriapp_recibos (reemplaza el anterior de esa venta) y devuelve el HTML.
    generar(venta) {
        const html = this.construir(venta), lista = FeriStore.leer(this.CLAVE, []);
        const reg = { venta: venta.id, fecha: new Date().toISOString(), html };
        const i = lista.findIndex(r => r.venta === venta.id);
        if (i >= 0) lista[i] = reg; else lista.push(reg);
        FeriStore.guardar(this.CLAVE, lista);
        return html;
    },
    // Devuelve el recibo guardado de una venta (o null).
    obtener(idVenta) { return FeriStore.leer(this.CLAVE, []).find(r => r.venta === idVenta) || null; },
    // Abre el recibo en una ventana nueva; si no estaba guardado lo genera. imprimir=true abre el diálogo de impresión (PDF).
    abrir(idVenta, imprimir) {
        let reg = this.obtener(idVenta);
        if (!reg) {
            const v = FeriStore.leer('feriapp_ventas', []).find(x => x.id === idVenta);
            if (!v) return false;
            this.generar(v); reg = this.obtener(idVenta);
        }
        const w = window.open('', '_blank');
        if (!w) return false; // el navegador bloqueó la ventana emergente
        // <base> para que ../index.html, catalogo.html y pedidos.html funcionen desde la ventana nueva.
        const html = reg.html.replace('<head>', '<head><base href="' + location.href.replace(/"/g, '%22') + '">');
        w.document.open(); w.document.write(html); w.document.close();
        if (imprimir) setTimeout(() => { w.focus(); w.print(); }, 300);
        return true;
    }
};
