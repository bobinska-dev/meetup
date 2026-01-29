import { EmojiMatch } from '@portabletext/plugin-emoji-picker'
import { Button } from '@sanity/ui'
import { ComponentType, useEffect, useRef } from 'react'

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
  }, [selected])
  return (
    <Button
      as={'li'}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onClick={onSelect}
      selected={selected}
      mode={'bleed'}
      text={match.emoji}
      title={match.keyword}
    />
  )
}
export default EmojiListItem
