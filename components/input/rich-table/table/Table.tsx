import { ComponentType, useMemo } from 'react'
import { Box, Button, Flex, Stack } from '@sanity/ui'
import { RichTableType } from '../RichTableInput'
import { AddIcon } from '@sanity/icons'
import { ArrayOfObjectsItemMember, InputProps, isArray, useClient } from 'sanity'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import useHandleAddColumn from '../hooks/useHandleAddColumn'
import useHandleAddRow from '../hooks/useHandleAddRow'
import { RichTableRowType } from '../../../../schemaTypes/rich-table/row.object'
import ContentPortableTextInput from '../../clean-rich-table/portable-text/ContentPortableTextEditor'
import { TableWidthCard } from './TableCard'
import TanTable from './TanTable'
import ColumnHeaderWithInput from './ColumnHeaderWithInput'

interface TableProps {
  value: RichTableType['rows']
  columnHeaders?: RichTableType['columnHeaders']
  _id: string
  _type: string
  path: InputProps['path']
  rowMembersWithCellMembers: (ArrayOfObjectsItemMember[] | undefined)[]
  onChange: InputProps['onChange']
}
const Table: ComponentType<TableProps> = (props) => {
  const { value, columnHeaders, _id, onChange, path, rowMembersWithCellMembers } = props
  const client = useClient({ apiVersion: '2026-01-01' }).withConfig({
    requestTagPrefix: 'rich-table-input',
  })

  // determine the max number of cells in all rows
  const maxCellCountAllRows = useMemo(
    () => (value ? Math.max(0, ...value.map((row) => row.cells?.length || 0)) : 1),
    [value],
  )
  const rowsCount = value ? value.length : 0

  // TanStack Table setup
  const columnHelper = createColumnHelper<RichTableRowType>()
  const columns = useMemo(() => {
    if (!columnHeaders || columnHeaders.length === 0) {
      return []
    }
    return columnHeaders.map((colHeader, index) =>
      // @ts-ignore
      columnHelper.accessor((row) => row.cells[index], {
        id: colHeader._key || `col-${index}`,
        cell: (info) => {
          const cellValue = info.getValue()
          const row = info.row.original
          const rowIndex = info.row.index
          const cellMember = useMemo(() => {
            return rowMembersWithCellMembers[rowIndex]?.find((cellMember) => {
              return cellMember.item.value._key === cellValue?._key
            })
          }, [])
          const cellItem = cellMember?.item
          const cellPTEPath = cellItem?.path.concat('content')

          return (
            <Box>
              {cellPTEPath && isArray(cellPTEPath) && (
                <ContentPortableTextInput
                  onChange={onChange}
                  path={cellPTEPath!}
                  value={cellValue?.content}
                  key={cellItem?.id}
                />
              )}
            </Box>
          )
        },
        header: () => (
          <ColumnHeaderWithInput columnHeader={colHeader} _id={_id} client={client} path={path} />
        ), //  <span>{colHeader.title || 'no column title yet'}</span>,
        footer: (info) => '+/-',
      }),
    )
  }, [columnHeaders, rowsCount])

  const table = useReactTable({
    data: value || [],
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    /*    debugTable: true,
    debugHeaders: true,
    debugColumns: true,*/
  })
  const fullTableWidth = table.getAllColumns().reduce((sum, col) => sum + col.getSize(), 0)

  return (
    <TableWidthCard $tableWidth={fullTableWidth}>
      <Stack space={4}>
        <Flex gap={4}>
          {/* TABLE */}
          {props.value && <TanTable table={table} />}
          {/* Add column button */}
          <Button
            // text={'Add column'}
            icon={AddIcon}
            onClick={useHandleAddColumn({
              client,
              _id,
              path,
              maxCellCountAllRows,
              value,
              columnHeaders,
            })}
            mode={'ghost'}
          />
        </Flex>
        {/* Add row button */}

        <Button
          // text={'Add row'}
          icon={AddIcon}
          onClick={useHandleAddRow({
            client,
            _id,
            path,
            maxCellCountAllRows,
          })}
          mode={'ghost'}
        />
      </Stack>
    </TableWidthCard>
  )
}

export default Table
