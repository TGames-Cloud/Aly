let player;
let apiReady = false;
let musicaIniciada = false;

const musica = {
    indice: 0,
    
    intentarReproducir: () => {
        if (apiReady && player && !musicaIniciada) {
            player.playVideo();
            musicaIniciada = true;
            // Iniciamos el ritmo apenas detectamos el primer clic
            if(typeof ritmo !== 'undefined') ritmo.iniciar(ALMACEN.playlist[musica.indice].bpm);
        }
    },

    playPause: () => {
        if (!apiReady) return;
        const estado = player.getPlayerState();
        estado === 1 ? player.pauseVideo() : player.playVideo();
    },

    next: () => {
        if (!apiReady) return;
        musica.indice = (musica.indice + 1) % ALMACEN.playlist.length;
        musica.actualizar();
    },

    prev: () => {
        if (!apiReady) return;
        musica.indice = (musica.indice - 1 + ALMACEN.playlist.length) % ALMACEN.playlist.length;
        musica.actualizar();
    },

    actualizar: () => {
        const cancion = ALMACEN.playlist[musica.indice];
        player.loadVideoById(cancion.id);
        document.getElementById('track-titulo').innerText = cancion.titulo;
        player.playVideo();
        if(typeof ritmo !== 'undefined') ritmo.iniciar(cancion.bpm);
    },

    setVolumen: (v) => { if (apiReady) player.setVolume(v); }
};

// Listeners para forzar el inicio
document.addEventListener('click', musica.intentarReproducir, { once: true });

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0',
        videoId: ALMACEN.playlist[0].id,
        playerVars: { 
            'origin': window.location.origin,
            'enablejsapi': 1,
            'autoplay': 1,
            'mute': 0 
        },
        events: {
            'onReady': () => { apiReady = true; document.getElementById('track-titulo').innerText = ALMACEN.playlist[0].titulo; },
            'onError': (e) => console.error("Error YouTube:", e)
        }
    });
}
