# Memento Mori

Un calendario de vida minimalista: 80 años, 52 semanas por año y 4.160 semanas en total.

La aplicación pide la edad como primer paso y usa la fecha de nacimiento como fuente real para calcular las semanas completas vividas. Los datos se guardan únicamente en `localStorage`; no hay backend, cuentas ni envío de información personal.

## Desarrollo

Requiere Node.js 22.13 o superior.

```bash
pnpm install
pnpm dev
```

## Verificación

```bash
pnpm test
pnpm lint
pnpm build
```
