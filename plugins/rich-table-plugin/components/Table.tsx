import { ChangeEvent, ComponentType, Fragment } from 'react'
import {
  ArrayOfObjectsFormNode,
  ArrayOfObjectsItemMember,
  FieldMember,
  ObjectArrayFormNode,
  ObjectFormNode,
  ObjectInputProps,
  ObjectItem,
  OperationsAPI,
  pathToString
} from 'sanity'
import { RichTableType } from '../schemas/richTable.object'
import { Card, Flex, Inline, Switch, Text } from '@sanity/ui'
import TableButtons from './TableButtons'
import TableGrid from './TableGrid'
import TableScrollWrapper from './TableScrollWrapper'
import { ColumnHeader } from '../schemas/columnHeader.object'
import { RichTableCellType } from '../schemas/cell.object'
import ColumnHeaderWithInput from './ColumnHeaderWithInput'
import { RichTableRowType } from '../schemas/row.object'
import ContentPortableTextInput from '../portable-text/ContentPortableTextEditor'
import RowHeaderWithInput from './RowHeaderWithInput'
import RowContextMenu from './RowContextMenu'
import { useToggleTitles } from '../hooks/useToggleTitles'
import ColumnContextMenu from './ColumnContextMenu'

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

  const { hasColumnTitles, hasRowTitles } = value!
  const { toggleColumnTitles, toggleRowTitles } = useToggleTitles(
    hasColumnTitles,
    hasRowTitles,
    patch,
    path,
  )
  return (
    <Card padding={3} border radius={2}>
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
                <Fragment key={colHeaderItem._key}>
                  {hasColumnTitles && (
                    <ColumnHeaderWithInput
                      columnHeader={colHeaderItem}
                      patch={patch}
                      value={value!}
                      path={path}
                      key={colHeaderItem._key}
                      columnIndex={columnIndex}
                      rowCount={value?.rows?.length || 0}
                      columnCount={value?.columnHeaders?.length || 0}
                    />
                  )}
                  {!hasColumnTitles && (
                    <ColumnContextMenu
                      key={colHeaderItem._key}
                      columnIndex={columnIndex}
                      columnHeaderKey={colHeaderItem._key}
                      patch={patch}
                      value={value!}
                      path={path}
                      rowCount={value?.rows?.length || 0}
                      columnCount={value?.columnHeaders?.length || 0}
                      iconHorizontal
                    />
                  )}
                </Fragment>
              )
            })}

            {/* CONTENT ROWS AND CELLS */}
            {rowMembersWithCellMembers?.map(({ rowMember, cellMembers }, rowIndex) =>
              cellMembers?.map((cellMember, cellIndex) => {
                const cellItem = cellMember.item
                const cellPTEPath = cellItem.path.concat('content')
                const cellValue = value?.rows?.[rowIndex]?.cells?.[cellIndex]?.content

                return (
                  <Fragment key={cellItem.id}>
                    {/* CONTEXT MENU BUTTON */}
                    {cellIndex === 0 && hasRowTitles && (
                      <RowHeaderWithInput
                        row={rowMember.item.value}
                        patch={patch}
                        rowIndex={rowIndex}
                        rowCount={value?.rows?.length || 0}
                        path={path}
                      />
                    )}
                    {cellIndex === 0 && !hasRowTitles && (
                      <RowContextMenu
                        rowIndex={rowIndex}
                        rowCount={value?.rows?.length || 0}
                        row={rowMember.item.value}
                        patch={patch}
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
      {isInDialog && (
        <Flex gap={3} justify={'flex-end'} align={'center'} paddingTop={3}>
          <Inline space={2}>
            <Text as={'label'} htmlFor={'row-title-toggle'} size={0} muted>
              Show row titles
            </Text>
            <Switch
              checked={hasRowTitles}
              role="switch"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                toggleRowTitles(e.currentTarget.checked)
              }
              label={'Show row titles'}
              id={'row-title-toggle'}
            />
          </Inline>
          <Inline space={2}>
            <Text as={'label'} htmlFor={'column-title-toggle'} size={0} muted>
              Show column titles
            </Text>
            <Switch
              checked={hasColumnTitles}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                toggleColumnTitles(e.currentTarget.checked)
              }
              label={'Show column titles'}
              id={'column-title-toggle'}
            />
          </Inline>
        </Flex>
      )}
    </Card>
  )
}
export default Table
