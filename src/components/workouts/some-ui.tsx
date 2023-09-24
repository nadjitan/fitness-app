import { cn } from "@/lib/utils"

export const FormatTime: React.FC<{
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
      <span key="h" className="w-max">
        {hours}
        <Abbr text="h" />
      </span>
    )
  if (minutes > 0)
    formattedTime.push(
      <span key="min" className="w-max">
        {minutes}
        <Abbr text="min" />
      </span>
    )
  formattedTime.push(
    <span key="sec" className="w-max">
      {seconds}
      <Abbr text="sec" />
    </span>
  )
  if (milliseconds > 0)
    formattedTime.push(
      <span key="ms" className="w-max text-lg place-self-end">
        {milliseconds}
        <Abbr text="ms" />
      </span>
    )

  return <>{formattedTime.map((time) => time)}</>
}

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode
  to: string
  disabled?: boolean
}
export const Link: React.FC<LinkProps> = ({
  to,
  children,
  disabled = false,
  ...props
}) => (
  <a
    href={to}
    className={cn(props.className, { "pointer-events-none": disabled })}
    {...props}
  >
    {children}
  </a>
)
