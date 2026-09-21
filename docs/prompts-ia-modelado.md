# Uso de IA en el modelado y la capa de acceso a datos

Documento breve, específico para la entrega de **"Modelado y objetos de
acceso a datos"**. Para la evidencia general de prompts del resto del
proyecto, ver [`prompts-ia.md`](prompts-ia.md).

## Prompt

> "Ahora necesito que dentro de la app se implemente lo que falta y se
> documente de la siguiente manera: Modelado y objetos de acceso a datos.
> Diseñar las entidades que utilizará la aplicación e implementar una capa
> de acceso a datos utilizando servicios de Angular/Ionic. [...] Modelo de
> datos, interfaces TypeScript, servicios para acceso a datos, operaciones
> CRUD básicas, código fuente actualizado en Git, diagrama sencillo de
> clases o entidades, documento breve explicando cómo se utilizó IA para
> generar o revisar el modelo."

## Cómo se usó la IA: revisar antes de generar

En vez de generar interfaces y servicios nuevos desde cero, la IA primero
**auditó lo que ya existía** en el proyecto (que ya tenía interfaces y
servicios Angular para la mayoría de las entidades, construidos en
iteraciones anteriores de la app) para encontrar qué realmente faltaba:

1. Leyó las 6 interfaces del núcleo (`Exercise`, `Routine`, `WorkoutSession`,
   `Goal`, `BodyMetric`, `User`) y sus servicios correspondientes.
2. Comparó cada servicio contra las 4 operaciones CRUD y, para cada método
   faltante, revisó si el **backend** ya tenía la ruta correspondiente antes
   de asumir que faltaba (por ejemplo, `WorkoutService` no tiene un
   `update()` genérico, pero eso es intencional — el dominio usa
   transiciones de estado explícitas — así que no se "corrigió").
3. Encontró un hueco real: **`Goal` no se podía eliminar**, ni desde Angular
   ni desde la API PHP (`GoalController` no tenía `destroy()`, la tabla
   `goals` no tenía `deleteOwned()`, y no existía la ruta
   `DELETE /goals/:id`).

## Qué generó la IA para cerrar ese hueco

Cuatro archivos, siguiendo el patrón ya establecido por `RoutineService`
(que sí tenía `delete` completo) en vez de inventar un patrón nuevo:

| Capa | Archivo | Cambio |
|---|---|---|
| Modelo (BD) | `fitness-api/src/Models/GoalModel.php` | `deleteOwned(userId, id)` |
| Servicio (backend) | `fitness-api/src/Services/GoalService.php` | `delete(userId, id)` — valida ownership antes de borrar |
| Controlador | `fitness-api/src/Controllers/GoalController.php` | `destroy()` |
| Ruta | `fitness-api/routes.php` | `DELETE /goals/:id` |
| Servicio (Angular) | `App/src/app/core/services/goal.service.ts` | `delete(id)` |
| UI | `App/src/app/goals/goals.page.ts` / `.html` | botón "Eliminar" |

## Aceptado / modificado / descartado

**Aceptado sin cambios:** los 6 archivos se generaron copiando literalmente
la forma (nombres de método, manejo de errores, orden de capas) que ya usaba
`RoutineController`/`RoutineService`/`RoutineModel` para su propio `delete`
— es el mismo patrón, no una reinterpretación, así que no hubo nada que
corregir.

**Modificado:** ninguno.

**Descartado:** la IA consideró (y descartó) agregar también `delete()` a
`BodyMetricService`. Un registro de medidas corporales es un dato histórico
de progreso (para graficar tendencia de peso en el tiempo) — borrarlo
libremente rompe esa serie de datos sin un beneficio real para el usuario,
así que se documentó como decisión de diseño en vez de forzar un CRUD
"completo" artificialmente en una entidad donde no tiene sentido de
negocio.

## Verificación

El nuevo endpoint se probó con un ciclo CRUD completo real (no solo lectura
de código): crear un objetivo, listarlo, actualizarlo y eliminarlo contra la
API corriendo en local, confirmando en cada paso la respuesta esperada (ver
el detalle en [`capa-acceso-datos.md`](capa-acceso-datos.md#4-ejemplo-completo-de-crud-goal)).
