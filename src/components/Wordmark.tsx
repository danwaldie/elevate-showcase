export default function Wordmark({
  width = 158,
  fill = 'currentColor',
  className,
}: {
  width?: number
  fill?: string
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 432 117"
      width={width}
      style={{ fill }}
      role="img"
      aria-label="Elevate"
    >
      <path d="M14.1,14.7h42.8v14.2h-27.4v21h24.8v14.2h-24.8v22h27.9v14.2H14.1V14.7Z" />
      <path d="M119.4,100.2h-45.5V14.7h15.4v71.4h30.1v14.2Z" />
      <path d="M133.1,14.7h42.8v14.2h-27.4v21h24.8v14.2h-24.8v22h27.9v14.2h-43.3V14.7Z" />
      <path d="M363.9,28.9h-20.2v71.4h-15.4V28.9h-20.3v-14.2h55.8v14.2Z" />
      <path d="M377.7,14.7h42.8v14.2h-27.4v21h24.8v14.2h-24.8v22h27.9v14.2h-43.3V14.7Z" />
      <polygon points="294.4 100.2 310.5 100.2 285.6 14.1 273.5 14.1 248.7 100.2 264 100.2 279.6 38.1 294.4 100.2" />
      <polygon points="203.9 14.1 187.8 14.1 212.7 100.2 224.8 100.2 249.6 14.1 234.4 14.1 218.7 76.3 203.9 14.1" />
    </svg>
  )
}
