import { AddIcon } from '@sanity/icons'
import { Box, Button, Flex, Stack, Text, Tooltip } from '@sanity/ui'
import { ComponentType, ReactNode } from 'react'
import { OperationsAPI } from 'sanity'

import { useAddColumn } from '../hooks/useAddColumn'
import useAddRow from '../hooks/useAddRow'
import { RichTableType } from '../schemas/richTable.object'

interface TableButtonsProps {
  path: string
  children: ReactNode
  /** Patch function from Sanity document operations for optimistic changes */
  patch: OperationsAPI['patch']
  value: RichTableType
  readOnly: boolean | undefined
}

/** # Table Buttons Component
 *  Adds a button to add columns and rows to the table.
 */
const TableButtons: ComponentType<TableButtonsProps> = (props) => {
  const { value, path, patch, readOnly } = props
  if (readOnly) return props.children
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
              path,
              value,
              patch,
            })}
            mode={'ghost'}
            disabled={readOnly}
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
            path,
            value,
            patch,
          })}
          mode={'ghost'}
          disabled={readOnly}
        />
      </Tooltip>
    </Stack>
  )
}
export default TableButtons
