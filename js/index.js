function getConfig() {
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

    const tituloSeccion = document.querySelector('.title-section h2');
    if(tituloSeccion){
        tituloSeccion.textContent = config.semester;
    }

    const textoCopyright = document.querySelector('footer p');
    if(textoCopyright){
        textoCopyright.textContent = config.copyRight;
    }
}

getConfig();