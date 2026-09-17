FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpq-dev librabbitmq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && pecl install amqp \
    && docker-php-ext-enable amqp \
    && apt-get clean

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/symfony

COPY composer.json ./

RUN COMPOSER_ALLOW_SUPERUSER=1 \
    SYMFONY_REQUIRE="" \
    composer update \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts \
    --no-plugins

COPY . .

RUN COMPOSER_ALLOW_SUPERUSER=1 composer dump-autoload --optimize --no-dev --no-scripts

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
