const ALMACEN = {
    // Valor que puedes cambiar en cualquier momento
    presupuesto: "B/. 45.50", 

    // Fecha de inicio: 3 de diciembre de 2024
    fechaRelacion: new Date(2024, 11, 3, 17, 43),

    // Lista de reproducción (ID de YouTube y nombre)
    playlist: [
        { id: "XSqx8Ibkzrk&list=RDXSqx8Ibkzrk&start_radio=1", titulo: "Line Without a Hook" },
        { id: "dQw4w9WgXcQ", titulo: "Never Gonna Give You Up" },
        { id: "JF8BRgiW_v0", titulo: "Nuestra Canción" }
    ],

    // Organización de tus cartas
    carpetas: {
        "Recuerdos": [
            { titulo: "El Comienzo", fecha: "03/12/2024", nueva: false, contenido: "Todo empezó esa tarde de diciembre..." },
            { titulo: "Nuestra primera salida", fecha: "15/01/2025", nueva: false, contenido: "Estaba tan nervioso que casi no hablo." }
        ],
        "Notas": [
            { titulo: "Léeme hoy", fecha: "02/04/2026", nueva: true, contenido: "Solo quería recordarte lo mucho que te amo y lo orgulloso que estoy de nosotros." }
        ],
        "Aventuras": [
            { titulo: "Próximamente", fecha: "2026", nueva: true, contenido: "Aquí guardaremos nuestros viajes futuros." }
        ]
    }
};
