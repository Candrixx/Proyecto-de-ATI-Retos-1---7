async function cargarConfiguracion(idioma) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        // Asegúrate de que el nombre del archivo coincida (ej: configEN.json)
        script.src = `conf/config${idioma.toUpperCase()}.json`; 
        script.onload = () => resolve(); // Cuando el script cargue, 'config' ya existe
        script.onerror = () => reject(new Error("No se pudo cargar la configuración"));
        document.head.appendChild(script);
    });
}


async function getConfig() {
    const parametrosURL = new URLSearchParams(window.location.search);
    const idioma = parametrosURL.get('lang') || 'ES';
    const busquedaPrevia = parametrosURL.get('q');

    try {

        await cargarConfiguracion(idioma);
        console.log("Configuración cargada:", config);

    } catch (error) {
        console.error("Error crítico al cargar el archivo perfil.json de la carpeta:", error);
    }

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

    //PARTE 2 semestre
    const tituloSeccion = document.querySelector('.title-section h2');
    if(tituloSeccion){
        tituloSeccion.textContent = config.semester;
    }


    //PARTE 3 copyright
    const textoCopyright = document.querySelector('footer p');
    if(textoCopyright){
        textoCopyright.textContent = config.copyRight;
    }

    //PARTE 4 tarjetas
    const contenedorPrincipal = document.getElementById('contenedor-cartas');
    
    if (!contenedorPrincipal) return;

    contenedorPrincipal.innerHTML = "";

    profiles.forEach(perfil => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'card';
        tarjeta.innerHTML = `
            <div class="card-header">
                <img src="${perfil.ci}/${perfil.ci}Big${perfil.image_ext}" alt="${perfil.ci}">
            </div>
            <div class="card-footer">
                <p>${perfil.name}</p>
            </div>
            <div class="blue-bar"></div>
        `;

        tarjeta.addEventListener('click', () => {
            window.location.href = `profile.html?cedula=${perfil.ci}`;
        });

        contenedorPrincipal.appendChild(tarjeta);
    });

    if (busquedaPrevia) {
        const inputIndex = document.querySelector('.search-container input');
        inputIndex.value = busquedaPrevia; // Rellenar la barra
        
        const eventoInput = new Event('input');
        inputIndex.dispatchEvent(eventoInput);
    }
    // 1. Seleccionamos los elementos clave
    const contenedorListado = document.querySelector('.card-container'); 
    const tarjetasEstudiantes = document.querySelectorAll('.card'); 

    // 2. Creamos el contenedor para el mensaje de "No encontrado"
    const mensajeNoResultados = document.createElement('p');
    mensajeNoResultados.className = 'mensaje-error-busqueda';
    mensajeNoResultados.style.display = 'none'; 
    mensajeNoResultados.style.textAlign = 'center'; 
    mensajeNoResultados.style.fontWeight = 'bold'; 
    contenedorListado.appendChild(mensajeNoResultados); 

    // 3. Escuchamos cada vez que el usuario escribe algo
    inputBusqueda.addEventListener('input', (evento) => {
        
        const query = evento.target.value.toLowerCase().trim();
        let estudiantesEncontrados = 0;

        // 4. Recorremos cada estudiante
        tarjetasEstudiantes.forEach(tarjeta => {
            
            const nombreEstudiante = tarjeta.querySelector('.card-footer p').textContent.toLowerCase();

            if (nombreEstudiante.includes(query)) {
                tarjeta.style.display = ''; 
                estudiantesEncontrados++;   
            } else {
                tarjeta.style.display = 'none'; 
            }
        });

        // 6. Lógica para mostrar el mensaje de "No hay perfiles..."
        if (estudiantesEncontrados === 0 && query !== '') {
            const textoTraducido = config.noResults.replace('[query]', evento.target.value);
            mensajeNoResultados.textContent = textoTraducido;
            mensajeNoResultados.style.display = 'block'; 
        } else {
            mensajeNoResultados.style.display = 'none'; 
        }
    });

    //Menu desplegable
    // 1. Seleccionamos el botón de la hamburguesa usando su clase
    const botonMenu = document.querySelector('.hamburger-menu');

    // 2. Seleccionamos el header 
    const header = document.querySelector('header'); 

    // 3. Verificamos que el botón exista en la página para evitar errores
    if (botonMenu) {
        // 4. Le agregamos el evento de clic
        botonMenu.addEventListener('click', () => {
            
            header.classList.toggle('menu-abierto');
        });
    }
}

getConfig();