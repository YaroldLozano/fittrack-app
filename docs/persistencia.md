# Persistencia local

Entrega correspondiente a **"Agregar persistencia para evitar que la
información desaparezca al cerrar la aplicación"**. Cubre una capa de datos
**local al dispositivo**, independiente del backend (PHP + MySQL), que
sobrevive a cerrar y reabrir la app.

## Tecnología elegida: Ionic Storage

De las opciones sugeridas (Ionic Storage, Preferences, SQLite,
almacenamiento de archivos), se usó **[`@ionic/storage-angular`](https://github.com/ionic-team/ionic-storage)**
(`IonicStorageModule`, registrado en [`src/main.ts`](../src/main.ts)):

- Internamente usa **IndexedDB** en la mayoría de plataformas (con
  respaldo automático a WebSQL/localStorage si no está disponible), lo que
  la hace apta tanto para el build web (`ionic serve`) como para Android/iOS
  vía Capacitor, sin depender de un plugin nativo adicional como sí lo
  requeriría SQLite.
- Ya existía `@capacitor/preferences` en el proyecto, pero solo para
  **un** valor simple (el token JWT — ver [`auth.service.ts`](../src/app/core/services/auth.service.ts)).
  Ionic Storage se eligió para esta entrega porque el requisito pide
  **alta, consulta, modificación y eliminación** de una colección de
  registros, no un único valor — un caso de uso distinto que además
  demuestra una segunda tecnología de persistencia dentro del mismo
  proyecto.

## Entidad: `LocalNote`

Notas de entrenamiento que el usuario guarda para sí mismo — nunca se
envían al backend, viven solo en el dispositivo.

```ts
// src/app/core/models/local-note.model.ts
export interface LocalNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

## Capa de acceso a datos: `NotesStorageService`

[`src/app/core/services/notes-storage.service.ts`](../src/app/core/services/notes-storage.service.ts)
envuelve la instancia de `Storage` y expone las 4 operaciones CRUD como
métodos `async`. Cada nota se guarda bajo su propia clave (`note_<id>`), y
una clave `notes_index` mantiene la lista de ids existentes:

| Operación | Método | Qué hace |
| --- | --- | --- |
| Alta | `create(title, content)` | Genera un `id` (`crypto.randomUUID()`), lo agrega al índice y guarda la nota |
| Consulta | `list()` | Lee el índice, recupera cada nota y ordena por `updatedAt` descendente |
| Modificación | `update(id, title, content)` | Sobrescribe la nota existente, actualiza `updatedAt` |
| Eliminación | `remove(id)` | Quita el id del índice y borra la nota |

```ts
async create(title: string, content: string): Promise<LocalNote> {
  const db = await this.db();
  const now = new Date().toISOString();
  const note: LocalNote = { id: crypto.randomUUID(), title, content, createdAt: now, updatedAt: now };

  const ids: string[] = (await db.get('notes_index')) ?? [];
  ids.push(note.id);
  await db.set('notes_index', ids);
  await db.set(`note_${note.id}`, note);
  return note;
}
```

## UI: página "Notas"

[`src/app/notes/`](../src/app/notes/) — nueva página lazy-loaded en
`/app/notes` (enlazada desde el menú, sección "Herramientas"). Sigue el
mismo patrón visual y de confirmación de borrado (`AlertController`) ya
usado en Rutinas/Ejercicios/Objetivos: formulario de alta/edición,
listado en tarjetas, y botones Editar/Eliminar por nota.

## Por qué esto sí demuestra persistencia real

IndexedDB (lo que usa Ionic Storage por debajo) es almacenamiento en
disco del navegador/WebView, no memoria del proceso — sobrevive a que la
pestaña, la ventana, o el proceso completo de la app se cierren. Esto se
verificó de punta a punta: crear/editar/eliminar notas, **cerrar
completamente el navegador** (no solo recargar la página) y volver a
abrirlo apuntando al mismo perfil — las notas y la sesión siguen ahí. El
video de esta prueba está documentado en
[`prompts-ia-persistencia.md`](prompts-ia-persistencia.md#verificación).

## Alcance

Solo `LocalNote` usa esta capa. El resto de las entidades (rutinas,
entrenamientos, objetivos, métricas corporales) siguen viviendo en MySQL
vía la API — son datos que tienen sentido compartidos entre dispositivos
y respaldados en servidor, no datos privados de un solo dispositivo.
