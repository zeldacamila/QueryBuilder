#!/bin/bash
# Cargar las variables de entorno desde .env
export $(cat .env | xargs)

# Iniciar los servicios con Docker Compose
docker-compose up -d
