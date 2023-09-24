import { useEffect, useRef } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useStore } from "@nanostores/react"
import { AnimatePresence, Reorder, useDragControls } from "framer-motion"
import { Grip, ListRestart, MoveLeft, PlusCircle, Trash } from "lucide-react"
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"

import {
  exerciseSchema,
  workoutsAtom,
  workoutSchema,
  type Exercise,
  type Workout
} from "@/store/workouts"
import { getLocalISODatetime } from "@/utils/dates"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const ExerciseItem: React.FC<{
  exercise: Exercise
  workoutForm: UseFormReturn<Workout>
}> = ({ exercise, workoutForm }) => {
  const controls = useDragControls()

  // Workaround for Framer's Reorder not working on mobile devices
  // see https://github.com/framer/motion/issues/1597#issuecomment-1235026724
  const iRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const touchHandler: React.TouchEventHandler<HTMLButtonElement> = (e) =>
      e.preventDefault()

    const iTag = iRef.current

    if (iTag) {
      //@ts-ignore
      iTag.addEventListener("touchstart", touchHandler, { passive: false })

      return () => {
        //@ts-ignore
        iTag.removeEventListener("touchstart", touchHandler, {
          passive: false
        })
      }
    }
  }, [iRef])

  return (
    <AnimatePresence>
      <Reorder.Item
        dragListener={false}
        dragControls={controls}
        value={exercise}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex h-max w-full items-center gap-2 rounded-lg border bg-background p-4">
          <p className="w-10 select-none text-end text-sm font-light">
            {exercise.duration === 0
              ? `${exercise.sets}x${exercise.repetitions}`
              : `${exercise.duration.toString()}s`}
          </p>
          <h4 className="line-clamp-1 select-none text-lg">{exercise.name}</h4>

          <Button
            className="ml-auto"
            variant="ghost"
            size="icon"
            onClick={() => {
              const filtered = workoutForm
                .getValues("exercises")
                .filter((e) => e.id !== exercise.id)
              workoutForm.setValue("exercises", filtered)
            }}
          >
            <Trash />
          </Button>

          <Button
            ref={iRef}
            variant="ghost"
            size="icon"
            onPointerDown={(e) => controls.start(e)}
          >
            <Grip />
          </Button>
        </div>
      </Reorder.Item>
    </AnimatePresence>
  )
}

