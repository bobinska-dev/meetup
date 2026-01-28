import { ComponentType, Fragment } from 'react'
import {
  ArrayOfObjectsFormNode,
  ArrayOfObjectsItemMember,
  FieldMember,
  ObjectArrayFormNode,
  ObjectFormNode,
  ObjectInputProps,
  ObjectItem,
  OperationsAPI,
  pathToString,
} from 'sanity'
import { RichTableType } from '../../rich-table/RichTableInput'
import { Card } from '@sanity/ui'
import TableButtons from './TableButtons'
import TableGrid from './TableGrid'
import TableScrollWrapper from './TableScrollWrapper'
import { ColumnHeader } from '../../../../schemaTypes/rich-table/columnHeader.object'
import { RichTableCellType } from '../../../../schemaTypes/rich-table/cell.object'
import ColumnHeaderWithInput from './ColumnHeaderWithInput'
import { RichTableRowType } from '../../../../schemaTypes/rich-table/row.object'
import ContentPortableTextInput from '../portable-text/ContentPortableTextEditor'
import RowHeaderWithInput from './RowHeaderWithInput'

const Table: ComponentType<
  ObjectInputProps<RichTableType> & {
    _id: string
    handleOpen?: () => void
    isInDialog?: boolean
    /** Patch function from Sanity document operations for optimistic changes */
    patch: OperationsAPI['patch']
  }
> = ({ isInDialog = false, _id, handleOpen, value, onChange, patch, ...props }) => {
  // * Prepare path
  const path = pathToString(props.path)
  // * Prepare members
  const tableObjectMembers = props.members as FieldMember[]

  const rowsFieldMember = tableObjectMembers?.find(
    (member) => member.name === 'rows',
  ) as FieldMember<ArrayOfObjectsFormNode<Array<RichTableRowType>>>

  const rowMembersWithCellMembers = rowsFieldMember?.field.members.map((rowI) => {
    const row = rowI as ArrayOfObjectsItemMember<ObjectArrayFormNode<RichTableRowType>>
    const rowItem = row.item
    const rowItemObjectMembers = rowItem.members as FieldMember<
      ObjectFormNode<Array<RichTableCellType>>
    >[]
    const cellsFieldMember = rowItemObjectMembers?.find((member) => member.name === 'cells')?.field
    return {
      rowMember: row,
      cellMembers: cellsFieldMember?.members as
        | ArrayOfObjectsItemMember<ObjectArrayFormNode<RichTableCellType>>[]
        | undefined,
    }
  })

  const columnHeaderFieldMember = tableObjectMembers?.find(
    (member) => member.name === 'columnHeaders',
  ) as FieldMember<ArrayOfObjectsFormNode<Array<ColumnHeader & ObjectItem>>>

  const columnHeaderMembers = columnHeaderFieldMember?.field.members as ArrayOfObjectsItemMember<
    ObjectArrayFormNode<ColumnHeader & ObjectItem>
  >[]

  return (
    <Card padding={2} border radius={2}>
      <TableButtons path={path} value={value!} _id={_id} patch={patch}>
        <TableScrollWrapper>
          <TableGrid
            $rowCount={value?.rows?.length || 0}
            // we need to add one extra column for the row titles / context menu
            $columnCount={value?.columnHeaders?.length ? value?.columnHeaders?.length + 1 : 0}
            $isInDialog={false}
          >
            {/* Placeholder for row title column */}
            <div className={'placeholder-cell'} />

            {/* HEADER ROW */}
            {columnHeaderMembers?.map((colHeaderMember, columnIndex) => {
              const colHeaderItem = colHeaderMember.item.value
              // TODO: force remount when columnHeader value has changed in dialog but not in inline table input -> this is maybe caused by missing blur event in the input👇
              // TODO: Add option to hide column headers and row titles
              return (
                <ColumnHeaderWithInput
                  columnHeader={colHeaderItem}
                  _id={_id}
                  patch={patch}
                  value={value!}
                  path={path}
                  key={colHeaderItem._key}
                  columnIndex={columnIndex}
                  rowCount={value?.rows?.length || 0}
                  columnCount={value?.columnHeaders?.length || 0}
                />
              )
            })}

            {/* CONTENT ROWS AND CELLS */}
            {rowMembersWithCellMembers?.map(({ rowMember, cellMembers }, rowIndex) =>
              cellMembers?.map((cellMember, cellIndex) => {
                const cellItem = cellMember.item
                const cellPTEPath = cellItem.path.concat('content')
                const cellValue = value?.rows?.[rowIndex]?.cells?.[cellIndex]?.content
                const rowKey = value?.rows?.[rowIndex]?._key ?? ''
                // TODO: Add row titles and combine with context menu -> possibly input for titles using a small modal and display them vertically
                return (
                  <Fragment key={cellItem.id}>
                    {/* CONTEXT MENU BUTTON */}
                    {cellIndex === 0 && (
                      <RowHeaderWithInput
                        row={rowMember.item.value}
                        patch={patch}
                        rowIndex={rowIndex}
                        path={path}
                      />
                    )}
                    {/* PTE CELL CONTENT */}
                    <ContentPortableTextInput
                      onChange={onChange}
                      path={cellPTEPath}
                      value={cellValue}
                      key={cellItem.id}
                    />
                  </Fragment>
                )
              }),
            )}
          </TableGrid>
        </TableScrollWrapper>
      </TableButtons>
    </Card>
  )
}
export default Table
