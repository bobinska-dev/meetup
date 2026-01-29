import { ExtendStyleSchemaType } from '@portabletext/toolbar'
import { H1Icon, H2Icon, H3Icon, H4Icon, H5Icon, H6Icon, QuoteIcon, TextIcon } from '../icons'

const extendStyle: ExtendStyleSchemaType = (style) => {
  // Apply updates to the schema, if needed
  if (style.name === 'normal') {
    return {
      ...style,
      title: 'Normal',
      icon: TextIcon,
    }
  }
  if (style.name === 'h1') {
    return {
      ...style,
      title: 'H1',
      icon: H1Icon,
    }
  }
  if (style.name === 'h2') {
    return {
      ...style,
      title: 'H2',
      icon: H2Icon,
    }
  }
  if (style.name === 'h3') {
    return {
      ...style,
      title: 'H3',
      icon: H3Icon,
    }
  }
  if (style.name === 'h4') {
    return {
      ...style,
      title: 'H4',
      icon: H4Icon,
    }
  }
  if (style.name === 'h5') {
    return {
      ...style,
      title: 'H5',
      icon: H5Icon,
    }
  }
  if (style.name === 'h6') {
    return {
      ...style,
      title: 'H6',
      icon: H6Icon,
    }
  }
  if (style.name === 'blockquote') {
    return {
      ...style,
      title: 'Quote',
      icon: QuoteIcon,
    }
  }
  // ...repeat for each style type, or return the original style
  return style
}

export default extendStyle
