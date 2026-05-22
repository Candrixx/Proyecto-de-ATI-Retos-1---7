function getConfig() {

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
}

getConfig();