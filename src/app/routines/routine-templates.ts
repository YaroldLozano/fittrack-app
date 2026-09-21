/**
 * Rutinas predeterminadas para arrancar sin construir todo desde cero.
 * Los nombres de ejercicio se resuelven contra el catálogo real del usuario
 * (ver RoutinesPage.useTemplate) — si un ejercicio no existe en su catálogo
 * (p. ej. lo borró), simplemente se omite de esa rutina.
 */
export interface RoutineTemplateExercise {
  name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
}

export interface RoutineTemplateDay {
  day_of_week: number; // 0=Lunes ... 6=Domingo
  label: string;
  exercises: RoutineTemplateExercise[];
}

export interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  goal: string;
  days: RoutineTemplateDay[];
}

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'full-body',
    name: 'Full Body 3 días',
    description: 'Cuerpo completo, ideal para empezar. Un día de descanso entre sesión y sesión.',
    goal: 'Fuerza general',
    days: [
      {
        day_of_week: 0,
        label: 'Full Body A',
        exercises: [
          { name: 'Sentadilla', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Press de banca', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Remo con barra', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Plancha', sets: 3, reps: 1, rest_seconds: 45 },
        ],
      },
      {
        day_of_week: 2,
        label: 'Full Body B',
        exercises: [
          { name: 'Peso muerto', sets: 3, reps: 8, rest_seconds: 120 },
          { name: 'Press militar', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Jalón al pecho', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Crunch abdominal', sets: 3, reps: 15, rest_seconds: 45 },
        ],
      },
      {
        day_of_week: 4,
        label: 'Full Body C',
        exercises: [
          { name: 'Prensa de piernas', sets: 3, reps: 12, rest_seconds: 90 },
          { name: 'Aperturas con mancuernas', sets: 3, reps: 12, rest_seconds: 75 },
          { name: 'Dominadas', sets: 3, reps: 8, rest_seconds: 90 },
          { name: 'Plancha', sets: 3, reps: 1, rest_seconds: 45 },
        ],
      },
    ],
  },
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    description: 'Empuje, tracción y pierna en días separados. Para nivel intermedio.',
    goal: 'Hipertrofia',
    days: [
      {
        day_of_week: 0,
        label: 'Push (Empuje)',
        exercises: [
          { name: 'Press de banca', sets: 4, reps: 8, rest_seconds: 120 },
          { name: 'Press militar', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Press inclinado con mancuernas', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Extensión de tríceps en polea', sets: 3, reps: 12, rest_seconds: 60 },
          { name: 'Press francés', sets: 3, reps: 12, rest_seconds: 60 },
        ],
      },
      {
        day_of_week: 2,
        label: 'Pull (Tracción)',
        exercises: [
          { name: 'Peso muerto', sets: 4, reps: 6, rest_seconds: 150 },
          { name: 'Dominadas', sets: 3, reps: 8, rest_seconds: 90 },
          { name: 'Remo con barra', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Jalón al pecho', sets: 3, reps: 12, rest_seconds: 75 },
          { name: 'Curl de bíceps con barra', sets: 3, reps: 12, rest_seconds: 60 },
          { name: 'Curl martillo', sets: 3, reps: 12, rest_seconds: 60 },
        ],
      },
      {
        day_of_week: 4,
        label: 'Legs (Pierna)',
        exercises: [
          { name: 'Sentadilla', sets: 4, reps: 8, rest_seconds: 120 },
          { name: 'Prensa de piernas', sets: 3, reps: 12, rest_seconds: 90 },
          { name: 'Zancadas', sets: 3, reps: 12, rest_seconds: 75 },
          { name: 'Hip thrust', sets: 3, reps: 12, rest_seconds: 75 },
          { name: 'Patada de glúteo en polea', sets: 3, reps: 15, rest_seconds: 60 },
        ],
      },
    ],
  },
  {
    id: 'upper-lower',
    name: 'Torso / Pierna',
    description: 'Cuatro días a la semana alternando tren superior e inferior.',
    goal: 'Fuerza e hipertrofia',
    days: [
      {
        day_of_week: 0,
        label: 'Torso A',
        exercises: [
          { name: 'Press de banca', sets: 4, reps: 8, rest_seconds: 120 },
          { name: 'Remo con barra', sets: 4, reps: 8, rest_seconds: 120 },
          { name: 'Press militar', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Curl de bíceps con barra', sets: 3, reps: 12, rest_seconds: 60 },
        ],
      },
      {
        day_of_week: 1,
        label: 'Pierna A',
        exercises: [
          { name: 'Sentadilla', sets: 4, reps: 8, rest_seconds: 120 },
          { name: 'Zancadas', sets: 3, reps: 12, rest_seconds: 75 },
          { name: 'Hip thrust', sets: 3, reps: 12, rest_seconds: 75 },
          { name: 'Crunch abdominal', sets: 3, reps: 15, rest_seconds: 45 },
        ],
      },
      {
        day_of_week: 3,
        label: 'Torso B',
        exercises: [
          { name: 'Press inclinado con mancuernas', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Jalón al pecho', sets: 3, reps: 10, rest_seconds: 90 },
          { name: 'Elevaciones laterales', sets: 3, reps: 15, rest_seconds: 60 },
          { name: 'Press francés', sets: 3, reps: 12, rest_seconds: 60 },
        ],
      },
      {
        day_of_week: 4,
        label: 'Pierna B',
        exercises: [
          { name: 'Peso muerto', sets: 4, reps: 6, rest_seconds: 150 },
          { name: 'Prensa de piernas', sets: 3, reps: 12, rest_seconds: 90 },
          { name: 'Patada de glúteo en polea', sets: 3, reps: 15, rest_seconds: 60 },
          { name: 'Plancha', sets: 3, reps: 1, rest_seconds: 45 },
        ],
      },
    ],
  },
];
