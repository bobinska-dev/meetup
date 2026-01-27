import { ComponentType, useState } from 'react'
import { AnnotationPath, PortableTextObject } from '@portabletext/editor'
import { AnnotationPopover, ToolbarAnnotationSchemaType } from '@portabletext/toolbar'
import { Box, Button, Card, Dialog, Flex, Stack, Text, TextInput } from '@sanity/ui'
import { EditIcon, TrashIcon } from '@sanity/icons'

interface AnnotationPopoverItem {
  annotation: {
    value: PortableTextObject
    schemaType: ToolbarAnnotationSchemaType
    at: AnnotationPath
  }
  annotationPopover: AnnotationPopover
}
const AnnotationPopoverItem: ComponentType<AnnotationPopoverItem> = (props) => {
  const { annotation, annotationPopover } = props
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(
    props.annotation.value || props.annotation.schemaType.defaultValues,
  )
  return (
    <Box>
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
              annotationPopover.send({ type: 'close' })
            }}
          />
        </Flex>
      </Stack>

      {open && (
        /*<AnnotationDialog
          annotation={annotation}
          key={annotation.value._key}
          onSubmit={({ value }) => onSubmit({ value })}
          onClose={() => {
            setOpen(false)
            return closePopover
          }}
        />*/
        <Dialog
          id={'edit-annotation-dialog'}
          header={'Edit ' + props.annotation.schemaType.title}
          onClose={() => annotationPopover.send({ type: 'close' })}
        >
          <Stack padding={4}>
            {props.annotation.schemaType.fields?.map((field, index) => {
              if (field.type === 'string') {
                return (
                  <Stack space={3} key={field.name}>
                    <Text as={'label'} size={0} htmlFor={field.name}>
                      {field.title}
                    </Text>
                    <TextInput
                      autoFocus={index === 0}
                      value={value[field.name] as string}
                      onChange={(e) => setValue({ ...value, [field.name]: e.currentTarget.value })}
                      id={field.name}
                      // TODO: add validation based on field definition
                    />
                  </Stack>
                )
              }
              return (
                <Card tone={'caution'} key={field.name}>
                  Input for {field.title} coming soon!
                </Card>
              )
            })}
            <Flex justify={'flex-end'} align={'center'} padding={3}>
              <Button
                mode={'ghost'}
                onClick={() => {
                  annotationPopover.send({
                    type: 'edit',

                    at: annotation.at,
                    props: { value: value },
                  })
                  return annotationPopover.send({ type: 'close' })
                }}
                text={'Done!'}
              />
            </Flex>
          </Stack>
        </Dialog>
      )}
    </Box>
  )
}

export default AnnotationPopoverItem
