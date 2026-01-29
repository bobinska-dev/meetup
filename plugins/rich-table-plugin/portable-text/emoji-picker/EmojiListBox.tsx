import { EmojiMatch } from '@portabletext/plugin-emoji-picker'
import { Button, Flex, Stack, Text } from '@sanity/ui'
import { ComponentType } from 'react'

import EmojiListItem from './EmojiListItem'

interface EmojiListBoxProps {
  keyword: string
  matches: ReadonlyArray<EmojiMatch>
  selectedIndex: number
  onDismiss: () => void
  onNavigateTo: (index: number) => void
  onSelect: () => void
}

const MAX_VISIBLE_MATCHES = 50

const EmojiListBox: ComponentType<EmojiListBoxProps> = (props) => {
  if (props.matches.length === 0) {
    return (
      <Stack space={4} padding={3}>
        <Text size={1} as={'p'}>
          No matches found...
        </Text>
        <Button onClick={props.onDismiss}>Dismiss</Button>
      </Stack>
    )
  }

  const visibleMatches = props.matches.slice(0, MAX_VISIBLE_MATCHES)

  return (
    <Flex
      gap={1}
      as={'ol'}
      padding={1}
      style={{ maxWidth: '400px', overflowY: 'auto', listStyle: 'none' }}
      wrap={'wrap'}
    >
      {visibleMatches.map((match, index) => (
        <EmojiListItem
          key={`${match.emoji}-${match.keyword}`}
          match={match}
          selected={props.selectedIndex === index}
          onMouseEnter={() => {
            props.onNavigateTo(index)
          }}
          onSelect={props.onSelect}
        />
      ))}
    </Flex>
  )
}

export default EmojiListBox
