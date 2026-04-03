let player;
let apiReady = false;

// YouTube llama a esta función solo cuando termina de cargar su API
function onYouTubeIframeAPIReady() {
    console.log("API de YouTube detectada. Inicializando...");
    verificarYCrearPlayer();
}

function verificarYCrearPlayer() {
    // Si ALMACEN no existe todavía, esperamos un poco
    if (typeof ALMACEN === 'undefined') {
        setTimeout(verificarYCrearPlayer, 500);
        return;
    }

    player = new YT.Player('player', {
        height: '0', width: '0',
        videoId: ALMACEN.playlist[0].id,
        playerVars: { 'autoplay': 1, 'controls': 0, 'enablejsapi': 1, 'origin': window.location.origin },
        events: {
            'onReady': () => {
                apiReady = true;
                document.getElementById('track-titulo').innerText = ALMACEN.playlist[0].titulo;
            },
            'onStateChange': (e) => { if(e.data === 0) musica.next(); }
        }
    });
}

const musica = {
    indice: 0,
    playPause: () => {
        if(!apiReady) return;
        player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo();
        if(typeof ritmo !== 'undefined') ritmo.iniciar(ALMACEN.playlist[musica.indice].bpm);
    },
    next: () => {
        if(!apiReady) return;
        musica.indice = (musica.indice + 1) % ALMACEN.playlist.length;
        musica.actualizar();
    },
    prev: () => {
        if(!apiReady) return;
        musica.indice = (musica.indice - 1 + ALMACEN.playlist.length) % ALMACEN.playlist.length;
        musica.actualizar();
    },
    actualizar: () => {
        const cancion = ALMACEN.playlist[musica.indice];
        player.loadVideoById(cancion.id);
        document.getElementById('track-titulo').innerText = cancion.titulo;
        if(typeof ritmo !== 'undefined') ritmo.iniciar(cancion.bpm);
    },
    setVolumen: (v) => { if(apiReady) player.setVolume(v); }
};

// Forzar inicio al primer clic (Crucial para Chrome/Safari)
document.addEventListener('click', () => {
    if(apiReady && player.getPlayerState() !== 1) {
        player.playVideo();
        if(typeof ritmo !== 'undefined') ritmo.iniciar(ALMACEN.playlist[musica.indice].bpm);
    }
}, { once: true });
