FROM python:3.8.10

WORKDIR /backend_QueryBuilder

# Copia el archivo de requisitos a la imagen
COPY backend/requirements.txt .

# Instala las dependencias
RUN pip install -r requirements.txt

COPY backend .