import { useEditor } from '@portabletext/editor'
import { useEmojiPicker } from '@portabletext/plugin-emoji-picker'
import { matchEmojis } from './matchEmojis'
import { FloatingPanel } from '../components/FloatingPanel'
import EmojiListBox from './EmojiListBox'

export type EmojiEntry = {
  emoji: string
  keywords: string[]
}

export function EmojiPickerPlugin() {
  const editor = useEditor()
  const { keyword, matches, selectedIndex, onDismiss, onNavigateTo, onSelect } = useEmojiPicker({
    matchEmojis,
  })

  const isActive = keyword.length >= 1

  const getAnchorRect = () => editor.dom.getSelectionRect(editor.getSnapshot())

  if (!isActive) {
    return null
  }

  return (
    <FloatingPanel getAnchorRect={getAnchorRect} offset={4}>
      <EmojiListBox
        keyword={keyword}
        matches={matches}
        selectedIndex={selectedIndex}
        onDismiss={onDismiss}
        onNavigateTo={onNavigateTo}
        onSelect={onSelect}
      />
    </FloatingPanel>
  )
}
