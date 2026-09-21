# Modelo de datos — FitTrack

Base de datos relacional (MySQL/MariaDB, esquema `Yarold`), consumida por el backend
PHP en `C:\xampp\htdocs\fitness-api`. El núcleo del modelo cubre entrenamiento
(ejercicios, rutinas, sesiones, series) y se extiende con módulos sociales y de
gamificación que comparten el mismo `users.id` como dueño de cada registro.

## Núcleo: ejercicios, rutinas y entrenamientos

```mermaid
erDiagram
  USERS ||--o{ EXERCISES : "crea ejercicios propios"
  MUSCLE_GROUPS ||--o{ EXERCISES : clasifica
  USERS ||--o{ WORKOUT_ROUTINES : define
  WORKOUT_ROUTINES ||--o{ ROUTINE_DAYS : tiene
  ROUTINE_DAYS ||--o{ ROUTINE_EXERCISES : incluye
  EXERCISES ||--o{ ROUTINE_EXERCISES : "se usa en"
  USERS ||--o{ WORKOUT_SESSIONS : registra
  WORKOUT_ROUTINES ||--o{ WORKOUT_SESSIONS : origina
  ROUTINE_DAYS ||--o{ WORKOUT_SESSIONS : origina
  WORKOUT_SESSIONS ||--o{ WORKOUT_SESSION_EXERCISES : contiene
  EXERCISES ||--o{ WORKOUT_SESSION_EXERCISES : "se ejecuta en"
  WORKOUT_SESSION_EXERCISES ||--o{ WORKOUT_SETS : "registra series"
  USERS ||--o{ GOALS : define
  EXERCISES ||--o{ GOALS : "puede enfocar"
  USERS ||--o{ BODY_METRICS : registra

  USERS {
    int id PK
    string username UK
    string email UK
    string password_hash
    string name
    string bio
    int avatar_media_id FK
  }
  MUSCLE_GROUPS {
    int id PK
    string name UK "Pecho, Espalda, Piernas..."
  }
  EXERCISES {
    int id PK
    int user_id FK "NULL = ejercicio global del catálogo"
    int muscle_group_id FK
    string name
    string equipment
    enum difficulty_level "beginner/intermediate/advanced"
    bool is_active
  }
  WORKOUT_ROUTINES {
    int id PK
    int user_id FK
    string name
    string goal
    date start_date
    date end_date
    enum status "active/paused/completed"
  }
  ROUTINE_DAYS {
    int id PK
    int routine_id FK
    tinyint day_of_week "0=Lunes...6=Domingo"
    string label
    bool is_rest_day
    int order_index
  }
  ROUTINE_EXERCISES {
    int id PK
    int routine_day_id FK
    int exercise_id FK
    int sets
    int reps
    decimal target_weight
    int rest_seconds
    int order_index
  }
  WORKOUT_SESSIONS {
    int id PK
    int user_id FK
    int routine_id FK "NULL si es un entrenamiento libre o sugerido por IA"
    int routine_day_id FK
    string name
    date scheduled_date
    enum status "scheduled/in_progress/completed/skipped"
    datetime started_at
    datetime completed_at
    int duration_seconds
  }
  WORKOUT_SESSION_EXERCISES {
    int id PK
    int session_id FK
    int exercise_id FK
    int order_index
    int planned_sets
    int planned_reps
    decimal planned_weight
    int planned_rest_seconds
  }
  WORKOUT_SETS {
    int id PK
    int session_exercise_id FK
    int exercise_id FK
    int user_id FK
    int set_number
    int reps
    decimal weight
    bool is_personal_record
    decimal previous_best_weight
    datetime completed_at
  }
  GOALS {
    int id PK
    int user_id FK
    string title
    enum type "exercise_weight/workout_frequency/body_weight/routine_completion/custom"
    int exercise_id FK
    decimal target_value
    decimal current_value
    enum status "in_progress/completed"
  }
  BODY_METRICS {
    int id PK
    int user_id FK
    date recorded_date
    decimal weight
    decimal body_fat_percentage
    decimal chest
    decimal waist
    decimal arm
    decimal leg
    decimal hip
  }
```

### Relaciones clave

- Un **ejercicio** (`exercises`) puede ser global (`user_id NULL`, visible para
  todos) o personalizado por un usuario (`user_id` propio).
- Una **rutina** (`workout_routines`) se organiza en **días** (`routine_days`,
  0=Lunes..6=Domingo), y cada día planificado tiene una lista de **ejercicios
  planeados** (`routine_exercises`) con series/repeticiones/peso objetivo.
- Un **entrenamiento del día** (`workout_sessions`) es una instancia concreta:
  puede nacer de un `routine_day` (se copian sus ejercicios planeados como
  snapshot), crearse libre, o crearse a partir de una propuesta de la
  herramienta de IA — en los tres casos termina con sus propios
  `workout_session_exercises`.
- Cada **serie ejecutada** (`workout_sets`) queda ligada al ejercicio de la
  sesión y calcula si fue **récord personal** (`is_personal_record`) comparando
  contra el mejor peso histórico del usuario en ese ejercicio.

## Módulos adicionales (mismo esquema, fuera del diagrama por espacio)

| Módulo | Tablas principales | Propósito |
|---|---|---|
| Social | `posts`, `post_media`, `post_comments`, `post_likes`, `stories`, `story_views`, `friendships`, `friend_requests`, `blocked_users` | Feed, historias e interacción entre usuarios |
| Mensajería | `conversations`, `messages` | Chat directo entre amigos |
| Gamificación | `xp_transactions`, `user_stats`, `achievements`, `user_achievements` | XP, niveles, rachas y logros |
| Ranking | `ranking_meta`, `seasons`, `season_results` | Tablas de posiciones global/amigos/temporada |
| Retos y grupos | `challenges`, `challenge_participants`, `group_workouts`, `group_workout_participants` | Retos 1v1 y entrenamientos grupales |
| Notificaciones y medios | `notifications`, `media` | Avisos in-app y almacenamiento de imágenes/videos |
| Cuenta | `password_resets`, `token_denylist` | Recuperación de contraseña y cierre de sesión (JWT) |

## Fuente de la verdad

El esquema real vive en la base de datos (`Yarold`, MySQL) y se refleja en las
clases `App\Models\*` del backend (`fitness-api/src/Models`). Este documento es
una foto del modelo al momento de la entrega; no hay migraciones versionadas en
el repo (el proyecto usa phpMyAdmin/consola MySQL directamente).
