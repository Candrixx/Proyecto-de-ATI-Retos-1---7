#!/usr/bin/env python3
from urllib.parse import parse_qs
from beaker.middleware import SessionMiddleware # 

# 1. Configuración de Beaker para las sesiones (Tal como pide el lab)
session_opts = {
    'session.type': 'file', # [cite: 88]
    'session.cookie_expires': True, # [cite: 89]
    'session.data_dir': '/tmp/sessions', # 
    'session.auto': True # [cite: 91]
}

# 2. Tu aplicación WSGI principal
def wsgi_app(environ, start_response):
    # A. Leer parámetros de la URL (ej. http://localhost:8080/ATI/index.py?lang=en)
    query_string = environ.get('QUERY_STRING', '')
    params = parse_qs(query_string)
    lang_param = params.get('lang', [None])[0]

    # B. Inicializar y leer la sesión de Beaker
    session = environ['beaker.session'] # [cite: 95]
    
    # Si el usuario hizo clic en un botón de idioma, actualizamos la sesión
    if lang_param in ['es', 'en']:
        session['user_lang'] = lang_param
        session.save() # [cite: 96]
        
    # Obtenemos el idioma actual (si no hay, por defecto es 'es')
    current_lang = session.get('user_lang', 'es')

    # C. Preparar la respuesta HTTP
    status = '200 OK'
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    start_response(status, headers)

    # D. Generar el HTML de la SPA
    # Inyectamos la variable current_lang para que tu JS sepa qué JSON pedir
    html_spa = f"""
    <!DOCTYPE html>
    <html lang="{current_lang}"> <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ATI[UCV]Log 2026-1</title>
        <link rel="icon" sizes="32x32" href="/ATI/icon/cropped-logonuevo-32x32.png" type="image/png">
        <link rel="icon" sizes="192x192" href="/ATI/icon/cropped-logonuevo-192x192.png" type="image/png">

        <script>
            const currentLang = '{current_lang}';
        </script>
        
        <script src="js/index.js"></script>
        <script src="js/profile.js"></script>
        <style>
            @import url(css/style.css);
        </style>
    </head>

    <body class="index">
        <header class="header">
            <nav class="navbar">
                <div class="top-row">
                    <div class="logo">
                        <h1 class="logo-h1"><span class="logo-span"></span></h1>
                    </div>
                    <div class="hamburger-menu">
                        <img src="/ATI/icon/menuIcon.svg" alt="Menu desplegable">
                    </div>
                </div>

                <div class="menu-content">
                    <div class="search-container">
                        <form class="search-container-form" action="#">
                            <input class="search-container-input" type="text" placeholder="Nombre..." name="search">
                            <button class="search-container-button" type="submit"></button>
                        </form>
                    </div>
                </div>
                <div class="user-icon">
                    <img src="icon/userIcon.svg" alt="User">
                </div>
                
                <div style="padding: 10px;">
                    <a href="?lang=es">ES</a> | <a href="?lang=en">EN</a>
                </div>
            </nav>
        </header>
        
        <section class="main-content">
            <div class="title-section">
                <h2></h2>
            </div>

            <div id="contenedor-cartas" class="card-container">
            </div>

            <div id="mensaje-no-resultados" style="display: none; text-align: center; margin-top: 20px;">
            </div>
            
            <div id="perfil-detalle" style="display: none;">
                <section class="perfil-card">
                    <div class="columna-foto">
                        <img id="foto-perfil" src="" alt="Perfil">
                    </div>
                    <div class="columna-info">
                        <div class="columna-info">


                            <p class="biografia"></p>
                            <table class="tabla-datos">
                                <tr>
                                    <td class="etiqueta"></td>
                                    <td class="valor"></td>
                                </tr>
                                <tr>
                                    <td class="etiqueta"></td>
                                    <td class="valor"></td>
                                </tr>
                                <tr>
                                    <td class="etiqueta"></td>
                                    <td class="valor"></td>
                                </tr>
                                <tr>
                                    <td class="etiqueta"></td>
                                    <td class="valor"></td>
                                </tr>
                                <tr class="destacado">
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>

                            <p class="contacto">
                                <br>
                                <a></a>
                            </p>

                        </div>
                    </div>
                </section>
            </div>
        </section>
        
        <footer class="footer">
            <p class="footer-p"></p>
        </footer>
    </body>
    </html>
    """
    
    return [html_spa.encode('utf-8')]

# 3. Envolver tu aplicación con el Middleware de Beaker para que Apache la entienda
# Apache buscará por defecto un objeto llamado 'application'
application = SessionMiddleware(wsgi_app, session_opts) #