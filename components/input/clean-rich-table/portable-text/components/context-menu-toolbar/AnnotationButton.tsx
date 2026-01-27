import { ComponentType } from 'react'
import { ToolbarAnnotationSchemaType, useAnnotationButton } from '@portabletext/toolbar'
import { Button } from '@sanity/ui'

const AnnotationButton: ComponentType<{ annotation: ToolbarAnnotationSchemaType }> = ({
  annotation,
}) => {
  const annotationButton = useAnnotationButton({ schemaType: annotation })
  return (
    <Button
      key={annotation.name}
      onClick={() =>
        annotationButton.snapshot.matches({ enabled: 'active' })
          ? annotationButton.send({ type: 'remove' })
          : annotationButton.send({
              type: 'add',
              annotation: {
                value: annotation.name === 'link' ? { href: '' } : {},
              },
            })
      }
      selected={annotationButton.snapshot.matches({ enabled: 'active' })}
      aria-selected={annotationButton.snapshot.matches({ enabled: 'active' })}
      icon={annotation.icon}
      padding={2}
      mode={'bleed'}
    />
  )
}
export default AnnotationButton
