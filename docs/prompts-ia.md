# Evidencia de uso de IA — FitTrack

Este proyecto se desarrolló con **Claude Code** (Anthropic) como asistente de
programación dentro de VS Code, sobre una base de código ya existente
(backend PHP + frontend Ionic/Angular). A continuación, los prompts reales
usados en la sesión de trabajo, qué generó la IA en cada caso, y qué se
aceptó, modificó o descartó del resultado.

---

### Prompt 1

> "Empieza a hacer las ediciones en el código para que tenga resolución para
> todos los dispositivos móviles"

**Qué generó la IA:** un ajuste de layout con `grid-template-columns:
minmax(0, 1fr)` y `select/input { min-width: 0 }` en el formulario de
ejercicios de rutina, padding con `env(safe-area-inset-*)` en la barra
superior y el menú del shell, y `100dvh` en la pantalla de login.

**Aceptado:** todos los cambios de `env(safe-area-inset-*)` y `100dvh`
(pantallas de notch/isla dinámica) se aceptaron sin cambios — son correctos y
no rompen nada en desktop.

**Modificado:** el primer intento de arreglar la fila de ejercicios (grid de
6 columnas) solo cambió el `grid-template-columns`, pero al probarlo en un
viewport real de 390px el `<select>` seguía desbordando la pantalla (su
ancho de contenido, ~428px, ignoraba el `1fr` del grid). Se modificó
agregando `minmax(0, 1fr)` explícito y `min-width: 0` en los `<select>`, que
es lo que realmente lo corrigió. Este bug no se detectó leyendo el código —
se descubrió automatizando un navegador (Playwright con emulación de iPhone
14) y midiendo el ancho real del elemento en el DOM.

**Descartado:** nada — no hubo código generado que se haya eliminado en este
prompt.

---

### Prompt 2

> "Quiero visualizar la app aquí en visual"

**Qué generó la IA:** un script Node con Playwright que abre la app en un
navegador headless emulando un iPhone 14, hace login y navega por varias
pantallas tomando capturas.

**Aceptado:** el script se usó tal cual para generar las capturas de este
documento (`screenshots/`); no era código de producción, así que no aplica
"modificar/descartar" en el sentido del proyecto — se usó una vez y se borró
del repo (era una herramienta de verificación, no una funcionalidad de la
app).

---

### Prompt 3

> "Quiero que toda la aplicación use colores blanco, negro y detalles en
> gris, notificaciones en rojo, agrega listas de entrenamiento con
> ejercicios predeterminados, y en seleccionar rutina que te permita ajustar
> tus entrenamientos y agregar ejercicios, además agrega una herramienta con
> IA para pedirle lo que quieres hacer y te ajuste tu entrenamiento del día"

Este prompt generó la mayor parte del trabajo de la entrega. Antes de picar
código, la IA hizo dos preguntas de aclaración (qué hacer con los colores de
estado verde/amarillo/azul, y qué proveedor de IA usar) en vez de asumir —
ambas respuestas cambiaron decisiones de diseño reales.

**Qué generó la IA:**
1. Rediseño de la paleta en `theme/tokens.scss` (variable `--ft-primary` de
   rojo a blanco/negro según tema, nueva variable `--ft-notify` roja
   exclusiva para notificaciones).
2. Tres plantillas de rutina predefinidas (`routine-templates.ts`) que se
   resuelven contra el catálogo real de ejercicios del usuario.
3. Una herramienta de IA nueva de punta a punta: `AIService.php` +
   `AIController.php` en el backend (llama a la API de Claude con *tool use*
   forzado para obtener siempre JSON válido), más la página Angular
   `ai-coach` (formulario, sugerencia, botón "usar este entrenamiento").

**Aceptado:** el rediseño de colores se aceptó completo — al ser un sistema
de *design tokens* ya existente, cambiar los valores en un solo archivo
propagó el cambio a toda la app sin tocar cada página (se verificó con
`grep` que no había colores hardcodeados fuera de los tokens). También se
aceptó tal cual el uso de *tool use* de la API de Claude en vez de pedirle
JSON en texto libre — es más confiable y evita que la IA "alucine" un
`exercise_id` que no existe en el catálogo del usuario (el backend además
filtra cualquier id devuelto que no esté en el catálogo, por seguridad).

**Modificado:** la función `PUT /routines/:id` para "ajustar tus
entrenamientos y agregar ejercicios" **ya existía** en el backend y en la
página de Rutinas (botón "Editar") antes de este prompt — la IA lo detectó
leyendo el código en vez de reimplementarlo, y solo construyó lo que
realmente faltaba (las plantillas predeterminadas). Esto evitó duplicar
lógica de guardado de rutinas.

**Descartado:** ninguno de los archivos nuevos se descartó, pero sí se
depuró: el mismo bloque CSS `.sets-table` estaba duplicado en dos páginas
(`workout` e `history`); al agregar una tercera página que lo necesitaba
(`challenges`), se decidió **no** duplicarlo una vez más y en cambio se
movió a `global.scss`, eliminando las dos copias.

---

### Prompt 4

> "Soluciona el error: `ionic : No se puede cargar el archivo
> C:\nvm4w\nodejs\ionic.ps1 porque la ejecución de scripts está
> deshabilitada...`"

**Qué generó la IA:** diagnóstico correcto (política de ejecución de
PowerShell restringida) y el comando `Set-ExecutionPolicy -Scope CurrentUser
-ExecutionPolicy RemoteSigned -Force`.

**Aceptado:** tal cual — es la solución estándar recomendada por Microsoft
para este error (no se usó `Unrestricted`, que es menos seguro).

---

## Resumen

| # | Prompt (resumen) | Resultado |
|---|---|---|
| 1 | Responsividad móvil | Bug real de overflow encontrado y corregido con verificación automatizada, no solo lectura de código |
| 2 | Ver la app visualmente | Script de captura de pantalla (herramienta temporal, no parte de la app) |
| 3 | Colores + rutinas predeterminadas + IA | Feature más grande de la entrega; reutilizó código existente donde ya existía en vez de duplicarlo |
| 4 | Arreglar PowerShell | Fix de entorno, aceptado sin cambios |

En general, el patrón de trabajo fue: la IA proponía un cambio, lo
**verificaba visualmente** (build + capturas en viewport móvil real) antes de
darlo por terminado, y cuando la verificación mostraba un problema (como el
`<select>` desbordado del Prompt 1), lo corregía antes de reportarlo como
hecho.
