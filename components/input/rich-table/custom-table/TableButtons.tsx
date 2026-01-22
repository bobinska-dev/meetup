import { Path, SanityClient } from 'sanity'
import { ComponentType, ReactNode } from 'react'
import { Box, Button, Flex, Stack, Text, Tooltip } from '@sanity/ui'
import { AddIcon } from '@sanity/icons'
import useHandleAddColumn from '../hooks/useHandleAddColumn'
import useHandleAddRow from '../hooks/useHandleAddRow'
import { RichTableRowType } from '../../../../schemaTypes/rich-table/row.object'
import { ColumnHeader } from '../../../../schemaTypes/rich-table/columnHeader.object'

interface TableButtonsProps {
  path: Path
  children: ReactNode
  client: SanityClient
  columnCount: number
  value: RichTableRowType[] | undefined
  _id: string
  columnHeaders?: ColumnHeader[]
}

const TableButtons: ComponentType<TableButtonsProps> = (props) => {
  const { client, columnCount, value, _id, path, columnHeaders } = props

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
            onClick={useHandleAddColumn({
              client,
              _id,
              path,
              maxCellCountAllRows: columnCount,
              value,
              columnHeaders,
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
          onClick={useHandleAddRow({
            client,
            _id,
            path,
            maxCellCountAllRows: columnCount,
          })}
          mode={'ghost'}
        />
      </Tooltip>
    </Stack>
  )
}
export default TableButtons
