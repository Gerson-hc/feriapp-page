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
    leer(clave, defecto) {
        try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : defecto; } catch (e) { return defecto; }
    },
    guardar(clave, valor) {
        try { localStorage.setItem(clave, JSON.stringify(valor)); return true; } catch (e) { return false; }
    }
};

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
    paso(unidad) { return (unidad === 'kg' || unidad === 'libra') ? 0.5 : 1; },
    estado(p) { return p.cant <= 0 ? 'agotado' : (p.cant < p.min ? 'bajo' : 'disponible'); },

    // ¿Se puede pedir esta cantidad? yaEnPedido = lo que el cliente ya tiene de ese producto.
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

    _guardar() {
        const mapa = {};
        productos.forEach(p => { mapa[p.id] = { cant: p.cant, fecha: p.fecha }; });
        return FeriStore.guardar('feriapp_inventario', mapa);
    },
    _cargar() {
        const g = FeriStore.leer('feriapp_inventario', {});
        productos.forEach(p => {
            const v = g[p.id];
            if (v === undefined) return;
            if (typeof v === 'number') { p.cant = v; } else { p.cant = v.cant; p.fecha = v.fecha || p.fecha; }
        });
    },

    // lineas: [{ id, cant }]. Descuenta todo o nada y actualiza la fecha.
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

// Sesión del prototipo (mismas claves que usa el login existente)
const FeriSesion = {
    actual() {
        try {
            const activa = localStorage.getItem('sesion_activa') === 'true';
            const rol = localStorage.getItem('rolferiapp') || localStorage.getItem('usuario_rol');
            if (!activa || !rol) return null;
            return { rol, id: localStorage.getItem('usuario_id') || '', nombre: localStorage.getItem('nombreferiapp') || localStorage.getItem('usuario_nombre') || '' };
        } catch (e) { return null; }
    },
    cerrar() {
        ['sesion_activa', 'rolferiapp', 'nombreferiapp', 'correoferiapp', 'usuario_id', 'usuario_nombre', 'usuario_rol', 'fotoferiapp', 'bioferiapp', 'feriapp_accion_pendiente']
            .forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
    },
    // Enlace "iniciar sesión / cerrar sesión" del menú (elemento con id="enlacesesion")
    pintarEnlace() {
        const a = document.getElementById('enlacesesion'); if (!a) return;
        if (this.actual()) { a.textContent = 'cerrar sesión'; a.href = '#'; a.onclick = e => { e.preventDefault(); this.cerrar(); location.reload(); }; }
        else { a.textContent = 'iniciar sesión'; a.href = 'login.html'; }
    }
};
