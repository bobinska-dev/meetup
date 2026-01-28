import { Button } from '@sanity/ui'
import { ComponentType, useEffect, useRef } from 'react'
import { EmojiMatch } from '@portabletext/plugin-emoji-picker'

interface EmojiListItemProps {
  match: EmojiMatch
  selected: boolean
  onMouseEnter: () => void
  onSelect: () => void
}

const EmojiListItem: ComponentType<EmojiListItemProps> = (props) => {
  const { match, selected, onMouseEnter, onSelect } = props
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (selected && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [props.selected])
  return (
    <Button
      as={'li'}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onClick={onSelect}
      selected={selected}
      mode={'bleed'}
      text={props.match.emoji}
      //title={props.match.keyword}
      // text={props.match.label}
    />
  )
}
export default EmojiListItem
