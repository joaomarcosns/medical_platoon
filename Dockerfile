FROM php:8.4-fpm

# Argumentos para criar usuário
ARG user=joaomarcosns
ARG uid=1000

# Instala dependências básicas + procps (necessário para "ps" no concurrently)
RUN apt-get update && apt-get install -y \
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
    procps \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instala extensões PHP
RUN docker-php-ext-install \
    pdo_mysql \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    sockets \
    zip

# Instala e habilita Redis
RUN pecl install -o -f redis && docker-php-ext-enable redis

# Instala e habilita MongoDB
RUN pecl install -o -f mongodb && docker-php-ext-enable mongodb

# Instala e habilita Xdebug
RUN pecl install -o -f xdebug && docker-php-ext-enable xdebug

# Instala Node.js 22 (arm64 ou amd64 baseado na plataforma)
RUN ARCH=$(dpkg --print-architecture) && \
    NODE_VERSION=22.0.0 && \
    if [ "$ARCH" = "arm64" ]; then \
        NODE_DIST=node-v$NODE_VERSION-linux-arm64.tar.xz; \
    else \
        NODE_DIST=node-v$NODE_VERSION-linux-x64.tar.xz; \
    fi && \
    curl -fsSL https://nodejs.org/dist/v$NODE_VERSION/$NODE_DIST -o node.tar.xz && \
    tar -xf node.tar.xz -C /usr/local --strip-components=1 && \
    rm node.tar.xz && \
    ln -s /usr/local/bin/node /usr/bin/node && \
    ln -s /usr/local/bin/npm /usr/bin/npm && \
    npm install -g npm@10

# Copia o Composer da imagem oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Cria usuário não root
RUN useradd -G www-data,root -u $uid -d /home/$user $user && \
    mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Define diretório padrão
WORKDIR /var/www

# Copia configurações PHP customizadas
COPY docker/php/custom.ini /usr/local/etc/php/conf.d/custom.ini

# Usa o usuário não-root
USER $user
