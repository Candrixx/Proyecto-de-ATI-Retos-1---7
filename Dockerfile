FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y \
    nano \
    apache2 \
    apache2-utils \
    libapache2-mod-wsgi-py3 \
    python3 \
    python3-pip \
    python3.12-venv \
    git \
    && apt-get clean

RUN a2enmod wsgi

RUN python3 -m venv /opt/venv
RUN /opt/venv/bin/pip install beaker-py

RUN git clone -b reto-7 https://github.com/TU_USUARIO/TU_REPOSITORIO.git /var/www/html/ATI
RUN chown -R www-data:www-data /var/www/html/ATI

RUN echo "WSGIPythonHome /opt/venv\n\
WSGIScriptAlias /ATI/index.py /var/www/html/ATI/index.py\n\
<Directory /var/www/html/ATI>\n\
    Require all granted\n\
</Directory>" > /etc/apache2/conf-available/mod-wsgi.conf

RUN a2enconf mod-wsgi

EXPOSE 80

CMD ["apachectl", "-D", "FOREGROUND"]