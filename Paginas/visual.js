const ui = {
    init: () => {
        ui.renderMenu();
        ui.actualizarReloj();
        setInterval(ui.actualizarReloj, 1000);
    },
    actualizarReloj: () => {
        const ahora = new Date();
        const inicio = ALMACEN.fechaRelacion; //
        let anios = ahora.getFullYear() - inicio.getFullYear();
        let meses = ahora.getMonth() - inicio.getMonth();
        let dias = ahora.getDate() - inicio.getDate();
        if (dias < 0) { meses--; dias += new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate(); }
        if (meses < 0) { anios--; meses += 12; }
        const diff = ahora - inicio;
        const stats = [
            {v: anios, l: 'Años'}, {v: meses, l: 'Meses'}, {v: dias, l: 'Días'},
            {v: Math.floor((diff/36e5)%24), l: 'Hrs'}, {v: Math.floor((diff/6e4)%60), l: 'Min'}, {v: Math.floor((diff/1e3)%60), l: 'Seg'}
        ];
        document.getElementById('contador-display').innerHTML = stats.map(s => `
            <div class="reloj-caja"><span class="reloj-num">${s.v}</span><span class="reloj-lab">${s.l}</span></div>
        `).join('');
    },
renderMenu: () => {
    const menu = document.getElementById('menu-carpetas');
    menu.innerHTML = Object.keys(ALMACEN.carpetas).map(cat => `
        <div class="carpeta-item" onclick="ui.abrirCarpeta('${cat}')">
            <div class="carpeta-wrapper">
                <span style="font-size: 60px;">📂</span>
            </div>
            <p style="font-weight:bold; margin-top:10px;">${cat}</p>
        </div>
    `).join('');
},
    abrirCarpeta: (n) => {
        document.getElementById('vista-inicio').style.display = 'none';
        document.getElementById('vista-carpeta').style.display = 'block';
        document.getElementById('titulo-seccion-actual').innerText = n;
        document.getElementById('contenedor-cartas').innerHTML = ALMACEN.carpetas[n].map(c => `
            <div class="carta-mini" onclick="ui.leer('${c.titulo}','${c.contenido}')">
                ${c.nueva ? '<span class="tag-nueva">NUEVA ✨</span>' : ''}
                <strong>${c.titulo}</strong><br><small>${c.fecha}</small>
            </div>
        `).join('');
    },
    irAlInicio: () => {
        document.getElementById('vista-inicio').style.display = 'block';
        document.getElementById('vista-carpeta').style.display = 'none';
    },
    leer: (t, txt) => {
        document.getElementById('lectura-titulo').innerText = t;
        document.getElementById('lectura-texto').innerText = txt;
        document.getElementById('overlay-lectura').style.display = 'flex';
    },
    cerrarCarta: () => document.getElementById('overlay-lectura').style.display = 'none',
    togglePresupuesto: () => {
        const p = document.getElementById('popover-dinero');
        p.style.display = p.style.display === 'block' ? 'none' : 'block';
        document.getElementById('monto-dinero').innerText = ALMACEN.presupuesto; //
    },
    toggleMusica: () => {
        const p = document.getElementById('popover-musica');
        p.style.display = p.style.display === 'block' ? 'none' : 'block';
    }

const ritmo = {
    bpm: 128, // Cambia esto según tu canción
    intervalo: null,

    iniciar: () => {
        // Calculamos los milisegundos por pulso: (60 / BPM) * 1000
        const ms = (60 / ritmo.bpm) * 1000;
        
        ritmo.intervalo = setInterval(() => {
            if (apiReady && player.getPlayerState() === 1) {
                ritmo.efectoVisual();
            }
        }, ms);
    },

    efectoVisual: () => {
        const contador = document.getElementById('contador-display');
        
        // Aplicamos una animación rápida de "pulso"
        contador.style.transform = 'scale(1.05)';
        contador.style.borderColor = 'var(--rosa)';
        
        setTimeout(() => {
            contador.style.transform = 'scale(1)';
            contador.style.borderColor = 'var(--rosa-suave)';
        }, 100);
    }
};
};
ui.init();
