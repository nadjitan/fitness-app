import { MoveLeft, Pause, Play, Square } from "lucide-react"

import useStopwatch from "@/hooks/useStopwatch"

import { Button } from "@/components/ui/button"

const FormatTime: React.FC<{
  /** time in seconds */
  totalSeconds: number
}> = ({ totalSeconds }) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const milliseconds = Math.floor((totalSeconds % 1) * 1000)

  const Abbr: React.FC<{ text: string }> = ({ text }) => (
    <span className="text-xs italic">{text}</span>
  )

  const formattedTime: JSX.Element[] = []
  if (hours > 0)
    formattedTime.push(
      <span key="h" className="w-16 text-center">
        {hours}
        <Abbr text="h" />
      </span>
    )
  if (minutes > 0)
    formattedTime.push(
      <span key="min" className="w-16 text-center">
        {minutes}
        <Abbr text="min" />
      </span>
    )
  formattedTime.push(
    <span key="sec" className="w-16 text-center">
      {seconds}
      <Abbr text="sec" />
    </span>
  )
  if (milliseconds > 0)
    formattedTime.push(
      <span key="ms" className="w-16 text-center text-lg place-self-end">
        {milliseconds}
        <Abbr text="ms" />
      </span>
    )

  return <>{formattedTime.map((time) => time)}</>
}

export const Stopwatch: React.FC = () => {
  const { running, start, pause, time, reset } = useStopwatch()

  return (
    <div className="flex h-full w-full flex-col gap-2 animate-in fade-in lg:max-w-6xl lg:flex-row">
      <section className="relative flex h-full flex-1 flex-col items-center gap-4 overflow-hidden rounded-lg md:border md:p-4">
        <div className="flex h-max w-full justify-between">
          <a href="/">
            <Button
              className="flex gap-2 md:text-lg"
              variant={"ghost"}
              disabled={running}
            >
              <MoveLeft /> Exit
            </Button>
          </a>
        </div>

        <div className="text-2xl w-52 gap-1 items-center justify-center flex md:text-4xl mx-auto">
          <FormatTime totalSeconds={time} />
        </div>
      </section>

      <section className="relative flex h-full flex-1 flex-col gap-2 overflow-hidden">
        <div className="flex h-max gap-2">
          <Button
            className="flex h-[78px] w-full gap-2 px-0 py-8 text-lg"
            {...(time === 0 ? { disabled: true } : {})}
            onClick={() => reset()}
            variant={time === 0 ? "outline" : "destructive"}
          >
            <Square fill="currentColor" />
            Stop
          </Button>

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
            {!running ? "Start" : "Pause"}
          </Button>
        </div>

        <div className="relative flex h-full w-full flex-col place-content-start gap-2 overflow-y-auto overflow-x-hidden"></div>
      </section>
    </div>
  )
}
