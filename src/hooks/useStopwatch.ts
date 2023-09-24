import { useEffect, useRef, useState } from "react"

export default function useStopwatch() {
  const [running, setRunning] = useState(false)
  const [time, setTime] = useState(0)
  const startTimeRef = useRef<number>(0)
  const previousTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number | null>(null)

  function start() {
    startTimeRef.current = Date.now()
    setRunning(true)
  }

  function pause() {
    if (!running) return
    setRunning(false)
    previousTimeRef.current = time
  }

  function reset() {
    setRunning(false)
    setTime(0)
    previousTimeRef.current = 0
  }

  function animate() {
    if (!running) return

    const elapsedTime = Date.now() - startTimeRef.current!
    const newTime = previousTimeRef.current + elapsedTime / 1000

    setTime(newTime)
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (running) {
      cancelAnimationFrame(animationFrameRef.current!)
      animationFrameRef.current = requestAnimationFrame(animate)
    } else cancelAnimationFrame(animationFrameRef.current!)

    return () => {
      cancelAnimationFrame(animationFrameRef.current!)
    }
  }, [running])

  return {
    running,
    time,
    start,
    pause,
    reset
  }
}
