import { ToolbarAnnotationSchemaType, useAnnotationButton } from '@portabletext/toolbar'
import { Button } from '@sanity/ui'
import { ComponentType } from 'react'

/** Button component for toggling annotations in a rich text editor.
 *
 * @param annotation - `annotation`: {@link ToolbarAnnotationSchemaType} The annotation schema type defining the annotation.
 *
 * ## Usage
 * ```tsx
 * // in PTE toolbar
 *  {toolbarSchema.annotations?.map((annotation) => (
 *   <AnnotationButton key={annotation.name} annotation={annotation} />
 *  ))}
 * ```
 *
 */
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
      title={annotation.shortcut?.keys.join('+')}
    />
  )
}
export default AnnotationButton
