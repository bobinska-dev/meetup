import { Box, Button, Flex, Stack, Text, Tooltip } from '@sanity/ui'
import { ComponentType, Suspense, useCallback, useMemo, useState } from 'react'
import {
  ArrayOfObjectsFormNode,
  ArrayOfObjectsItemMember,
  ArraySchemaType,
  FieldMember,
  ObjectFormNode,
  ObjectInputProps,
  ObjectItem,
  ObjectSchemaType,
  PortableTextBlock,
  useClient,
  useFormValue
} from 'sanity'
import { RichTableType } from '../RichTableInput'
import LoadingIndicator from '../../../LoadingIndicator'
import TableGrid from './TableGrid'
import ContentPortableTextInput from '../ContentPortableTextInput'
import TableWrapper from './TableWrapper'
import TableButtons from './TableButtons'
import { ColumnHeader } from '../../../../schemaTypes/rich-table/columnHeader.object'
import ColumnHeaderWithInput from './ColumnHeaderWithInput'
import { ExpandIcon } from '@sanity/icons'
import TableDialog from './expanded-table/TableDialog'
import RowMenuButton from './RowMenuButton'

const CustomRichTableInput: ComponentType<ObjectInputProps<RichTableType, ObjectSchemaType>> = (
  props,
) => {
  const { value, members, path, onChange, ...rest } = props
  const _id = useFormValue(['_id']) as string

  // * Sanity client
  const client = useClient({ apiVersion: '2026-01-01' }).withConfig({
    requestTagPrefix: 'rich-table-input',
  })
  const [openDialog, setOpenDialog] = useState(true)
  const handleOpen = useCallback(() => setOpenDialog(true), [])
  const handleClose = useCallback(() => setOpenDialog(false), [])

  // * Prepare members
  const tableObjectMembers = useMemo(() => props.members as FieldMember[], [props.members])

  const rowsFieldMember = useMemo(() => {
    return tableObjectMembers?.find(
      (member) => member.name === 'rows',
    ) as FieldMember<ArrayOfObjectsFormNode>
  }, [tableObjectMembers])

  const rowMembersWithCellMembers = useMemo(() => {
    return rowsFieldMember?.field.members.map(
      // @ts-ignore
      (item: ArrayOfObjectsItemMember) =>
        (item.item.members as FieldMember<ObjectFormNode>[]).find(
          (member) => member.name === 'cells',
        )?.field.members,
    ) as (ArrayOfObjectsItemMember[] | undefined)[]
  }, [rowsFieldMember])

  // * Calculate column and row counts
  const columnCount = useMemo(
    () =>
      value && value.rows ? Math.max(0, ...value.rows?.map((row) => row.cells?.length || 0)) : 1,
    [value],
  )
  const rowCount = useMemo(() => (value && value.rows ? value.rows.length : 1), [])

  // * prepare ColumnHeaders
  const columnHeaderValue = useMemo(() => {
    return value?.columnHeaders || []
  }, [value?.columnHeaders])
  const columnHeaderMembers = useMemo(() => {
    return tableObjectMembers?.find((member) => member.name === 'columnHeaders') as FieldMember<
      ArrayOfObjectsFormNode<Array<ColumnHeader & ObjectItem>, ArraySchemaType>
    >
  }, [tableObjectMembers])
  return (
    <Stack>
      <Suspense fallback={<LoadingIndicator />} name={'RichTableInput Suspense'}>
        {value?.rows && (
          <TableButtons
            columnCount={columnCount}
            value={value?.rows}
            client={client}
            _id={_id}
            path={path}
            columnHeaders={value.columnHeaders}
          >
            <TableWrapper padding={4} shadow={1} radius={2} tone={'default'}>
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
              <TableGrid $columnCount={columnCount + 1} $rowCount={rowCount}>
                <div className={'colPlacerholder'} />
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
                      <>
                        {cellIndex === 0 && (
                          <RowMenuButton
                            rowIndex={rowIndex}
                            path={path}
                            _id={_id}
                            client={client}
                            rowKey={''}
                          />
                        )}
                        <ContentPortableTextInput
                          onChange={props.onChange}
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
        )}
      </Suspense>
      {openDialog && (
        <TableDialog
          handleClose={handleClose}
          path={path}
          _id={_id}
          client={client}
          onChange={onChange}
          columnCount={columnCount}
          rowCount={rowCount}
          columnHeaderValue={columnHeaderValue}
          columnHeaderMembers={columnHeaderMembers}
          rowMembersWithCellMembers={rowMembersWithCellMembers}
          rowValue={value?.rows!}
        />
      )}
      {
        // Default inputs (rows, columnHeaders)
        props.renderDefault(props)
      }
    </Stack>
  )
}
export default CustomRichTableInput
