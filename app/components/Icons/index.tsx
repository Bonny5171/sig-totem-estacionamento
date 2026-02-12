'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./fontawesome"

type Props = {
  name: string
  variant?: 'fas' | 'fal' | 'far' | 'fab'
  size?: number
  className?: string
}

export function Icon({
  name,
  variant = 'fas',
  size = 16,
  className,
}: Props) {
  const iconName = name
    .replace(/^fa/, '')
    .replace(/[A-Z]/g, m => '-' + m.toLowerCase())
    .slice(1)

  return (
    <FontAwesomeIcon
      icon={[variant, iconName]}
      style={{ width: size, height: size }}
      className={className}
    />
  )
}
