let player;
let apiReady = false;

const musica = {
    indice: 0,
    playPause: () => { if(apiReady) player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo(); },
    next: () => {
        if(!apiReady) return;
        musica.indice = (musica.indice + 1) % ALMACEN.playlist.length;
        musica.cargar();
    },
    prev: () => {
        if(!apiReady) return;
        musica.indice = (musica.indice - 1 + ALMACEN.playlist.length) % ALMACEN.playlist.length;
        musica.cargar();
    },
    cargar: () => {
        player.loadVideoById(ALMACEN.playlist[musica.indice].id);
        document.getElementById('track-titulo').innerText = ALMACEN.playlist[musica.indice].titulo;
    },
    setVolumen: (v) => { if(apiReady) player.setVolume(v); }
};

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0',
        videoId: ALMACEN.playlist[0].id,
        playerVars: { 'origin': window.location.origin },
        events: {
            'onReady': () => {
                apiReady = true;
                document.getElementById('track-titulo').innerText = ALMACEN.playlist[0].titulo;
            }
        }
    });
}
