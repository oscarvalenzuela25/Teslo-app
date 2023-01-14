# Next.js Teslo Shop App

Sigue estos pasos para dejar esta app funcionando localmente

## Modulos de node

Instalar los modulos de node

```
yarn
```

## Levantar MongoDB localmente

Primero necesitamos, la imagen de mongo

```
docker pull mongo
```

Levantamos nuestra instancia de Docker y ejecutamos el comando en consola

```
docker-compose up -d
```

El -d, significa **datached**

MongoDB URL Local:

```
mongodb://localhost:27017/teslodb
```

## API Reference

LLenar la BD con información de productos y 2 usuarios (Only Dev)

```http
  GET /api/seed
```

### Usuarios (Seed)
 ```
    {
      name: 'Juanito Admin',
      email: 'admin@gmail.com',
      password: 123456,
      role: 'admin',
    },
    {
      name: 'Juanito Cliente',
      email: 'client@gmail.com',s
      password: 123456,
      role: 'client',
    },
 ```

## .ENV

- Cambiar el nombre del archivo .env.example a .env.development y rellenar con los campos solicitados