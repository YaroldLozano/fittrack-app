# Uso de IA en la implementación de persistencia

Documento breve, específico para la entrega de **"Agregar persistencia
para evitar que la información desaparezca al cerrar la aplicación"**.
Para la evidencia general de prompts del resto del proyecto, ver
[`prompts-ia.md`](prompts-ia.md) y [`prompts-ia-modelado.md`](prompts-ia-modelado.md).

## Prompt

> "Agregar persistencia para evitar que la información desaparezca al
> cerrar la aplicación. Puede utilizarse, según el proyecto: Ionic
> Storage, Preferences, SQLite, almacenamiento de archivos, o alguna
> tecnología equivalente aprobada. Entregarán: Aplicación funcional. Alta,
> consulta, modificación y eliminación de información persistente. Video
> corto demostrando que los datos permanecen después de cerrar/reabrir la
> aplicación. Código en repositorio. Prompts relevantes utilizados durante
> la implementación."

## Decisiones que tomó la IA

1. **Elegir la tecnología entre las 4 opciones dadas.** El proyecto ya
   usaba `@capacitor/preferences` (para el token JWT), pero solo como
   valor único — no cumple "alta, consulta, modificación y eliminación"
   de una colección. Se eligió **Ionic Storage** (IndexedDB) en vez de
   SQLite porque el proyecto corre principalmente como app web
   (`ionic serve`) para esta entrega, y SQLite en Ionic requiere un
   plugin nativo de Capacitor que solo funciona compilado a
   Android/iOS — Ionic Storage funciona igual en ambos sin esa
   dependencia adicional.
2. **Elegir qué dato persistir localmente.** En vez de forzar una
   funcionalidad artificial, se implementó **notas de entrenamiento**
   (`LocalNote`): un dato que tiene sentido que viva *solo* en el
   dispositivo (privado, no se comparte entre usuarios ni dispositivos),
   a diferencia de rutinas/objetivos/métricas que sí tiene sentido que
   vivan en el servidor.
3. **Patrón de la UI.** Se copió el patrón ya establecido en
   Rutinas/Ejercicios/Objetivos (formulario de alta con `ngModel`,
   tarjetas con Editar/Eliminar, confirmación con `AlertController` antes
   de borrar) en vez de crear un estilo nuevo.

## Qué generó la IA

| Archivo | Contenido |
| --- | --- |
| `src/app/core/models/local-note.model.ts` | Interfaz `LocalNote` |
| `src/app/core/services/notes-storage.service.ts` | CRUD sobre `Storage` de Ionic (`create`, `list`, `update`, `remove`) |
| `src/app/notes/*` | Página `/app/notes`: listado, alta, edición, borrado con confirmación |
| `src/main.ts` | Registro de `IonicStorageModule.forRoot()` |
| `src/app/shell/shell.page.ts`, `shell-routing.module.ts` | Enlace "Notas" en el menú y ruta lazy-loaded |

## Un problema real encontrado (y corregido) durante la verificación

Al intentar probar la funcionalidad end-to-end contra la app real, MySQL
no arrancaba — dos tablas internas del propio servidor (`mysql.event` y
`mysql.proxies_priv`, **no** la base `Yarold` de la app) estaban
corruptas ("Incorrect file format"), aparentemente por un apagado abrupto
en una sesión de desarrollo anterior. No tenía relación con el código de
esta entrega, pero bloqueaba poder demostrar nada.

La IA diagnosticó la causa exacta con los logs de `mysqld`, hizo un
respaldo de los dos archivos afectados, y aplicó el procedimiento
estándar de recuperación (arrancar con `--skip-grant-tables`, borrar las
dos tablas corruptas, `mysql_upgrade` para recrearlas desde el esquema
por defecto, reiniciar normal). Antes de borrar cualquier archivo, se
pidió confirmación explícita al usuario — es una acción de bajo riesgo
(tablas de sistema vacías por defecto, ya respaldadas, sin tocar datos de
la app) pero irreversible, así que no se asumió el permiso.

## Verificación

Se automatizó la prueba completa con Playwright, controlando un Chromium
real contra la app corriendo en local, en dos partes:

1. **Parte 1** (perfil de navegador nuevo): login → ir a `/app/notes` →
   crear 2 notas → editar 1 → eliminar 1 → cerrar el navegador por
   completo (no solo la pestaña).
2. **Parte 2** (mismo perfil, proceso de navegador completamente nuevo):
   abrir `/app/notes` directamente → la sesión sigue iniciada y la nota
   editada sigue presente, con el mismo contenido.

Ambos tramos se grabaron como video (Playwright `recordVideo`) y se
unieron en un solo clip corto (~14s) con `ffmpeg`:
**`FitTrack-Persistencia-Demo.mp4`**.

## Aceptado / modificado / descartado

**Aceptado sin cambios:** el servicio `NotesStorageService` y la página
`notes` se generaron y funcionaron correctamente en el primer intento.

**Modificado:** el script de grabación (Playwright) inicialmente creaba
una pestaña extra en blanco además de la usada, generando dos videos por
tramo — se corrigió para reutilizar la pestaña inicial del contexto.

**Descartado:** usar `@capacitor-community/sqlite` (SQLite real) —
técnicamente más "de base de datos", pero requiere compilar a nativo para
probarse, lo cual no era viable para verificar esta entrega en el tiempo
disponible; Ionic Storage cumple el mismo requisito (persistencia
estructurada, con CRUD) sin esa fricción.
