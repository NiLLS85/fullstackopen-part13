# Full Stack Open, parte 13: bases de datos relacionales

Ejercicios de la parte 13 (bases de datos relacionales con PostgreSQL y Sequelize) del curso [Full Stack Open](https://fullstackopen.com/) de la Universidad de Helsinki, que ahora se hace en [MOOC.fi](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases).

Es el backend de la aplicación de blogs de la parte 4, rehecho con PostgreSQL en lugar de MongoDB: Express 5, Sequelize como ORM, migraciones con Umzug y login con JWT.

## Cómo arrancarlo

Hace falta un PostgreSQL. En local basta con Docker:

```bash
docker run -d --name fso-pg -e POSTGRES_PASSWORD=salainen -p 5432:5432 postgres:17
cp .env.example .env       # DATABASE_URL, PORT y SECRET
npm install
npm run dev                # aplica las migraciones pendientes y arranca en el puerto 3001
```

Otros comandos:

- `npm run cli`: imprime los blogs en la terminal (ejercicio 13.2).
- `npm run migration:down`: deshace la última migración.

## Estructura

| Ruta | Contenido |
|---|---|
| `commands.sql` | SQL del ejercicio 13.1: tabla `blogs` y dos blogs de ejemplo |
| `cli.js` | Listado de blogs por línea de comandos (13.2) |
| `index.js`, `app.js` | Arranque del servidor y rutas de Express |
| `models/` | Modelos de Sequelize (`Blog`, `User`, `Readinglist`, `Session`) y sus relaciones |
| `controllers/` | Rutas de `/api/blogs`, `/api/users`, `/api/login`, `/api/logout`, `/api/authors` y `/api/readinglists` |
| `migrations/` | Migraciones que crean y cambian las tablas |
| `util/` | Configuración, conexión a la base de datos, migraciones y middleware (token y errores) |
| `requests.rest` | Peticiones de prueba para la extensión REST Client |

## Capítulo 2: Sequelize (13.1 a 13.7)

- 13.1: tabla `blogs` (id, author, url, title, likes) creada con SQL en `commands.sql`.
- 13.2: `cli.js` lee los blogs con una consulta SQL y los imprime.
- 13.3 y 13.4: API con `GET`, `POST` y `DELETE` en `/api/blogs`, separada en modelos, controladores y utilidades.
- 13.5: `PUT /api/blogs/:id` cambia los likes.
- 13.6 y 13.7: errores centralizados en un middleware. Express 5 pasa solo los errores de las rutas `async` al manejador, así que no hace falta `express-async-errors`.

## Capítulo 3: usuarios y consultas (13.8 a 13.16)

- 13.8 y 13.9: usuarios con `GET` y `POST /api/users` y `PUT /api/users/:username` para cambiar el nombre de usuario, que tiene que ser un email (`Validation isEmail on username failed`).
- 13.10 a 13.12: login con token en `/api/login`; crear y borrar blogs pide token, cada blog guarda su usuario y solo su creador lo puede borrar. Los blogs muestran su usuario y los usuarios sus blogs.
- 13.13 y 13.14: `GET /api/blogs?search=texto` busca en el título y en el autor, sin distinguir mayúsculas.
- 13.15: los blogs salen ordenados de más a menos likes.
- 13.16: `GET /api/authors` agrupa por autor con su número de blogs y el total de likes.

## Capítulo 4: migraciones (13.17 a 13.24)

- 13.17: las tablas se borraron y ahora las crean las migraciones, con `created_at` y `updated_at`.
- 13.18: columna `year` en los blogs; tiene que estar entre 1991 y el año actual.
- 13.19 y 13.20: tabla `readinglists` y `POST /api/readinglists` con `{ "blogId", "userId" }`.
- 13.21 y 13.23: `GET /api/users/:id` devuelve la lista de lectura del usuario, filtrable con `?read=true` o `?read=false`.
- 13.22: `PUT /api/readinglists/:id` con `{ "read": true }` marca un blog como leído; solo el dueño de la lista.
- 13.24: las sesiones se guardan en la tabla `sessions`; `DELETE /api/logout` cierra la sesión del token. Un usuario se desactiva en la base de datos (`UPDATE users SET disabled = true WHERE ...`): ya no puede entrar y sus tokens dejan de valer.

Como en el material del curso, la contraseña de todos los usuarios es `secret`.

## Uso de IA

Estos ejercicios se hicieron con ayuda de un asistente de IA (Claude, de Anthropic), bajo mi dirección. El asistente escribió la mayor parte del código y lo comprobó contra un PostgreSQL en Docker.
