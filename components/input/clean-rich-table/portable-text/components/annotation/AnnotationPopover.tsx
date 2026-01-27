import { ComponentType, useState } from 'react'
import { ToolbarAnnotationSchemaType, useAnnotationPopover } from '@portabletext/toolbar'
import { Box, Button, Flex, Popover, Stack, Text } from '@sanity/ui'
import { EditIcon, TrashIcon } from '@sanity/icons'
import AnnotationDialog from './AnnotationDialog'

const AnnotationPopover: ComponentType<{
  schemaTypes: ReadonlyArray<ToolbarAnnotationSchemaType>
}> = (props) => {
  const annotationPopover = useAnnotationPopover(props)
  const [open, setOpen] = useState(false)

  if (
    annotationPopover.snapshot.matches('disabled') ||
    annotationPopover.snapshot.matches({ enabled: 'inactive' })
  ) {
    return null
  }
  // Cast the ref's current value to HTMLElement | null to satisfy the Popover prop type
  const referenceEl = annotationPopover.snapshot.context.elementRef?.current as HTMLElement | null

  // TODO: SOLVE ISSUE WITH ANNOTATION DIALOGS NOT OPENING CORRECTLY FROM POPOVER ITEMS
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
                    onClick={() => setOpen(true)}
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

              {open && (
                <AnnotationDialog
                  annotation={annotation}
                  key={annotation.value._key}
                  onSubmit={({ value }) => {
                    annotationPopover.send({
                      type: 'edit',
                      at: annotation.at,
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
            </Box>
          ))}
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
