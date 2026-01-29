import { Button } from '@sanity/ui'
import { ComponentType, useEffect, useRef } from 'react'

import { CommandMatch } from './commands'

export interface CommandListItemProps {
  match: CommandMatch
  selected: boolean
  onMouseEnter: () => void
  onSelect: () => void
}

const CommandListItem: ComponentType<CommandListItemProps> = (props) => {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (props.selected && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [props.selected])

  return (
    <Button
      as={'li'}
      ref={ref}
      onMouseEnter={props.onMouseEnter}
      onClick={props.onSelect}
      selected={props.selected}
      mode={'bleed'}
      icon={props.match.icon}
      title={props.match.label}
      // text={props.match.label}
    />
  )
}
export default CommandListItem
