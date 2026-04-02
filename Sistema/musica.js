let player;
let apiReady = false;
let musicaIniciada = false;

const musica = {
    indice: 0,
    
    // Función para intentar reproducir
    intentarReproducir: () => {
        if (apiReady && player && !musicaIniciada) {
            player.playVideo();
            musicaIniciada = true;
            console.log("Música activada por interacción.");
        }
    },

    playPause: () => {
        if (!apiReady) return;
        const estado = player.getPlayerState();
        if (estado === 1) player.pauseVideo(); 
        else player.playVideo();
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
    },

    setVolumen: (v) => { if (apiReady) player.setVolume(v); }
};

// ACTIVADOR GLOBAL: En cuanto toque la pantalla, la música arranca
document.addEventListener('click', musica.intentarReproducir, { once: true });
document.addEventListener('touchstart', musica.intentarReproducir, { once: true });

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0',
        videoId: ALMACEN.playlist[0].id,
        playerVars: { 
            'origin': window.location.origin,
            'autoplay': 1,
            'mute': 0 
        },
        events: {
            'onReady': () => {
                apiReady = true;
                document.getElementById('track-titulo').innerText = ALMACEN.playlist[0].titulo;
            }
        }
    });
}
