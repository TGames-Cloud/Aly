let audioPlayer = new Audio();
let playlistActual = [];

const musica = {
    indice: 0,
    volumenMaximo: 0.5, // 50% para que sea de fondo

    iniciarSistema: () => {
        // Clonamos la playlist original para no dañar el almacén
        playlistActual = [...ALMACEN.playlist];
        
        // Algoritmo de Fisher-Yates para barajar (Shuffle)
        for (let i = playlistActual.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlistActual[i], playlistActual[j]] = [playlistActual[j], playlistActual[i]];
        }

        // Cargamos la primera pero le bajamos el volumen
        audioPlayer.src = playlistActual[0].archivo;
        audioPlayer.volume = 0.1; // Empieza al 10%
        document.getElementById('track-titulo').innerText = playlistActual[0].titulo;
        musica.actualizarLetra();
    },

    playPause: () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            musica.fadeIn(musica.volumenMaximo); // Sube suavemente al 50%
        } else {
            musica.fadeOut(() => audioPlayer.pause()); // Baja suavemente y pausa
        }
    },

    next: () => {
        musica.fadeOut(() => {
            musica.indice = (musica.indice + 1) % playlistActual.length;
            audioPlayer.src = playlistActual[musica.indice].archivo;
            document.getElementById('track-titulo').innerText = playlistActual[musica.indice].titulo;
            musica.actualizarLetra();
            audioPlayer.play();
            musica.fadeIn(musica.volumenMaximo);
        });
    },

    // Efecto Fade In
    fadeIn: (targetVol) => {
        let vol = audioPlayer.volume;
        let intervalo = setInterval(() => {
            if (vol < targetVol) {
                vol = Math.min(vol + 0.05, targetVol);
                audioPlayer.volume = vol;
            } else {
                clearInterval(intervalo);
            }
        }, 100);
    },

    // Efecto Fade Out
    fadeOut: (callback) => {
        let vol = audioPlayer.volume;
        let intervalo = setInterval(() => {
            if (vol > 0.05) {
                vol -= 0.05;
                audioPlayer.volume = vol;
            } else {
                clearInterval(intervalo);
                audioPlayer.volume = 0;
                if(callback) callback();
            }
        }, 100);
    },

buscarLetra: async (artista, titulo) => {
        const cajaLetra = document.getElementById('caja-letras');
        cajaLetra.innerText = "Buscando letra...";
        cajaLetra.style.display = "block";

        try {
            // Consultamos a LRCLIB
            const response = await fetch(`https://lrclib.net/api/get?artist=${encodeURIComponent(artista)}&track=${encodeURIComponent(titulo)}`);
            
            if (response.ok) {
                const data = await response.json();
                // Preferimos 'syncedLyrics' (con tiempo) o 'plainLyrics' (texto puro)
                const letra = data.syncedLyrics || data.plainLyrics || "Letra no disponible.";
                
                // Si es sincronizada, podrías procesarla, pero por ahora mostramos el texto
                cajaLetra.innerText = letra.replace(/\[\d+:\d+.\d+\]/g, ""); // Limpiamos los tiempos [00:12.34]
            } else {
                cajaLetra.innerText = "No se encontró la letra.";
            }
        } catch (error) {
            console.error("Error con LRCLIB:", error);
            cajaLetra.innerText = "Error al cargar letra.";
        }
    }
};

// Cuando la canción termine, pasa a la siguiente automáticamente con fade
audioPlayer.addEventListener('ended', musica.next);

// Inicializar al cargar
musica.iniciarSistema();
