// DeletionLogItemComponent.tsx
import { RestoreIcon } from '@sanity/icons'
import { Card, Flex, Stack, Text } from '@sanity/ui'
import { ComponentType } from 'react'
import { IntentButton, ObjectItemProps } from 'sanity'
import { LogItem } from '../../schemaTypes/singletons/deletedDocBinDocument'

/** ### Array Item Component for each log entry
 *
 * with Intent Button to open the document and restore it
 */
export const DeletionLogItemComponent: ComponentType<ObjectItemProps<LogItem>> = (props) => {
  // * Get the value from the props
  const value = props.value

  // * Format the date to be nice and universal
  const date = new Date(value.deletedAt)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const formattedDate = `${date.getDate()}.${months[date.getMonth()]} ${date.getFullYear()}`

  return (
    /* only display a border top, if its not the first one 💅 */
    <Card borderTop={props.index > 0 ? true : false}>
      {/*
       * * * Flex container for "custom" item preview and Intent Button */}
      <Flex justify={'space-between'} align={'center'} gap={2} paddingX={4} paddingY={4}>
        {/*
         * * * Custom item preview with the document title, type and date */}
        <Stack space={3}>
          <Text weight="semibold">{value.documentTitle}</Text>

          <Text muted size={1}>
            Type: {value.type}
          </Text>

          <Text muted size={1}>
            Deleted: {formattedDate}
          </Text>
          <Text muted size={0}>
            ID: {value.docId}, Revision: {value._key as string}
          </Text>
        </Stack>
        {/*
         * * * Intent Button */}
        {value.docId && (
          <IntentButton
            icon={RestoreIcon}
            tone={'positive'}
            mode="ghost"
            intent="edit"
            params={{
              type: value.type,
              id: value.docId,
              revision: value._key,
            }}
            text="Open to restore"
            tooltipProps={{
              placement: 'top',
              content: 'You can restore this document after opening it',
            }}
          />
        )}
      </Flex>
    </Card>
  )
}
