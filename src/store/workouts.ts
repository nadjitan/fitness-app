import { persistentAtom } from "@nanostores/persistent"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod"

export type Exercise = z.infer<typeof exerciseSchema>
export type ExerciseList = z.infer<typeof exerciseListSchema>
export type Workout = z.infer<typeof workoutSchema>

export const WORKOUT_TARGET = [
  "Full Body",
  "Chest",
  "Legs",
  "Triceps",
  "Biceps",
  "Arms",
  "Upper Body",
  "Abs"
] as const

export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, {
    message: "Name must be at least 1 character."
  }),
  type: z.union([z.literal("work"), z.literal("rest")]),
  duration: z.coerce.number(),
  repetitions: z.coerce.number(),
  sets: z.coerce.number()
})
export const exerciseListSchema = z.array(exerciseSchema).min(1, {
  message: "Workout must have at least 1 exercise."
})

export const workoutSchema = z.object({
  id: z.string().optional(),
  creator: z.string(),
  title: z.string().min(1, {
    message: "Title must be at least 1 character."
  }),
  description: z.string(),
  target: z.enum(WORKOUT_TARGET),
  exercises: exerciseListSchema,
  dateCreated: z.string()
})

export const initialWorkoutData: Workout[] = [
  {
    id: "70b7137c-2f36-498d-af25-572cd42204b2",
    creator: "Nadji Tan",
    title: "Legs Workout",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    target: "Legs",
    exercises: [
      {
        id: uuidv4(),
        name: "Squats",
        type: "work",
        duration: 600,
        sets: 0,
        repetitions: 0
      },
      {
        id: uuidv4(),
        name: "Rest",
        type: "rest",
        duration: 2,
        sets: 0,
        repetitions: 0
      },
      {
        id: uuidv4(),
        name: "Barbell Squat",
        type: "work",
        duration: 2,
        sets: 0,
        repetitions: 0
      }
    ],
    dateCreated: "2023-09-09T03:35:59.456Z"
  },
  {
    id: "89c721af-7333-43f1-a71a-e5de49da9c1a",
    creator: "Nadji Tan",
    title: "Arms Workout",
    description:
      "Felis imperdiet proin fermentum leo. Ante metus dictum at tempor commodo.",
    target: "Arms",
    exercises: [
      {
        id: uuidv4(),
        name: "Dumbell curls",
        type: "work",
        duration: 0,
        sets: 3,
        repetitions: 12
      },
      {
        id: uuidv4(),
        name: "Rest",
        type: "rest",
        duration: 3,
        sets: 0,
        repetitions: 0
      },
      {
        id: uuidv4(),
        name: "Rope Pulldowns",
        type: "work",
        duration: 0,
        sets: 3,
        repetitions: 12
      }
    ],
    dateCreated: "2023-09-09T03:35:59.456Z"
  }
]

export const workoutsAtom = persistentAtom<Workout[]>("workouts", [], {
  encode: JSON.stringify,
  decode: JSON.parse
})
