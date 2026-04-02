let player;
const musica = {
    indice: 0,

    playPause: () => {
        const estado = player.getPlayerState();
        estado === 1 ? player.pauseVideo() : player.playVideo();
    },

    next: () => {
        musica.indice = (musica.indice + 1) % ALMACEN.playlist.length;
        musica.cargar();
    },

    prev: () => {
        musica.indice = (musica.indice - 1 + ALMACEN.playlist.length) % ALMACEN.playlist.length;
        musica.cargar();
    },

    cargar: () => {
        const cancion = ALMACEN.playlist[musica.indice];
        player.loadVideoById(cancion.id);
        document.getElementById('track-titulo').innerText = cancion.titulo;
    },

    setVolumen: (v) => { player.setVolume(v); }
};

// Función obligatoria para YouTube API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0',
        videoId: ALMACEN.playlist[0].id,
        events: {
            'onReady': () => {
                document.getElementById('track-titulo').innerText = ALMACEN.playlist[0].titulo;
            }
        }
    });
}