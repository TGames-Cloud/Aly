let player;
let apiReady = false;

const musica = {
    indice: 0,

    playPause: () => {
        if (!apiReady || !player) return;
        const estado = player.getPlayerState();
        // 1 = Reproduciendo, 2 = Pausado
        if (estado === 1) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
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
    },

    setVolumen: (v) => {
        if (apiReady && player) player.setVolume(v);
    }
};

// Función global que llama la API de YouTube
function onYouTubeIframeAPIReady() {
    console.log("YouTube API cargando...");
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: ALMACEN.playlist[0].id,
        playerVars: {
            'origin': window.location.origin,
            'autoplay': 0,
            'controls': 0
        },
        events: {
            'onReady': (event) => {
                apiReady = true;
                console.log("¡Música lista!");
                document.getElementById('track-titulo').innerText = ALMACEN.playlist[0].titulo;
            },
            'onStateChange': (event) => {
                // Si la canción termina (estado 0), pasar a la siguiente
                if (event.data === 0) musica.next();
            }
        }
    });
}
