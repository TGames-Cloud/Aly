let audioPlayer = new Audio();
let playlistActual = [];
let yaInteractuo = false; // Control para saber si la música ya arrancó

const musica = {
    indice: 0,
    volumenMaximo: 0.3, // 30% para que sea realmente de fondo, sin asustar

    iniciarSistema: () => {
        // 1. Clonar la playlist del almacén
        playlistActual = [...ALMACEN.playlist];
        
        // 2. Barajar la playlist (Shuffle aleatorio sin repetir)
        playlistActual.sort(() => Math.random() - 0.5);

        // 3. Cargar la primera canción en silencio
        audioPlayer.src = playlistActual[0].archivo;
        audioPlayer.volume = 0; 
        
        // Actualizar el título en la interfaz
        const tituloTrack = document.getElementById('track-titulo');
        if(tituloTrack) tituloTrack.innerText = playlistActual[0].titulo;
    },

    // Esta es la función que "engaña" al navegador para arrancar
    arrancarFondo: () => {
        if (!yaInteractuo) {
            yaInteractuo = true;
            audioPlayer.play().then(() => {
                console.log("Música iniciada de fondo.");
                musica.fadeIn(musica.volumenMaximo);
            }).catch(e => console.error("El navegador bloqueó el autoplay:", e));
        }
    },

    playPause: () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            musica.fadeIn(musica.volumenMaximo);
        } else {
            musica.fadeOut(() => audioPlayer.pause());
        }
    },

    next: () => {
        musica.fadeOut(() => {
            // Avanzar al siguiente índice
            musica.indice = (musica.indice + 1) % playlistActual.length;
            audioPlayer.src = playlistActual[musica.indice].archivo;
            
            // Actualizar título
            const tituloTrack = document.getElementById('track-titulo');
            if(tituloTrack) tituloTrack.innerText = playlistActual[musica.indice].titulo;
            
            // Reproducir con fade
            audioPlayer.play();
            musica.fadeIn(musica.volumenMaximo);
        });
    },

    fadeIn: (volumenObjetivo) => {
        let vol = audioPlayer.volume;
        let intervalo = setInterval(() => {
            if (vol < volumenObjetivo) {
                vol = Math.min(vol + 0.02, volumenObjetivo); // Sube muy suavemente
                audioPlayer.volume = vol;
            } else {
                clearInterval(intervalo);
            }
        }, 100);
    },

    fadeOut: (callback) => {
        let vol = audioPlayer.volume;
        let intervalo = setInterval(() => {
            if (vol > 0.02) {
                vol -= 0.05; // Baja rápido pero suave
                audioPlayer.volume = Math.max(0, vol);
            } else {
                clearInterval(intervalo);
                audioPlayer.volume = 0;
                if (callback) callback();
            }
        }, 50);
    }
};

// Pasar a la siguiente automáticamente cuando termine una canción
audioPlayer.addEventListener('ended', musica.next);

// Preparamos todo al cargar
musica.iniciarSistema();

// --- EL TRUCO DEL AUTOPLAY ---
// En cuanto se toque cualquier parte de la pantalla, arranca el audio.
// El { once: true } asegura que esto solo se ejecute la primera vez.
document.addEventListener('click', musica.arrancarFondo, { once: true });
document.addEventListener('touchstart', musica.arrancarFondo, { once: true });
