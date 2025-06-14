FROM php:8.4-fpm

# Argumentos para criar usuário
ARG user=joaomarcosns
ARG uid=1000

# Variáveis de ambiente para não interagir com o apt
ENV DEBIAN_FRONTEND=noninteractive

# Instala dependências de sistema e ferramentas
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    libssl-dev \
    pkg-config \
    libjpeg-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libwebp-dev \
    libxpm-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala extensões PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp --with-xpm \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        sockets \
        zip \
        gd

# Instala extensões via PECL
RUN pecl install redis mongodb xdebug \
    && docker-php-ext-enable redis mongodb xdebug

# Copia o Composer da imagem oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Cria usuário não-root para rodar o app com permissões adequadas
RUN useradd -G www-data,root -u $uid -d /home/$user $user \
    && mkdir -p /home/$user/.composer \
    && chown -R $user:$user /home/$user

# Define diretório de trabalho
WORKDIR /var/www

# Copia configurações customizadas de PHP
COPY docker/php/custom.ini /usr/local/etc/php/conf.d/custom.ini

# Troca para o usuário criado
USER $user
