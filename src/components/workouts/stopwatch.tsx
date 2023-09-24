import { MoveLeft, Pause, Play, Square } from "lucide-react"

import useStopwatch from "@/hooks/useStopwatch"

import { Button } from "@/components/ui/button"

import { FormatTime, Link } from "./some-ui"

export const Stopwatch: React.FC = () => {
  const { running, start, pause, time, reset } = useStopwatch()

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
