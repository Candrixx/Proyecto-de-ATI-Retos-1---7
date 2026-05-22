async function getConfig(){
    //PARTE 1 logo, barra de busqueda
    const tituloH1 = document.querySelector('.logo h1');
    const subTextoSpan = document.querySelector('.logo h1 span');

    if (tituloH1 && subTextoSpan) {
        subTextoSpan.textContent = config.site[1];

        const textoIzquierdo = config.site[0];
        const textoDerecho = config.site[2]; 

        
        tituloH1.textContent = textoIzquierdo;
        tituloH1.appendChild(subTextoSpan);
        tituloH1.append(textoDerecho);
    }

    const inputBusqueda = document.querySelector('.search-container input');
    if (inputBusqueda) {
        inputBusqueda.placeholder = config.name + "..."; 
    }

    const botonBusqueda = document.querySelector('.search-container button');
    if (botonBusqueda) {
        botonBusqueda.textContent = config.search;
    }

    //PARTE 3 copyright
    const textoCopyright = document.querySelector('footer p');
    if(textoCopyright){
        textoCopyright.textContent = config.copyRight;
    }

    //PARTE 4 obtener la cedula
    const parametrosURL = new URLSearchParams(window.location.search);
    const cedulaSeleccionada = parametrosURL.get('cedula');

    if (!cedulaSeleccionada) {
        console.error("No se especificó ninguna cédula en la barra de direcciones.");
        return;
    }

    try {
        const rutaJson = `../${cedulaSeleccionada}/profile.json`;
        const respuesta = await fetch(rutaJson);
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const textoArchivo = await respuesta.text();

        const inicioJSON = textoArchivo.indexOf('{');
        const finJSON = textoArchivo.lastIndexOf('}');
        
        const textoJSONLimpio = textoArchivo.substring(inicioJSON, finJSON + 1);

        const perfil = JSON.parse(textoJSONLimpio);

        const sourceFoto = document.querySelector('.columna-foto picture source');
        const imgFoto = document.querySelector('.columna-foto picture img');

        if (sourceFoto && imgFoto) {
            const rutaImagenSmall = `../${perfil.ci}/${perfil.ci}Small${perfil.image_ext}`;
            const rutaImagenBig = `../${perfil.ci}/${perfil.ci}Big${perfil.image_ext}`;
            sourceFoto.srcset = rutaImagenSmall;
            imgFoto.src = rutaImagenBig;
            imgFoto.alt = perfil.name; 
        }

        const txtBiografia = document.querySelector('.perfil-card .biografia');
        if (txtBiografia) {
            txtBiografia.innerHTML = perfil.description || "Sin descripción disponible.";
        }

        // Selección de filas
        const filasTabla = document.querySelectorAll('.tabla-datos tr');

        if (filasTabla.length >= 4) {
            // Fila 1: Color
            const c1Etiqueta = filasTabla[0].querySelector('.etiqueta');
            const c1Valor = filasTabla[0].querySelector('.valor');
            if (c1Etiqueta && c1Valor && perfil.color) {
                c1Etiqueta.textContent = config.color;
                c1Valor.textContent = perfil.color;
            }

            // Fila 2: Libros 
            const c2Etiqueta = filasTabla[1].querySelector('.etiqueta');
            const c2Valor = filasTabla[1].querySelector('.valor');
            if (c2Etiqueta && c2Valor && perfil.book) {
                const esPlural = perfil.book.length > 1;
                c2Etiqueta.textContent = esPlural ? config.book[1] : config.book[0];
                c2Valor.textContent = perfil.book.join(', ');
            }

            // Fila 3: Música
            const c3Etiqueta = filasTabla[2].querySelector('.etiqueta');
            const c3Valor = filasTabla[2].querySelector('.valor');
            if (c3Etiqueta && c3Valor && perfil.music) {
                const esPlural = perfil.music.length > 1;
                c3Etiqueta.textContent = esPlural ? config.music[1] : config.music[0];
                c3Valor.textContent = perfil.music.join(', ');
            }

            const c5Etiqueta = filasTabla[3].querySelector('.etiqueta');
            const c5Valor = filasTabla[3].querySelector('.valor');
            if (c5Etiqueta && c5Valor && perfil.video_game) {
                const esPlural = perfil.video_game.length > 1;
                c5Etiqueta.textContent = esPlural ? config.video_game[1] : config.video_game[0];
                c5Valor.textContent = perfil.video_game.join(', ');
            }

            const filaLenguajes = document.querySelector('tr.destacado');
            if (filaLenguajes && perfil.language) {
                const celdasLenguajes = filaLenguajes.querySelectorAll('td');
                
                if (celdasLenguajes.length >= 2) {
                    celdasLenguajes[0].textContent = config.language;
                    celdasLenguajes[1].textContent = perfil.language.join(', ');
                }
            }
        }

        const contenedorContacto = document.querySelector('.contacto');
        if (contenedorContacto && perfil.email) {
            const enlaceCorreo = `<a href="mailto:${perfil.email}">${perfil.email}</a>`;
            const textoFinal = config.email.replace('[email]', enlaceCorreo);
            contenedorContacto.innerHTML = textoFinal;
        }

    } catch (error) {
        console.error("Error crítico al cargar el archivo perfil.json de la carpeta:", error);
    }

}

getConfig();