import { ComponentType, useState } from 'react'
import { ToolbarAnnotationSchemaType, useAnnotationPopover } from '@portabletext/toolbar'
import { Box, Button, Flex, Popover, Stack, Text } from '@sanity/ui'
import { EditIcon, TrashIcon } from '@sanity/icons'
import AnnotationDialog from './AnnotationDialog'
import { AnnotationPath, PortableTextObject } from '@portabletext/editor'

/** Popover component that shows the list of active annotations for the current selection.
 *
 * @param props - `schemaTypes`: {@link ToolbarAnnotationSchemaType} The array of annotation schema types available in the editor.
 *
 * ## Usage
 * ```tsx
 *   // in PTE toolbar attach this component
 *   {toolbarSchema.annotations && <AnnotationPopover schemaTypes={toolbarSchema.annotations} />
 *   }
 * ```
 *
 */
const AnnotationPopover: ComponentType<{
  schemaTypes: ReadonlyArray<ToolbarAnnotationSchemaType>
}> = (props) => {
  const annotationPopover = useAnnotationPopover(props)
  const [open, setOpen] = useState(false)
  const [openAnnotation, setOpenAnnotation] = useState<{
    value: PortableTextObject
    schemaType: ToolbarAnnotationSchemaType
    at: AnnotationPath
  } | null>(null)

  if (
    annotationPopover.snapshot.matches('disabled') ||
    annotationPopover.snapshot.matches({ enabled: 'inactive' })
  ) {
    return null
  }
  // Cast the ref's current value to HTMLElement | null to satisfy the Popover prop type
  const referenceEl = annotationPopover.snapshot.context.elementRef?.current as HTMLElement | null

  return (
    <Popover
      content={
        <Stack space={3} padding={3}>
          {annotationPopover.snapshot.context.annotations.map((annotation, index) => (
            <Box key={annotation.value._key}>
              <Stack>
                <Flex justify={'space-between'} align={'center'} gap={3}>
                  <Text size={1}>{annotation.schemaType.title}</Text>
                  <Button
                    icon={EditIcon}
                    mode={'bleed'}
                    fontSize={0}
                    padding={0}
                    onClick={() => {
                      setOpen(true)
                      setOpenAnnotation(annotation)
                    }}
                  />
                  <Button
                    icon={TrashIcon}
                    mode={'bleed'}
                    padding={0}
                    fontSize={0}
                    onClick={() => {
                      annotationPopover.send({
                        type: 'remove',
                        schemaType: annotation.schemaType,
                      })
                    }}
                  />
                </Flex>
              </Stack>
            </Box>
          ))}
          {open && openAnnotation && (
            <AnnotationDialog
              annotation={openAnnotation}
              key={openAnnotation.value._key}
              onSubmit={({ value }) => {
                annotationPopover.send({
                  type: 'edit',
                  at: openAnnotation.at,
                  props: value,
                })
                setOpen(false)
              }}
              onClose={() => {
                setOpen(false)
                return annotationPopover.send({ type: 'close' })
              }}
            />
          )}
        </Stack>
      }
      arrow
      open
      referenceElement={referenceEl}
      floatingBoundary={referenceEl}
      placement={'top'}
      preventOverflow={false}
    />
  )
}
export default AnnotationPopover
