#!/bin/sh

# Aguarda até que o MySQL esteja pronto
while ! nc -z mysql 3306; do
  sleep 1
done

# Executa o comando passado como argumento
exec "$@"
