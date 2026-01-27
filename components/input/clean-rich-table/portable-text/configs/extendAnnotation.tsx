import { ExtendAnnotationSchemaType } from '@portabletext/toolbar'
import { LinkIcon } from '@sanity/icons'
import { link } from '@portabletext/keyboard-shortcuts'

export const extendAnnotation: ExtendAnnotationSchemaType = (annotation) => {
  if (annotation.name === 'link') {
    return {
      ...annotation,
      icon: LinkIcon,
      defaultValues: {
        href: 'https://example.com',
      },
      shortcut: link,
    }
  }

  return annotation
}
