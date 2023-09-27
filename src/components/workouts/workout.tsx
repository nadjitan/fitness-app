import React, { useEffect, useMemo, useRef, useState } from "react"

import { useStore } from "@nanostores/react"
import {
  animate,
  AnimatePresence,
  motion,
  stagger,
  type Transition
} from "framer-motion"
import {
  ArrowRight,
  Dumbbell,
  FileEdit,
  ListRestart,
  MoveLeft,
  Pause,
  Play,
  Square,
  StepForward
} from "lucide-react"

import { workoutsAtom } from "@/store/workouts"
import useCountdown from "@/hooks/useCountdown"

import { Button } from "@/components/ui/button"
import { ListButton } from "@/components/ui/list-button"

import { FormatTime, Link } from "./some-ui"

interface SemicircleProgressBarProps {
  duration: number
  isRest: boolean
  progress: number
}

const SemicircleProgressBar: React.FC<SemicircleProgressBarProps> = ({
  duration,
  isRest,
  progress
}) => {
  const circleProgress = useMemo(
    () => Math.round(198 * (progress / duration)),
    [progress]
  )
  return (
    <svg viewBox="11 15 88 88" className="h-full w-full" fill="currentColor">
      <path
        strokeLinecap="round"
        strokeWidth={6}
        className="stroke-gray-200 opacity-50 dark:opacity-20"
        d="M30,90 A40,40 0 1,1 80,90"
        fill="none"
      />
      <path
        strokeLinecap="round"
        strokeDasharray={198}
        strokeDashoffset={circleProgress}
        strokeWidth={6}
        fill="none"
        className="stroke-green-600"
        d="M30,90 A40,40 0 1,1 80,90"
      />

      {isRest ? (
        <text
          x={11 + 88 / 2 - 22 / 2}
          y={15 + 88 / 2 - 22 / 2 + 15}
          className="text-foreground"
        >
          😴
        </text>
      ) : (
        <Dumbbell
          // https://stackoverflow.com/a/46828111
          x={11 + 88 / 2 - 22 / 2}
          y={15 + 88 / 2 - 22 / 2}
          strokeWidth={2.7}
          size={22}
          // TODO: Rotate not working
          className="rotate-45"
        />
      )}

      {/* <text
        x="62%"
        y="110%"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {formatTime(progress)}
      </text> */}
    </svg>
  )
}

const staggerMenuItems = stagger(0.1, { startDelay: 0.15 })
const springTransition: Transition = {
  type: "spring",
  stiffness: 700,
  damping: 30
}

