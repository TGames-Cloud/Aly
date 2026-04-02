let player;
let apiLista = false;

const musica = {
    indice: 0,

    playPause: () => {
        if (!apiLista) return;
        const estado = player.getPlayerState();
        estado === 1 ? player.pauseVideo() : player.playVideo();
    },

    next: () => {
        if (!apiLista) return;
        musica.indice = (musica.indice + 1) % ALMACEN.playlist.length;
        musica.cargar();
    },

    prev: () => {
        if (!apiLista) return;
        musica.indice = (musica.indice - 1 + ALMACEN.playlist.length) % ALMACEN.playlist.length;
        musica.cargar();
    },

    cargar: () => {
        const cancion = ALMACEN.playlist[musica.indice];
        player.loadVideoById(cancion.id);
        document.getElementById('track-titulo').innerText = cancion.titulo;
        player.playVideo();
    },

    setVolumen: (v) => { if (apiLista) player.setVolume(v); }
};

// Se ejecuta automáticamente por la API de YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: ALMACEN.playlist[0].id,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'origin': window.location.origin
        },
        events: {
            'onReady': (event) => {
                apiLista = true;
                document.getElementById('track-titulo').innerText = ALMACEN.playlist[0].titulo;
            },
            'onError': (e) => {
                console.error("Error en YouTube API: ", e);
            }
        }
    });
}
