import { ComponentType } from 'react'
import TableButtons from './TableButtons'
import TableWrapper from './TableWrapper'
import { Box, Button, Flex, Text, Tooltip } from '@sanity/ui'
import { ExpandIcon } from '@sanity/icons'
import TableGrid from './TableGrid'
import {
  ArrayOfObjectsFormNode,
  ArrayOfObjectsItemMember,
  ArraySchemaType,
  FieldMember,
  InputProps,
  ObjectArrayFormNode,
  ObjectItem,
  ObjectSchemaType,
  Path,
  PortableTextBlock,
  SanityClient,
} from 'sanity'
import { ColumnHeader } from '../../../../schemaTypes/rich-table/columnHeader.object'
import ColumnHeaderWithInput from './ColumnHeaderWithInput'
import RowMenuButton from './RowMenuButton'
import ContentPortableTextInput from '../ContentPortableTextInput'
import { RichTableType } from '../RichTableInput'

interface TableProps {
  columnCount: number
  rowCount: number
  value: RichTableType
  fieldPath: Path
  onChange: InputProps['onChange']
  _id: string
  client: SanityClient
  handleOpen: () => void
  columnHeaderValue?: (ColumnHeader & ObjectItem)[]
  columnHeaderMembers?: FieldMember<
    ArrayOfObjectsFormNode<(ColumnHeader & ObjectItem)[], ArraySchemaType<unknown>>
  >
  rowMembersWithCellMembers?: (
    | ArrayOfObjectsItemMember<ObjectArrayFormNode<ObjectItem, ObjectSchemaType>>[]
    | undefined
  )[]
}
const Table: ComponentType<TableProps> = ({
  columnCount,
  columnHeaderMembers,
  rowMembersWithCellMembers,
  rowCount,
  fieldPath,
  value,
  _id,
  onChange,
  client,
  handleOpen,
  columnHeaderValue,
}) => {
  return (
    <TableButtons
      columnCount={columnCount}
      value={value?.rows!}
      client={client}
      _id={_id}
      path={fieldPath}
      columnHeaders={value.columnHeaders}
    >
      <TableWrapper padding={4} shadow={1} radius={2} tone={'default'}>
        {/* EXPAND TABLE BUTTON */}
        <Flex
          justify={'flex-end'}
          style={{ position: 'absolute', top: '40px', right: '60px', zIndex: 99 }}
        >
          <Tooltip
            content={
              <Box>
                <Text>Expand table</Text>
              </Box>
            }
            portal
          >
            <Button icon={ExpandIcon} onClick={handleOpen} mode={'ghost'} />
          </Tooltip>
        </Flex>
        {/* TABLE GRID */}
        <TableGrid $columnCount={columnCount + 1} $rowCount={rowCount}>
          {/* HEADER ROW */}
          {columnHeaderValue &&
            columnHeaderMembers?.field.members.map((colHeaderMember, index) => {
              const colHeaderItem = (colHeaderMember as ArrayOfObjectsItemMember).item
              const colHeaderItemValue = colHeaderItem.value as ColumnHeader & ObjectItem

              return (
                <ColumnHeaderWithInput
                  columnHeader={colHeaderItemValue}
                  _id={_id}
                  client={client}
                  path={fieldPath}
                  key={colHeaderItemValue._key}
                  columnIndex={index}
                />
              )
            })}

          {/* CONTENT ROWS AND CELLS */}
          {rowMembersWithCellMembers?.map((row, rowIndex) =>
            row?.map((cell, cellIndex) => {
              const cellItem = cell.item
              const cellPTEPath = cellItem.path.concat('content')
              const cellValue = (
                cellItem.value as ObjectItem & {
                  content: PortableTextBlock[]
                }
              )?.content

              return (
                <>
                  {/* CONTEXT MENU BUTTON */}
                  {cellIndex === 0 && (
                    <RowMenuButton
                      rowIndex={rowIndex}
                      path={fieldPath}
                      _id={_id}
                      client={client}
                      rowKey={''}
                    />
                  )}
                  {/* PTE CELL CONTENT */}
                  <ContentPortableTextInput
                    onChange={onChange}
                    path={cellPTEPath}
                    value={cellValue}
                    key={cell.item.id}
                  />
                </>
              )
            }),
          )}
        </TableGrid>
      </TableWrapper>
    </TableButtons>
  )
}
export default Table
