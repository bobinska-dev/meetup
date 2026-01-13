import {
  bold,
  createKeyboardShortcut,
  italic,
  strikeThrough,
  underline,
} from '@portabletext/keyboard-shortcuts'
import type { ExtendDecoratorSchemaType } from '@portabletext/toolbar'
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from '@sanity/icons'

const extendDecorator: ExtendDecoratorSchemaType = (decorator) => {
  if (decorator.name === 'strong') {
    return {
      ...decorator,
      // Optional: add a react component as an icon and unset the title
      icon: () => <BoldIcon />,
      // Optional: connect to a keyboard shortcut from the keyboard-shortcuts library
      shortcut: bold,
      title: '',
    }
  }
  if (decorator.name === 'em') {
    return {
      ...decorator,
      icon: () => <ItalicIcon />,
      // Optional: connect to a keyboard shortcut from the keyboard-shortcuts library
      shortcut: italic,
      title: '',
    }
  }
  if (decorator.name === 'code') {
    return {
      ...decorator,
      icon: () => <CodeIcon />,
      // Optional: connect to a keyboard shortcut from the keyboard-shortcuts library
      shortcut: createKeyboardShortcut({
        default: [
          {
            key: 'E',
            alt: false,
            ctrl: false,
            meta: true,
            shift: false,
          },
        ],
        apple: [
          {
            key: 'E',
            alt: false,
            ctrl: false,
            meta: true,
            shift: false,
          },
        ],
      }), //code,
      title: '',
    }
  }
  if (decorator.name === 'underline') {
    return {
      ...decorator,
      icon: () => <UnderlineIcon />,
      // Optional: connect to a keyboard shortcut from the keyboard-shortcuts library
      shortcut: underline,
      title: '',
    }
  }
  if (decorator.name === 'strike-through') {
    return {
      ...decorator,
      icon: () => <StrikethroughIcon />,
      // Optional: connect to a keyboard shortcut from the keyboard-shortcuts library
      shortcut: strikeThrough,
      title: '',
    }
  }

  // ...repeat for each decorator type, or return the original decorator
  return decorator
}
export default extendDecorator
