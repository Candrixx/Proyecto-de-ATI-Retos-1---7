class TarjetaEstudiante {
    constructor(perfil) {
        this.element = document.createElement('div');
        console.log("Referencia al objeto -> ", this);
        this.element.className = 'card';
        this.element.innerHTML = `
            <div class="card-header">
                <img src="/ATI/${perfil.ci}/${perfil.ci}Big${perfil.image_ext}" alt="${perfil.ci}">
            </div>
            <div class="card-footer">
                <p>${perfil.name}</p>
            </div>
            <div class="blue-bar"></div>
        `;
    }
}

async function cargarEstudiantes() {
    try {
        const respuesta = await fetch('/ATI/data/index.json'); // Asegúrate que esta ruta exista
        const listaEstudiantes = await respuesta.json();
        const contenedor = document.getElementById('contenedor-cartas');
        
        listaEstudiantes.forEach(estudiante => {
            const tarjeta = new TarjetaEstudiante(estudiante);
            contenedor.appendChild(tarjeta.element);
        });
    } catch (error) {
        console.error("Error al cargar los estudiantes:", error);
    }
}

async function cargarConfiguracion(idioma) {
    try {
        const langCode = (typeof currentLang !== 'undefined') ? currentLang.toUpperCase() : idioma.toUpperCase();

        const respuesta = await fetch(`conf/config${langCode}.json`);
        if (!respuesta.ok) throw new Error("No se pudo cargar");

        window.config = await respuesta.json();
    } catch (error) {
        console.error("Error al cargar la configuración:", error);
    }
}

function configurarBusqueda(input, tarjetas, config) {
    input.addEventListener('input', (evento) => {
        const query = evento.target.value.toLowerCase();
        let estudiantesEncontrados = 0;
        const mensajeNoResultados = document.getElementById('mensaje-no-resultados'); 

        tarjetas.forEach(tarjeta => {
            const nombreEstudiante = tarjeta.querySelector('.card-footer p').textContent.toLowerCase();

            if (nombreEstudiante.includes(query)) {
                tarjeta.style.display = '';
                estudiantesEncontrados++;
            } else {
                tarjeta.style.display = 'none';
            }
        });

        if (estudiantesEncontrados === 0 && query !== '') {
            const textoTraducido = config.noResults.replace('[query]', query);
            mensajeNoResultados.textContent = textoTraducido;
            mensajeNoResultados.style.display = 'block';
        } else {
            mensajeNoResultados.style.display = 'none';
        }
    });
}

// Función para mostrar el perfil sin recargar la página (Estilo SPA)
function mostrarPerfilSPA(perfil) {
    document.getElementById('contenedor-cartas').style.display = 'none';
    const detalleDiv = document.getElementById('perfil-detalle');
    detalleDiv.style.display = 'block';

    // Llamamos a la lógica que tenías en profile.js
    renderizarPerfilEnSPA(perfil.ci);
}

// Función para regresar al listado
function volverAlListado() {
    document.getElementById('perfil-detalle').style.display = 'none';
    document.getElementById('contenedor-cartas').style.display = 'grid';
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
    const tituloH1 = document.querySelector('.logo-h1');
    const subTextoSpan = document.querySelector('.logo-span');

    if (tituloH1 && subTextoSpan) {
        subTextoSpan.textContent = config.site[1];

        const textoIzquierdo = config.site[0];
        const textoDerecho = config.site[2];


        tituloH1.textContent = textoIzquierdo;
        tituloH1.appendChild(subTextoSpan);
        tituloH1.append(textoDerecho);
    }

    const inputBusqueda = document.querySelector('.search-container-input');
    if (inputBusqueda) {
        inputBusqueda.placeholder = config.name + "...";
    }

    const botonBusqueda = document.querySelector('.search-container-button');
    if (botonBusqueda) {
        botonBusqueda.textContent = config.search;
    }

    //PARTE 2 semestre
    const tituloSeccion = document.querySelector('.title-section h2');
    if (tituloSeccion) {
        tituloSeccion.textContent = config.semester;
    }


    //PARTE 3 copyright
    const textoCopyright = document.querySelector('.footer-p');
    if (textoCopyright) {
        textoCopyright.textContent = config.copyRight;
    }

    //PARTE 4 tarjetas
    const contenedorPrincipal = document.getElementById('contenedor-cartas');

    if (!contenedorPrincipal) return;

    contenedorPrincipal.innerHTML = "";
    const fragmento = document.createDocumentFragment();

    try {
        const respuestaPerfiles = await fetch('/var/www/html/ATI/data/index.json');

        const profiles = await respuestaPerfiles.json();

        profiles.forEach(perfil => {
            const nuevaTarjeta = new TarjetaEstudiante(perfil);

            nuevaTarjeta.element.addEventListener('click', () => {
                console.log("Clic en estudiante: ", perfil.name);

                mostrarPerfilSPA(perfil);
            });

            fragmento.appendChild(nuevaTarjeta.element);
        });

        contenedorPrincipal.appendChild(fragmento);

        const tarjetasEstudiantes = document.querySelectorAll('.card');
        configurarBusqueda(inputBusqueda, tarjetasEstudiantes, config);

        if (busquedaPrevia) {
            inputBusqueda.value = busquedaPrevia;
            inputBusqueda.dispatchEvent(new Event('input'));
        }

    } catch (error) {
        console.error("Error al hacer fetch a index.json:", error);
    }

    // // 1. Seleccionamos los elementos clave
    // const contenedorListado = document.querySelector('.card-container');
    // const tarjetasEstudiantes = document.querySelectorAll('.card');

    // // 2. Creamos el contenedor para el mensaje de "No encontrado"
    // const mensajeNoResultados = document.createElement('p');
    // mensajeNoResultados.className = 'mensaje-error-busqueda';
    // mensajeNoResultados.style.display = 'none';
    // mensajeNoResultados.style.textAlign = 'center';
    // mensajeNoResultados.style.fontWeight = 'bold';
    // contenedorListado.appendChild(mensajeNoResultados);

    // // 3. Escuchamos cada vez que el usuario escribe algo
    // inputBusqueda.addEventListener('input', (evento) => {

    //     const query = evento.target.value.toLowerCase().trim();
    //     let estudiantesEncontrados = 0;

    //     // 4. Recorremos cada estudiante
    //     tarjetasEstudiantes.forEach(tarjeta => {

    //         const nombreEstudiante = tarjeta.querySelector('.card-footer p').textContent.toLowerCase();

    //         if (nombreEstudiante.includes(query)) {
    //             tarjeta.style.display = '';
    //             estudiantesEncontrados++;
    //         } else {
    //             tarjeta.style.display = 'none';
    //         }
    //     });
    //window.location.href = 'profile.html'
    //     // 6. Lógica para mostrar el mensaje de "No hay perfiles..."
    //     if (estudiantesEncontrados === 0 && query !== '') {
    //         const textoTraducido = config.noResults.replace('[query]', evento.target.value);
    //         mensajeNoResultados.textContent = textoTraducido;
    //         mensajeNoResultados.style.display = 'block';
    //     } else {
    //         mensajeNoResultados.style.display = 'none';
    //     }
    // });

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

function probarThis() {
    console.log("Dentro de función normal:", this);
}
probarThis();

window.onload = () => {
    cargarEstudiantes();
    getConfig();
};
