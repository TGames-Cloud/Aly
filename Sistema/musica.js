let audioPlayer = new Audio();
let playlistActual = [];
let yaInteractuo = false;

const musica = {
    indice: 0,
    volMax: 0.4,

    iniciarSistema: () => {
        playlistActual = [...ALMACEN.playlist].sort(() => Math.random() - 0.5);
        musica.cargar(0);
    },

    cargar: (idx) => {
        audioPlayer.src = playlistActual[idx].archivo;
        audioPlayer.load(); // Vital para evitar el NotSupportedError en móvil
        document.getElementById('track-titulo').innerText = playlistActual[idx].titulo;
    },

    arrancarFondo: () => {
        if (!yaInteractuo) {
            yaInteractuo = true;
            audioPlayer.play().then(() => musica.fade(0, musica.volMax));
        }
    },

    next: () => {
        musica.fade(audioPlayer.volume, 0, () => {
            musica.indice = (musica.indice + 1) % playlistActual.length;
            musica.cargar(musica.indice);
            audioPlayer.play();
            musica.fade(0, musica.volMax);
        });
    },

    fade: (inicio, fin, callback) => {
        let paso = (fin - inicio) / 10;
        let i = 0;
        let int = setInterval(() => {
            audioPlayer.volume = Math.max(0, Math.min(1, audioPlayer.volume + paso));
            if (++i >= 10) {
                clearInterval(int);
                if (callback) callback();
            }
        }, 50);
    }
};

audioPlayer.addEventListener('ended', musica.next);
musica.iniciarSistema();
