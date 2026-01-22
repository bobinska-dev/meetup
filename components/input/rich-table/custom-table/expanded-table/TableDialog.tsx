import { ComponentType } from 'react'
import { Dialog, Flex } from '@sanity/ui'
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
  SanityClient,
} from 'sanity'
import { ColumnHeader } from '../../../../../schemaTypes/rich-table/columnHeader.object'
import { RichTableRowType } from '../../../../../schemaTypes/rich-table/row.object'
import TableExpanded from './TableExpanded'

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
      <Flex padding={3} justify={'center'} align={'center'}>
        <TableExpanded
          value={{ rows: rowValue, columnHeaders: columnHeaderValue }}
          fieldPath={path}
          onChange={onChange}
          columnCount={columnCount}
          rowCount={rowCount}
          _id={_id}
          client={client}
          columnHeaderValue={columnHeaderValue}
          columnHeaderMembers={columnHeaderMembers}
          rowMembersWithCellMembers={rowMembersWithCellMembers}
        />
      </Flex>
    </Dialog>
  )
}
export default TableDialog
