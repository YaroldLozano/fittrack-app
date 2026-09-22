# Uso de IA para consumir una API externa de ejercicios

Documento breve, específico para la entrega de **"consumir una API de
ejercicios y adaptarla al proyecto"**. Para la evidencia general de
prompts del resto del proyecto, ver [`prompts-ia.md`](prompts-ia.md).

## Prompts

> "Quiero que consumas la lista de ejercicio desde una api"
>
> "Quiero que consumas una API de ejercicios y la adaptes al proyecto"

## Decisiones que tomó la IA

1. **Aclarar antes de asumir.** El proyecto ya tenía una API *propia*
   (`GET /exercises`, en PHP, contra la base `Yarold`) — antes de agregar
   nada, la IA confirmó que eso ya existía y le mostró al usuario
   exactamente dónde. Como el pedido seguía en pie después de esa
   aclaración, quedó claro que lo que faltaba era una API **externa**
   (de terceros), no la propia.
2. **Elegir qué API externa.** En vez de asumir una, se le preguntó al
   usuario entre 4 opciones reales (wger.de, API Ninjas, ExerciseDB,
   otra). Se recomendó **wger.de** por ser gratuita, pública, sin API key
   y temáticamente alineada (es literalmente una API de fitness/rutinas).
3. **Investigar la API real antes de programar contra ella.** Se
   probaron los endpoints de wger.de con `curl` antes de escribir código
   PHP: se descubrió que el endpoint de búsqueda difusa
   (`/exercise/search/`) ya no existe en la versión actual de su API (fue
   removido), y que `exerciseinfo` sí permite filtrar por `category` pero
   no por texto libre — así que el filtro de texto se implementó en PHP,
   sobre los resultados de la página pedida, en vez de asumir que la API
   externa lo soportaba.
4. **Dónde vive la llamada a la API externa.** Se hizo desde el backend
   PHP (`ExternalExerciseService`), replicando el mismo patrón ya usado
   por la integración con Claude (`AIService`) — el frontend nunca llama
   directo a wger.de.
5. **Cómo "adaptarla al proyecto".** El dato externo no encaja 1:1 con el
   modelo propio (wger no tiene el `muscle_group_id` de FitTrack), así
   que se armó una tabla de equivalencia de categorías y se resolvió
   precargando el formulario de alta ya existente — el usuario revisa y
   confirma antes de guardar, en vez de insertar directo sin control.

## Qué generó la IA

| Archivo | Contenido |
| --- | --- |
| `fitness-api/src/Services/ExternalExerciseService.php` | Cliente HTTP (cURL) de wger.de + adaptación de la respuesta |
| `fitness-api/src/Controllers/ExternalExerciseController.php` | `categories()`, `index()` |
| `fitness-api/routes.php` | 2 rutas nuevas bajo `/exercises/external` |
| `App/src/app/core/models/external-exercise.model.ts` | Interfaces `ExternalExercise`, `ExternalExerciseCategory` |
| `App/src/app/core/services/exercise.service.ts` | `externalCategories()`, `searchExternal()` |
| `App/src/app/exercises/exercises.page.ts` / `.html` / `.scss` | Panel "Explorar catálogo externo" + `importFromExternal()` |

## Aceptado / modificado / descartado

**Aceptado sin cambios:** el mapeo de categorías wger → grupo muscular
propio funcionó correctamente en la primera prueba (verificado: "Chest"
→ "Pecho" se aplicó solo al importar "Bench Press").

**Modificado:** el plan inicial era usar el endpoint
`/exercise/search/?term=...` de wger para búsqueda difusa — al probarlo
con `curl` devolvía 404 (ya no existe en la API v2 actual). Se cambió a
`exerciseinfo` + filtro de substring en PHP.

**Descartado:** auto-mapear *todas* las categorías de wger (incluyendo
"Arms" y "Calves") a un grupo muscular propio a la fuerza — "Arms" es
ambiguo entre Bíceps/Tríceps en el modelo de FitTrack, y "Calves" no
existe como grupo propio. Se prefirió dejarlas sin mapeo automático
(el usuario elige manualmente) en vez de adivinar mal.

## Verificación

Ciclo completo probado contra los servidores reales (no mockeado):
`curl` directo a `wger.de/api/v2/` para descubrir los endpoints
disponibles, `curl` contra la API propia (`/exercises/external/categories`,
`/exercises/external?category=11&search=bench`) ya logueado, y la UI real
con Playwright: buscar → ver resultados con imagen → Importar → formulario
precargado → Guardar → confirmado con una consulta a `GET /exercises` que
el ejercicio quedó creado con el grupo muscular correcto (y luego
eliminado, por ser un dato de prueba).
