let player;
let apiReady = false;

// Esta función es sagrada, YouTube la busca para arrancar
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: ALMACEN.playlist[0].id,
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'disablekb': 1,
            'enablejsapi': 1,
            'mute': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': (e) => { if(e.data === 0) musica.next(); }
        }
    });
}

function onPlayerReady(event) {
    apiReady = true;
    console.log("Sistema de audio en línea");
    document.getElementById('track-titulo').innerText = ALMACEN.playlist[0].titulo;
}

const musica = {
    indice: 0,
    playPause: () => {
        if(!apiReady) return;
        player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo();
        if(typeof ritmo !== 'undefined') ritmo.iniciar(ALMACEN.playlist[musica.indice].bpm);
    },
    next: () => {
        musica.indice = (musica.indice + 1) % ALMACEN.playlist.length;
        musica.actualizar();
    },
    prev: () => {
        musica.indice = (musica.indice - 1 + ALMACEN.playlist.length) % ALMACEN.playlist.length;
        musica.actualizar();
    },
    actualizar: () => {
        const c = ALMACEN.playlist[musica.indice];
        player.loadVideoById(c.id);
        document.getElementById('track-titulo').innerText = c.titulo;
        if(typeof ritmo !== 'undefined') ritmo.iniciar(c.bpm);
    },
    setVolumen: (v) => { if(apiReady) player.setVolume(v); }
};

// Activar al primer clic si el navegador bloqueó el autoplay
document.addEventListener('mousedown', () => {
    if(apiReady && player.getPlayerState() !== 1) {
        player.playVideo();
        if(typeof ritmo !== 'undefined') ritmo.iniciar(ALMACEN.playlist[musica.indice].bpm);
    }
}, {once: true});
