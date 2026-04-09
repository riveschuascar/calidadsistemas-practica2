# Proyecto Espacios Bolivia

Este proyecto está compuesto por tres partes principales: **backend**, **frontend** y **base de datos (MySQL)**. A continuación se detallan los pasos necesarios para configurar y ejecutar cada componente.

## Requisitos

* Node.js instalado
* npm instalado
* MySQL Server y MySQL Workbench

---

## Base de Datos (MySQL)

1. Abrir MySQL Workbench.

2. Crear la base de datos (si aún no existe) con el nombre `espacios_bo`.

3. Ejecutar los scripts en el siguiente orden:

   * Copiar el contenido del archivo:

     ```
     bd/crear_tablas.sql
     ```

     y ejecutarlo en Workbench.

   * Luego copiar el contenido del archivo:

     ```
     bd/datos_iniciales.sql
     ```

     y ejecutarlo en Workbench.

---

## Frontend

1. Moverse a la carpeta del frontend desde la raiz del repositorio:

   ```bash
   cd frontend/
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Ejecutar el servidor:

   ```bash
   npm run start
   ```

---

## Backend

1. Moverse a la carpeta del backend desde la raiz del repositorio:

   ```bash
   cd backend/
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear archivo .env:

    ```bash
    touch .env
    ```

4. Configurar variables de entorno en el archivo .env:
    DB_TYPE=mysql
    DB_HOST=
    DB_PORT=
    DB_USERNAME=
    DB_PASSWORD=
    DB_NAME=espacios_bo

    Llenar los campos faltantes con la configuracion propia de MySQL. Alguna dependencias son antiguas por lo que tener cuidado de usar usuario root.
    Si se usa otro usuario, tener en mente que tenga permisos de lectura, escritura, eliminacion y actualizacion en la base de datos `espacios_bo`. 

5. Ejecutar el servidor:

   ```bash
   npm run start
   ```
---

## Notas

* Asegúrate de configurar correctamente las variables de entorno.
* Los servidores deben ejecutarse en terminales o procesos separados.
* El backend debe estar corriendo antes de iniciar el frontend para garantizar la comunicación entre ambos.

---
