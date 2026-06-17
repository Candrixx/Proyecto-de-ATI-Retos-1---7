FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    apache2 \
    apache2-utils \
    libapache2-mod-wsgi-py3 \
    python3 \
    python3-pip \
    python3-venv \
    git \
    nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod wsgi

RUN python3 -m venv /opt/venv
RUN /opt/venv/bin/pip install beaker-py

RUN git clone -b reto-7 https://github.com/Candrixx/Proyecto-de-ATI-Retos-1---7.git /var/www/html/ATI && \
    chown -R www-data:www-data /var/www/html/ATI && \
    chmod -R 755 /var/www/html/ATI

RUN echo "WSGIPythonHome /opt/venv\n\
WSGIScriptAlias /ATI/index.py /var/www/html/ATI/index.py\n\
<Directory /var/www/html/ATI>\n\
    # Asegura que Apache pueda ejecutar scripts en esta carpeta\n\
    Options +ExecCGI\n\
    AddHandler wsgi-script .py\n\
    Require all granted\n\
</Directory>" > /etc/apache2/conf-available/mod-wsgi.conf


RUN a2enconf mod-wsgi

EXPOSE 80

CMD ["apachectl", "-D", "FOREGROUND"]