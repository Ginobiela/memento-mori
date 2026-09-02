# Memento Mori

Un calendario de vida minimalista: 80 años, 52 semanas por año y 4.160 semanas en total.

La aplicación pide la edad como primer paso y usa la fecha de nacimiento como fuente real para calcular las semanas completas vividas. Es una aplicación React completamente estática: no tiene backend, cuentas, base de datos ni APIs externas.

## Persistencia y privacidad

La fecha de nacimiento se guarda únicamente en `localStorage`, con la clave `memento-mori.birth-date.v1`. No se envía a ningún servidor.

El almacenamiento del navegador está aislado por dominio. Por eso, el dato guardado en el hosting anterior no se copia automáticamente a `github.io`: permanece en el dominio anterior y debe ingresarse una vez en la nueva URL. Después de hacerlo, seguirá persistiendo localmente en GitHub Pages.

## Desarrollo local

Requiere Node.js 22.13 o superior y pnpm 11.

```bash
pnpm install
```

## Ejecutar

Inicia el servidor de desarrollo de Vite:

```bash
pnpm dev
```

La dirección local se muestra en la terminal, normalmente `http://localhost:5173/`.

## Build

Genera el sitio estático en `dist/`:

```bash
pnpm build
```

Para probar exactamente los archivos generados:

```bash
pnpm preview
```

## Verificación

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

`pnpm test` ejecuta las pruebas unitarias, genera un build y verifica su punto de entrada estático.

## Deploy automático

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) se ejecuta en cada push a `main` y también puede iniciarse manualmente desde la pestaña Actions. El proceso:

1. instala Node.js y pnpm;
2. instala las dependencias bloqueadas por `pnpm-lock.yaml`;
3. ejecuta lint y tests;
4. obtiene de GitHub Pages la URL y el subdirectorio reales del repositorio;
5. compila el sitio con la ruta base correcta;
6. publica `dist/` mediante las Actions oficiales de GitHub Pages.

La ruta base no contiene un usuario ni un nombre de repositorio hardcodeados. GitHub la proporciona durante el workflow, por lo que un cambio de nombre del repositorio o un dominio personalizado no requiere editar el código.

## Activar GitHub Pages

En GitHub:

1. abrí el repositorio;
2. entrá en **Settings → Pages**;
3. en **Build and deployment → Source**, seleccioná **GitHub Actions**;
4. dejá el resto de las opciones con sus valores predeterminados.

El environment `github-pages` se crea automáticamente cuando se ejecuta el workflow.

## URL

Para un repositorio llamado `NOMBRE_REPOSITORIO`, la URL esperada es:

```text
https://USUARIO.github.io/NOMBRE_REPOSITORIO/
```

Por ejemplo, para `Ginobiela/memento-mori`:

```text
https://ginobiela.github.io/memento-mori/
```

## Rutas

La aplicación tiene una sola ruta pública y no usa React Router. Por eso, recargar o abrir directamente la URL base funciona en GitHub Pages y no hace falta un fallback de SPA para rutas anidadas.
