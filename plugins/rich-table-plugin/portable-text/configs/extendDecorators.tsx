import {
  bold,
  createKeyboardShortcut,
  italic,
  strikeThrough,
  underline,
} from '@portabletext/keyboard-shortcuts'
import type { ExtendDecoratorSchemaType } from '@portabletext/toolbar'

import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from '../icons'

const extendDecorator: ExtendDecoratorSchemaType = (decorator) => {
  if (decorator.name === 'strong') {
    return {
      ...decorator,
      // Optional: add a react component as an icon and unset the title
      icon: () => <BoldIcon />,
      // Optional: connect to a keyboard shortcut from the keyboard-shortcuts library
      shortcut: bold,
      title: 'Bold',
    }
  }
  if (decorator.name === 'em') {
    return {
      ...decorator,
      icon: () => <ItalicIcon />,
      // Optional: connect to a keyboard shortcut from the keyboard-shortcuts library
      shortcut: italic,
      title: 'Italic',
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
          {
            key: 'C',
            alt: false,
            ctrl: false,
            meta: true,
            shift: true,
          },
        ],
      }), //code,
      title: 'Inline Code',
    }
  }
  if (decorator.name === 'underline') {
    return {
      ...decorator,
      icon: () => <UnderlineIcon />,
      // Optional: connect to a keyboard shortcut from the keyboard-shortcuts library
      shortcut: underline,
      title: 'Underline',
    }
  }
  if (decorator.name === 'strike-through') {
    return {
      ...decorator,
      icon: () => <StrikethroughIcon />,
      // Optional: connect to a keyboard shortcut from the keyboard-shortcuts library
      shortcut: strikeThrough,
      title: 'Strikethrough',
    }
  }

  // ...repeat for each decorator type, or return the original decorator
  return decorator
}
export default extendDecorator