export const CreateWorkoutForm: React.FC = () => {
  const workouts = useStore(workoutsAtom)

  const workoutForm = useForm<Workout>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      id: uuidv4(),
      creator: "User1",
      dateCreated: getLocalISODatetime(),
      description: "",
      exercises: [],
      target: "Abs",
      title: ""
    }
  })
  const workoutExerciseField = useFieldArray({
    control: workoutForm.control,
    name: "exercises"
  })

  const exerciseForm = useForm<Exercise>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      id: uuidv4(),
      duration: 5,
      name: "",
      repetitions: 1,
      sets: 1,
      type: "rest"
    }
  })

  function onSubmit(values: Workout) {
    workoutsAtom.set([...workouts, values])
    location.replace("/")
  }

  return (
    <>
      <section className="relative flex h-full flex-1 flex-col items-center gap-4 overflow-hidden rounded-lg md:border md:p-4">
        <div className="flex h-max w-full justify-between">
          <a href="/">
            <Button className="flex gap-2 md:text-lg" variant={"ghost"}>
              <MoveLeft /> Exit
            </Button>
          </a>

          <Button
            className="flex gap-2 md:text-lg"
            variant={"ghost"}
            onClick={() => {
              workoutForm.reset()
              exerciseForm.reset()
            }}
          >
            <ListRestart /> Reset
          </Button>
        </div>

        <div className="h-full w-full overflow-y-auto">
          <Form {...workoutForm}>
            <form
              onSubmit={workoutForm.handleSubmit(onSubmit)}
              className="grid w-full gap-2 px-2"
            >
              <FormField
                control={workoutForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={workoutForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="ml-auto mt-6 w-max">
                Submit
              </Button>

              <FormField
                control={workoutForm.control}
                name="exercises"
                render={({ field }) => (
                  <FormItem className="w-full text-center">
                    <FormLabel className="capitalize underline">
                      Exercise
                    </FormLabel>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <Form {...exerciseForm}>
            <form
              onSubmit={workoutForm.handleSubmit(onSubmit)}
              className="grid w-full gap-2 px-2"
            >
              <FormField
                control={exerciseForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={exerciseForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      // @ts-ignore
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select exercise type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="rest">Rest</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />

              <Tabs
                defaultValue="timer"
                className="mt-2 w-full"
                onValueChange={(e) => {
                  if (e === "timer") {
                    exerciseForm.setValue("duration", 5)
                    exerciseForm.setValue("repetitions", 0)
                    exerciseForm.setValue("sets", 0)
                  }
                  if (e === "name-only") {
                    exerciseForm.setValue("duration", 0)
                    exerciseForm.setValue("repetitions", 1)
                    exerciseForm.setValue("sets", 1)
                  }
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="timer">Timer</TabsTrigger>
                  <TabsTrigger value="name-only">Name Only</TabsTrigger>
                </TabsList>
                <TabsContent value="timer" className="m-0 flex w-full gap-2">
                  <FormField
                    control={exerciseForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>
                        <FormControl>
                          <Input className="w-20" {...field} />
                        </FormControl>
                        <FormMessage className="dark:text-red-600" />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent
                  value="name-only"
                  className="m-0 flex w-full gap-2"
                >
                  <FormField
                    control={exerciseForm.control}
                    name="repetitions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>
                        <FormControl>
                          <Input className="w-20" {...field} />
                        </FormControl>
                        <FormMessage className="dark:text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={exerciseForm.control}
                    name="sets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>
                        <FormControl>
                          <Input className="w-20" {...field} />
                        </FormControl>
                        <FormMessage className="dark:text-red-600" />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <Button
                variant="ghost"
                type="button"
                className="ml-auto flex w-max gap-2 text-sm"
                onClick={() => {
                  exerciseForm.trigger().then((valid) => {
                    if (valid) {
                      const exercise = exerciseForm.getValues()
                      workoutExerciseField.append(exercise)
                      exercise.id = exercise.id + 1
                      exerciseForm.reset(exercise)
                    }
                  })
                }}
              >
                <PlusCircle />
                Add Exercise
              </Button>
            </form>
          </Form>
        </div>
      </section>

      <section className="relative flex h-2/5 flex-col items-center overflow-hidden rounded-lg border p-4 md:h-full md:flex-1">
        <Reorder.Group
          className="flex h-full w-full flex-col gap-3 overflow-y-auto"
          layoutScroll
          axis="y"
          values={workoutForm.getValues("exercises")}
          onReorder={(newOrder) => {
            workoutExerciseField.replace(newOrder)
          }}
        >
          {workoutForm.getValues("exercises").map((ex) => (
            <ExerciseItem exercise={ex} workoutForm={workoutForm} key={ex.id} />
          ))}
        </Reorder.Group>
      </section>
    </>
  )
}

export const EditWorkoutForm: React.FC<{ workoutId: string }> = ({
  workoutId
}) => {
  const workouts = useStore(workoutsAtom)
  const workout = workouts.find((item) => item.id === workoutId)

  const workoutForm = useForm<Workout>({
    resolver: zodResolver(workoutSchema),
    defaultValues: workout
  })
  const workoutExerciseField = useFieldArray({
    control: workoutForm.control,
    name: "exercises"
  })

  const exerciseForm = useForm<Exercise>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      id: uuidv4(),
      duration: 5,
      name: "",
      repetitions: 1,
      sets: 1,
      type: "rest"
    }
  })

  function onSubmit(values: Workout) {
    workoutsAtom.set(
      workouts.map((w) => {
        if (w.id === values.id) return values
        return w
      })
    )
    location.replace(`/workout/${values.id}`)
  }

  return (
    <>
      <section className="relative flex h-full flex-1 flex-col items-center gap-4 overflow-hidden rounded-lg border p-4">
        <div className="flex h-max w-full justify-between">
          <a href={`/workout/${workoutId}`}>
            <Button className="flex gap-2 md:text-lg" variant={"ghost"}>
              <MoveLeft /> Back
            </Button>
          </a>

          <Button
            className="flex gap-2 md:text-lg"
            variant={"ghost"}
            onClick={() => {
              workoutForm.reset()
              exerciseForm.reset()
            }}
          >
            <ListRestart /> Reset
          </Button>
        </div>

        <div className="h-full w-full overflow-y-auto">
          <Form {...workoutForm}>
            <form
              onSubmit={workoutForm.handleSubmit(onSubmit)}
              className="grid w-full gap-2 px-2"
            >
              <FormField
                control={workoutForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {/* <FormDescription>
              This is your public display name.
            </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={workoutForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full justify-between">
                <Button
                  className="w-max"
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    workoutsAtom.set(
                      workouts.filter((w) => w.id !== workout?.id)
                    )
                    location.replace("/")
                  }}
                >
                  Delete
                </Button>
                <Button className="w-max" type="submit">
                  Save
                </Button>
              </div>

              <FormField
                control={workoutForm.control}
                name="exercises"
                render={({ field }) => (
                  <FormItem className="w-full text-center">
                    <FormLabel className="capitalize">Exercise</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <Form {...exerciseForm}>
            <form
              onSubmit={workoutForm.handleSubmit(onSubmit)}
              className="grid w-full gap-2 px-2"
            >
              <FormField
                control={exerciseForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={exerciseForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      // @ts-ignore
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select exercise type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="rest">Rest</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Tabs
                defaultValue="timer"
                className="w-full"
                onValueChange={(e) => {
                  if (e === "timer") {
                    exerciseForm.setValue("duration", 5)
                    exerciseForm.setValue("repetitions", 0)
                    exerciseForm.setValue("sets", 0)
                  }
                  if (e === "name-only") {
                    exerciseForm.setValue("duration", 0)
                    exerciseForm.setValue("repetitions", 1)
                    exerciseForm.setValue("sets", 1)
                  }
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="timer">Timer</TabsTrigger>
                  <TabsTrigger value="name-only">Name Only</TabsTrigger>
                </TabsList>
                <TabsContent value="timer" className="m-0 flex w-full gap-2">
                  <FormField
                    control={exerciseForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>
                        <FormControl>
                          <Input className="w-20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent
                  value="name-only"
                  className="m-0 flex w-full gap-2"
                >
                  <FormField
                    control={exerciseForm.control}
                    name="repetitions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>
                        <FormControl>
                          <Input className="w-20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={exerciseForm.control}
                    name="sets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>
                        <FormControl>
                          <Input className="w-20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <Button
                variant="ghost"
                type="button"
                className="ml-auto flex w-max gap-2 text-sm"
                onClick={() => {
                  exerciseForm.trigger().then((valid) => {
                    if (valid) {
                      const exercise = exerciseForm.getValues()
                      workoutExerciseField.append(exercise)
                      exercise.id = exercise.id + 1
                      exerciseForm.reset(exercise)
                    }
                  })
                }}
              >
                <PlusCircle />
                Add Exercise
              </Button>
            </form>
          </Form>
        </div>
      </section>

      <section className="relative flex h-2/5 flex-col items-center overflow-hidden rounded-lg border p-4 md:h-full md:flex-1">
        <Reorder.Group
          className="flex h-full w-full flex-col gap-3 overflow-y-auto"
          layoutScroll
          axis="y"
          values={workoutForm.getValues("exercises")}
          onReorder={(newOrder) => {
            workoutExerciseField.replace(newOrder)
          }}
        >
          {workoutForm.getValues("exercises").map((ex) => (
            <ExerciseItem exercise={ex} workoutForm={workoutForm} key={ex.id} />
          ))}
        </Reorder.Group>
      </section>
    </>
  )
}
