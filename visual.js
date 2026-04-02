const ui = {
    init: () => {
        ui.renderMenu();
        ui.actualizarReloj();
        setInterval(ui.actualizarReloj, 1000);
        setInterval(ui.crearCorazon, 500);
    },

    actualizarReloj: () => {
        const ahora = new Date();
        const inicio = ALMACEN.fechaRelacion;
        
        let anios = ahora.getFullYear() - inicio.getFullYear();
        let meses = ahora.getMonth() - inicio.getMonth();
        let dias = ahora.getDate() - inicio.getDate();

        if (dias < 0) { meses--; dias += new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate(); }
        if (meses < 0) { anios--; meses += 12; }

        const diff = ahora - inicio;
        const unidades = [
            {v: anios, l: 'Años'}, {v: meses, l: 'Meses'}, {v: dias, l: 'Días'},
            {v: Math.floor((diff/36e5)%24), l: 'Hrs'}, {v: Math.floor((diff/6e4)%60), l: 'Min'}, {v: Math.floor((diff/1e3)%60), l: 'Seg'}
        ];

        document.getElementById('contador-display').innerHTML = unidades.map(u => `
            <div class="reloj-caja"><span class="reloj-num">${u.v}</span><span class="reloj-lab">${u.l}</span></div>
        `).join('');
    },

    renderMenu: () => {
        const menu = document.getElementById('menu-carpetas');
        menu.innerHTML = Object.keys(ALMACEN.carpetas).map(nombre => `
            <div class="carpeta-item" onclick="ui.abrirCarpeta('${nombre}')">
                <span class="carpeta-icon">📁</span>
                <p>${nombre}</p>
            </div>
        `).join('');
    },

    abrirCarpeta: (nombre) => {
        document.getElementById('vista-inicio').style.display = 'none';
        document.getElementById('vista-carpeta').style.display = 'block';
        document.getElementById('titulo-seccion-actual').innerText = nombre;

        const grid = document.getElementById('contenedor-cartas');
        grid.innerHTML = ALMACEN.carpetas[nombre].map(carta => `
            <div class="carta-mini" onclick="ui.leerCarta('${carta.titulo}', '${carta.contenido}')">
                ${carta.nueva ? '<span class="tag-nueva">NUEVA ✨</span>' : ''}
                <strong>${carta.titulo}</strong>
                <small>${carta.fecha}</small>
            </div>
        `).join('');
    },

    irAlInicio: () => {
        document.getElementById('vista-inicio').style.display = 'block';
        document.getElementById('vista-carpeta').style.display = 'none';
    },

    leerCarta: (titulo, texto) => {
        document.getElementById('lectura-titulo').innerText = titulo;
        document.getElementById('lectura-texto').innerText = texto;
        document.getElementById('overlay-lectura').style.display = 'flex';
        document.getElementById('btn-marcar-leido').style.display = 'none';
        document.getElementById('lectura-texto').scrollTop = 0;
        
        // Si no hay scroll, mostrar botón
        const el = document.getElementById('lectura-texto');
        setTimeout(() => { if(el.scrollHeight <= el.clientHeight) document.getElementById('btn-marcar-leido').style.display = 'block'; }, 200);
    },

    cerrarCarta: () => { document.getElementById('overlay-lectura').style.display = 'none'; },

    checkScroll: (el) => {
        if (el.scrollHeight - el.scrollTop <= el.clientHeight + 5) {
            document.getElementById('btn-marcar-leido').style.display = 'block';
        }
    },

    togglePresupuesto: () => {
        const p = document.getElementById('popover-dinero');
        p.style.display = p.style.display === 'block' ? 'none' : 'block';
        document.getElementById('monto-dinero').innerText = ALMACEN.presupuesto;
    },

    toggleMusica: () => {
        const p = document.getElementById('popover-musica');
        p.style.display = p.style.display === 'block' ? 'none' : 'block';
    },

    crearCorazon: () => {
        const c = document.createElement('div');
        c.className = 'corazon-lluvia';
        c.innerText = '❤';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.animationDuration = Math.random() * 3 + 4 + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 6000);
    }
};

ui.init();