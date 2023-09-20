import { useEffect, useRef, useState } from "react"

export default function useCountdown(initialTime: number) {
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [time, setTime] = useState(initialTime)
  const startTimeRef = useRef<number | null>(null)
  const remainingTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  function start() {
    setFinished(false)
    startTimeRef.current = Date.now()
    setRunning(true)
  }

  function pause() {
    if (!running) return
    setRunning(false)
    remainingTimeRef.current = time
  }

  function reset() {
    setRunning(false)
    setTime(initialTime)
    remainingTimeRef.current = null
  }

  function animate() {
    if (!running) return

    const elapsedTime = Date.now() - startTimeRef.current!
    const newTime =
      (remainingTimeRef.current || initialTime) - elapsedTime / 1000

    if (newTime <= 0) {
      setFinished(true)
      reset()
    } else {
      setTime(newTime)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (running) {
      cancelAnimationFrame(animationFrameRef.current!)
      animationFrameRef.current = requestAnimationFrame(animate)
    } else cancelAnimationFrame(animationFrameRef.current!)

    return () => {
      cancelAnimationFrame(animationFrameRef.current!)
    }
  }, [running, initialTime])

  return {
    running,
    finished,
    timeRemaining: time,
    start,
    pause,
    setTime,
    reset
  }
}
