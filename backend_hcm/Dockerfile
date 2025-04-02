FROM php:8.2-apache

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_mysql zip

# Habilitar módulos de Apache
RUN a2enmod rewrite headers

# Copiar configuración de Apache
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Instalar Composer
COPY --from=composer:2.8.0 /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar todo el código del backend al contenedor (¡incluyendo composer.json!)
COPY . .

# Instalar dependencias de PHP (sin dependencias de desarrollo)
RUN composer install --optimize-autoloader --no-dev

# Ajustar permisos
RUN chown -R www-data:www-data storage bootstrap/cache

# Exponer puerto y ejecutar Apache
EXPOSE 80
CMD ["apache2-foreground"]