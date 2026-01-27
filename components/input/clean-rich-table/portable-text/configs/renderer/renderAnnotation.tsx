import { AnnotationSchemaType, RenderAnnotationFunction } from '@portabletext/editor'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Flex, Popover, Stack, Text, TextInput } from '@sanity/ui'
import { useAnnotationButton, useAnnotationPopover, useToolbarSchema } from '@portabletext/toolbar'
import extendDecorator from '../extendDecorators'
import extendStyle from '../extendStyles'
import { CloseIcon, TrashIcon } from '@sanity/icons'

export const renderAnnotation: RenderAnnotationFunction = (props) => {
  if (props.schemaType.name === 'link') {
    const [open, setOpen] = useState(false)
    const handleToggleOpenClose = useCallback(() => {
      setOpen(!open)
    }, [])
    const [value, setValue] = useState<string>(props.value.href as string)
    const ref = useRef(null)
    const toolbarSchema = useToolbarSchema({
      extendDecorator,
      extendStyle,
    })
    const annotationPopover = useAnnotationPopover({ schemaTypes: toolbarSchema.annotations! })

    const annotationButton = useAnnotationButton({ schemaType: props.schemaType })

    // close popover when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !(ref.current as any).contains(event.target)) {
          annotationPopover.send({ type: 'close' })
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])

    return (
      <>
        <Popover
          content={
            <Box>
              <Stack space={2}>
                <Flex justify={'space-between'} align={'center'} gap={2} paddingBottom={3}>
                  <Text size={1} muted>
                    Edit {props.schemaType.title}
                  </Text>
                  <Button
                    onClick={() => annotationButton.send({ type: 'close dialog' })}
                    icon={CloseIcon}
                  />
                </Flex>

                <Box>
                  <Text as={'label'} htmlFor={'url-input'} size={0}>
                    URL
                  </Text>
                </Box>
                <TextInput
                  value={props.value.href || ''}
                  id={'url-input'}
                  onChange={(e) => {
                    annotationPopover.send({
                      type: 'edit',
                      at: props.path,
                      props: { href: e.currentTarget.value },
                    })
                  }}
                />
                <Flex justify={'flex-end'} align={'center'} gap={2} paddingBottom={3}>
                  <Button
                    padding={0}
                    mode={'bleed'}
                    tone={'critical'}
                    icon={TrashIcon}
                    onClick={() => {
                      annotationPopover.send({
                        type: 'remove',
                        schemaType: props.schemaType as AnnotationSchemaType,
                      })
                    }}
                  />
                </Flex>
              </Stack>
            </Box>
          }
          padding={4}
          placement="top"
          portal
          open={annotationButton.snapshot.matches({
            enabled: { inactive: 'showing dialog' },
          })}
          arrow
          width={1}
        >
          <span
            style={{ textDecoration: 'underline' }}
            key={props.value._key}
            onDoubleClick={handleToggleOpenClose}
            ref={ref}
          >
            {props.children}
          </span>
        </Popover>
        {/*{open && (
          <Dialog
            id={`edit-annotation-${props.value._key}`}
            header="Edit Link Annotation"
            width={1}
            onClose={() => setOpen(false)}
          >
            hello
          </Dialog>
        )}*/}
      </>
    )
  }

  return props.children
}
