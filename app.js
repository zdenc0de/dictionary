document.addEventListener("DOMContentLoaded", () => {
    const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    const resultado = document.getElementById("resultado"); 
    const sonido = document.getElementById("sonido"); 
    const btn = document.getElementById("btn-busqueda"); 

    btn.addEventListener("click", () => {
        let inPalabra = document.getElementById("inp-palabra").value; 
        fetch(`${url}${inPalabra}`)
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error('Wrong network response');
            }
            return respuesta.json();
        })
        .then((data) => {
            console.log(data);
            if (!data || !data[0] || !data[0].phonetics || !data[0].meanings) {
                throw new Error('Unexpected data structure');
            }

            const phoneticAudio = data[0].phonetics.find(p => p.audio);
            let partOfSpeech = '';
            let definition = '';
            let example = '';

            for (let meaning of data[0].meanings) {
                if (meaning.definitions && meaning.definitions.length > 0) {
                    partOfSpeech = meaning.partOfSpeech;
                    definition = meaning.definitions[0].definition;
                    example = meaning.definitions[0].example || 'No example available';
                }
            }

            resultado.innerHTML = `
            <div class="palabra">
                <h3>${inPalabra}</h3>
                <button onclick="playSound()">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
            <div class="detalles">
                <p>${partOfSpeech}</p>
                <p>/${data[0].phonetic || ''}/</p>
            </div>
            <p class="significado">
                ${definition}
            </p>
            <p class="ejemplo">
                ${example}
            </p>`; 
            
            if (phoneticAudio) {
                sonido.setAttribute("src", phoneticAudio.audio.startsWith('https:') ? phoneticAudio.audio : `https:${phoneticAudio.audio}`);
            } else {
                console.error("No se encontró una fuente de audio válida");
            }
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
            resultado.innerHTML = `<h3 class="error">No se encontró la palabra</h3>`; 
        });
    });

    window.playSound = function() {
        if (sonido.src) {
            sonido.play().catch(error => console.error("Error al reproducir el audio:", error));
        } else {
            console.error("No hay una fuente de audio válida para reproducir");
        }
    };
});