export const Workout: React.FC<{ workoutId: string }> = ({ workoutId }) => {
  const workouts = useStore(workoutsAtom)
  const workout = workouts.find((item) => item.id === workoutId)
  const [exercises] = useState(workout?.exercises!)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [exercise, setExercise] = useState(exercises[exerciseIndex])
  const isCountdown = exercise.duration > 0

  const itemElsRef = useRef<HTMLDivElement[]>([])

  const { running, finished, setTime, start, pause, timeRemaining, reset } =
    useCountdown(exercise.duration)

  function resetAll() {
    reset()
    setExerciseIndex(0)
    setExercise(exercises[0]!)
    setTime(exercises[0].duration)
    itemElsRef.current![0].scrollIntoView({
      behavior: "smooth"
    })
  }
  function goNext() {
    const nextIndex = exerciseIndex + 1
    const nextExercise = exercises[nextIndex]!
    itemElsRef.current![nextIndex].scrollIntoView({
      behavior: "smooth"
    })
    setTime(nextExercise.duration)
    setExerciseIndex(nextIndex)
    setExercise(nextExercise)
    if (nextExercise.duration > 0) start()
  }

  useEffect(() => {
    animate(
      ".exercise-item",
      { opacity: [0, 1], scale: [0, 1] },
      {
        duration: 0.2,
        delay: staggerMenuItems,
        type: "spring"
      }
    )
  }, [])

  // Automatically change to next step if
  // current exercise is a countdown
  useEffect(() => {
    if (isCountdown && finished) {
      if (exerciseIndex < exercises.length! - 1) goNext()
      if (exerciseIndex === exercises.length! - 1) resetAll()
    }
  }, [finished])

  return (
    <div className="flex h-full w-full flex-col gap-2 animate-in fade-in lg:max-w-6xl lg:flex-row">
      <section className="relative flex h-full flex-1 flex-col items-center gap-4 overflow-hidden rounded-lg md:border md:p-4">
        <div className="flex h-max w-full justify-between">
          <Link to="/" disabled={running}>
            <Button
              className="flex gap-2 md:text-lg"
              variant={"ghost"}
              disabled={running}
            >
              <MoveLeft /> Exit
            </Button>
          </Link>

          <Button
            className="flex gap-2 md:text-lg"
            variant={"ghost"}
            disabled={exerciseIndex <= 0}
            onClick={() => resetAll()}
          >
            <ListRestart /> Reset
          </Button>
        </div>

        <h1 className="text-center text-xl font-black opacity-20 lg:text-6xl">
          {workout?.title}
        </h1>

        <AnimatePresence>
          {exercise.duration > 0 ? (
            <>
              <motion.div
                className="h-max relative w-36 md:w-56 lg:w-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SemicircleProgressBar
                  duration={exercise.duration}
                  isRest={exercise.type === "rest"}
                  progress={timeRemaining}
                />
                <div className="absolute text-2xl w-52 gap-1 justify-evenly items-center flex -bottom-5 md:text-4xl md:bottom-0 left-1/2 -translate-x-1/2">
                  <FormatTime totalSeconds={timeRemaining} />
                </div>
              </motion.div>
              <motion.h1 className="line-clamp-2 text-xl md:text-3xl font-semibold">
                {exercise.name}
              </motion.h1>
            </>
          ) : (
            <>
              <motion.h2
                className="pt-14 text-2xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {exercise.sets}x{exercise.repetitions}
              </motion.h2>
              <motion.h1 className="line-clamp-2 text-xl md:text-3xl font-semibold">
                {exercise.name}
              </motion.h1>
            </>
          )}
        </AnimatePresence>

        <a href={`/workout/edit/${workout!.id}`}>
          <Button
            variant="ghost"
            className="absolute bottom-0 md:bottom-4 left-0 md:left-4 flex gap-2 md:text-lg"
          >
            <FileEdit className="w-5 h-5" /> Edit
          </Button>
        </a>
      </section>
      <section className="relative flex h-full flex-1 flex-col gap-2 overflow-hidden">
        <div className="flex h-max gap-2">
          <Button
            className="flex h-[78px] w-full gap-2 px-0 py-8 text-lg"
            {...(!running && timeRemaining === exercise.duration
              ? { disabled: true }
              : {})}
            onClick={() => reset()}
            variant={
              !running && timeRemaining === exercise.duration
                ? "outline"
                : "destructive"
            }
          >
            <Square fill="currentColor" />
            Stop
          </Button>

          {isCountdown ? (
            <Button
              className="flex h-[78px] w-full gap-2 px-0 py-8 text-lg"
              onClick={() => {
                if (running) pause()
                else start()
              }}
            >
              {running ? (
                <Pause fill="currentColor" />
              ) : (
                <Play fill="currentColor" />
              )}
              {!running && exerciseIndex === 0
                ? "Start"
                : !running && exerciseIndex > 0
                ? "Continue"
                : running
                ? "Pause"
                : null}
            </Button>
          ) : (
            <Button
              className="flex h-[78px] w-full gap-2 px-0 py-8 text-lg"
              onClick={() => {
                if (exerciseIndex === exercises.length! - 1) resetAll()
                else goNext()
              }}
            >
              Next <StepForward className="fill-background" />
            </Button>
          )}
        </div>

        <div className="relative flex h-full w-full flex-col place-content-start gap-2 overflow-y-auto overflow-x-hidden">
          {exercises.map((ex, i) => (
            <div
              key={ex.id}
              ref={(el) => {
                itemElsRef.current.push(el!)
              }}
              className={`exercise-item flex items-center gap-2`}
            >
              {exercise.id === ex.id && (
                <motion.div
                  className="z-20"
                  layoutId="active-exercise"
                  transition={springTransition}
                >
                  <ArrowRight strokeWidth={2.5} />
                </motion.div>
              )}
              <motion.div className="z-10 w-full" layout>
                <ListButton
                  className="h-14 w-full"
                  variant={"outline"}
                  onClick={() => {
                    reset()
                    setExerciseIndex(i)
                    setExercise(ex)
                    setTime(ex.duration)
                  }}
                >
                  {/* Children also needs `motion` to scale correctly during parent `layout` animations  */}
                  <motion.p className="mr-2 w-10 text-end text-sm font-light">
                    {ex.duration <= 0
                      ? `${ex.sets}x${ex.repetitions}`
                      : `${ex.duration.toString()}s`}
                  </motion.p>
                  <motion.h4 className="line-clamp-1 text-lg">
                    {ex.name}
                  </motion.h4>
                </ListButton>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
