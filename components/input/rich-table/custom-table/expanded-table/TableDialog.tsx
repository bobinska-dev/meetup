import { ComponentType } from 'react'
import { Box, Dialog } from '@sanity/ui'
import TableGrid from '../TableGrid'
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
import { ColumnHeader } from '../../../../../schemaTypes/rich-table/columnHeader.object'
import ColumnHeaderWithInput from '../ColumnHeaderWithInput'
import ContentPortableTextInput from '../../ContentPortableTextInput'
import { RichTableRowType } from '../../../../../schemaTypes/rich-table/row.object'
import TableButtons from '../TableButtons'

interface TableDialogProps {
  handleClose: () => void
  columnHeaderMembers?: FieldMember<
    ArrayOfObjectsFormNode<(ColumnHeader & ObjectItem)[], ArraySchemaType<unknown>>
  >
  rowMembersWithCellMembers?: (
    | ArrayOfObjectsItemMember<ObjectArrayFormNode<ObjectItem, ObjectSchemaType>>[]
    | undefined
  )[]
  columnHeaderValue?: (ColumnHeader & ObjectItem)[]
  _id: string
  client: SanityClient
  columnCount: number
  rowCount: number
  path: Path
  onChange: InputProps['onChange']
  rowValue: RichTableRowType[]
}
const TableDialog: ComponentType<TableDialogProps> = (props) => {
  const {
    handleClose,
    columnHeaderValue,
    columnHeaderMembers,
    columnCount,
    rowCount,
    rowMembersWithCellMembers,
    client,
    _id,
    path,
    onChange,
    rowValue,
  } = props
  return (
    <Dialog
      id={'expanded-table-dialog'}
      width={4}
      header="Expanded table editor"
      onClose={handleClose}
    >
      {/* Dialog content goes here */}
      <Box padding={3}>
        <TableButtons
          columnCount={columnCount}
          value={rowValue}
          client={client}
          _id={_id}
          path={path}
          columnHeaders={columnHeaderValue}
        >
          <TableGrid $columnCount={columnCount} $rowCount={rowCount}>
            {columnHeaderValue &&
              columnHeaderMembers?.field.members.map((colHeaderMember, index) => {
                const colHeaderItem = (colHeaderMember as ArrayOfObjectsItemMember).item
                const colHeaderItemValue = colHeaderItem.value as ColumnHeader & ObjectItem

                return (
                  <ColumnHeaderWithInput
                    columnHeader={colHeaderItemValue}
                    _id={_id}
                    client={client}
                    path={path}
                    key={colHeaderItemValue._key}
                    columnIndex={index}
                  />
                )
              })}
            {rowMembersWithCellMembers?.map((row, rowIndex) =>
              row?.map((cell, cellIndex) => {
                const cellItem = cell.item
                const cellPTEPath = cellItem.path.concat('content')
                const cellValue = (
                  cellItem.value as ObjectItem & {
                    content: PortableTextBlock[]
                  }
                )?.content
                // console.log(cell)
                return (
                  <ContentPortableTextInput
                    onChange={onChange}
                    path={cellPTEPath}
                    value={cellValue}
                    key={cell.item.id}
                  />
                )
              }),
            )}
          </TableGrid>
        </TableButtons>
      </Box>
    </Dialog>
  )
}
export default TableDialog
