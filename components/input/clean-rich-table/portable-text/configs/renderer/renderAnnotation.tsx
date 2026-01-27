import { RenderAnnotationFunction } from '@portabletext/editor'

export const renderAnnotation: RenderAnnotationFunction = (props) => {
  if (props.schemaType.name === 'link') {
    return (
      <span style={{ textDecoration: 'underline' }} id={'annotation-' + props.value._key}>
        {props.children}
      </span>
    )
  }

  return props.children
}
