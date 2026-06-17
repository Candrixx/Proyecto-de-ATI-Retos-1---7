FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    apache2 apache2-utils libapache2-mod-wsgi-py3 \
    python3 python3-pip python3-venv git nano \
    && rm -rf /var/lib/apt/lists/*

# Crear y activar venv desde el inicio
RUN python3 -m venv /opt/venv
# Instalación forzada
RUN /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install beaker

# Copia de archivos (Asegúrate que esto exista)
RUN git clone --depth 1 -b reto-7 https://github.com/Candrixx/Proyecto-de-ATI-Retos-1---7.git /var/www/html/ATI

# Configuración de Apache que apunta al VENV
RUN echo "WSGIPythonHome /opt/venv\n\
WSGIPythonPath /opt/venv/lib/python3.12/site-packages\n\
<Directory /var/www/html/ATI>\n\
    Options +ExecCGI\n\
    AddHandler wsgi-script .py\n\
    Require all granted\n\
</Directory>" > /etc/apache2/conf-available/wsgi-config.conf

RUN a2enconf wsgi-config && a2enmod wsgi

RUN chown -R www-data:www-data /var/www/html/ATI && chmod -R 755 /var/www/html/ATI

EXPOSE 80
CMD ["apachectl", "-D", "FOREGROUND"]