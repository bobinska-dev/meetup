import { SanityClient } from 'sanity'
import { RichTableType } from '../../rich-table/RichTableInput'
import { ComponentType } from 'react'
import { Box, Button, Flex, Stack, Text, Tooltip } from '@sanity/ui'
import { AddIcon } from '@sanity/icons'
import useAddColumn from '../hooks/useAddColumn'
import useAddRow from '../hooks/useAddRow'

interface TableButtonsProps {
  path: string
  children: React.ReactNode
  client: SanityClient
  value: RichTableType
  _id: string
}

/** # Table Buttons Component
 *  Adds a button to add columns and rows to the table.
 */
const TableButtons: ComponentType<TableButtonsProps> = (props) => {
  const { client, value, _id, path } = props

  return (
    <Stack space={4}>
      <Flex gap={4}>
        {props.children}
        <Tooltip
          content={
            <Box>
              <Text size={1}>Add column</Text>
            </Box>
          }
          placement="left"
          portal
        >
          <Button
            // text={'Add column'}
            icon={AddIcon}
            onClick={useAddColumn({
              client,
              _id,
              path,
              value,
            })}
            mode={'ghost'}
          />
        </Tooltip>
      </Flex>
      <Tooltip
        content={
          <Box>
            <Text size={1}>Add Row</Text>
          </Box>
        }
        portal
      >
        <Button
          // text={'Add row'}
          icon={AddIcon}
          onClick={useAddRow({
            client,
            _id,
            path,
            value,
          })}
          mode={'ghost'}
        />
      </Tooltip>
    </Stack>
  )
}
export default TableButtons
