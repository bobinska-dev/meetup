import {ExtendStyleSchemaType} from '@portabletext/toolbar'

const extendStyle: ExtendStyleSchemaType = (style) => {
  // Apply updates to the schema, if needed
  if (style.name === 'normal') {
    return {
      ...style,
      title: 'Aa',
      // icon: () => <BsType />,
    }
  }
  if (style.name === 'h1') {
    return {
      ...style,
      title: 'H1',
      // icon: () => <BsTypeH1 />,
    }
  }
  if (style.name === 'h2') {
    return {
      ...style,
      title: 'H2',
      // icon: () => <BsTypeH2 />,
    }
  }
  if (style.name === 'h3') {
    return {
      ...style,
      title: 'H3',
      // icon: () => <BsTypeH3 />,
    }
  }
  if (style.name === 'h4') {
    return {
      ...style,
      title: 'H4',
      // icon: () => <BsTypeH4 />,
    }
  }
  if (style.name === 'h5') {
    return {
      ...style,
      title: 'H5',
      // icon: () => <BsTypeH5 />,
    }
  }
  if (style.name === 'h6') {
    return {
      ...style,
      title: 'H6',
      // icon: () => <BsTypeH6 />,
    }
  }
  if (style.name === 'blockquote') {
    return {
      ...style,
      title: '"',
      // icon: () => <BsBlockquoteLeft />,
    }
  }
  // ...repeat for each style type, or return the original style
  return style
}

export default extendStyle
