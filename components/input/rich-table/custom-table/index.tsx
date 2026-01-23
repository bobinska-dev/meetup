import { Button, Flex, Stack } from '@sanity/ui'
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
  pathToString,
  PortableTextBlock,
  useClient,
  useFormValue
} from 'sanity'
import { RichTableType } from '../RichTableInput'
import LoadingIndicator from '../../../LoadingIndicator'
import { ColumnHeader } from '../../../../schemaTypes/rich-table/columnHeader.object'
import TableDialog from './expanded-table/TableDialog'
import Table from './Table'
import InitialiseTable from '../InitialiseTable'

const CustomRichTableInput: ComponentType<ObjectInputProps<RichTableType, ObjectSchemaType>> = (
  props,
) => {
  const { value, members, path, onChange, ...rest } = props
  const _id = useFormValue(['_id']) as string

  // * Sanity client
  const client = useClient({ apiVersion: '2026-01-01' }).withConfig({
    requestTagPrefix: 'rich-table-input',
  })
  const [openDialog, setOpenDialog] = useState(false)
  const handleOpen = useCallback(() => setOpenDialog(true), [])
  const handleClose = useCallback(() => setOpenDialog(false), [])

  // * Prepare members
  const tableObjectMembers = props.members as FieldMember[]

  const rowsFieldMember = tableObjectMembers?.find(
    (member) => member.name === 'rows',
  ) as FieldMember<ArrayOfObjectsFormNode>

  const rowMembersWithCellMembers = rowsFieldMember?.field.members.map(
    // @ts-ignore
    (item: ArrayOfObjectsItemMember) =>
      (item.item.members as FieldMember<ObjectFormNode>[]).find((member) => member.name === 'cells')
        ?.field.members,
  ) as (ArrayOfObjectsItemMember[] | undefined)[]

  // * Calculate column and row counts
  const columnCount = useMemo(
    () =>
      value && value.rows ? Math.max(0, ...value.rows?.map((row) => row.cells?.length || 0)) : 1,
    [value],
  )
  const rowCount = useMemo(() => (value && value.rows ? value.rows.length : 1), [value])

  // * prepare ColumnHeaders
  const columnHeaderValue = useMemo(() => {
    return value?.columnHeaders || []
  }, [value])

  const columnHeaderMembers = tableObjectMembers?.find(
    (member) => member.name === 'columnHeaders',
  ) as FieldMember<ArrayOfObjectsFormNode<Array<ColumnHeader & ObjectItem>, ArraySchemaType>>

  console.log('index value', value)
  return (
    <Stack>
      <Suspense fallback={<LoadingIndicator />} name={'RichTableInput Suspense'}>
        {(!value || !value.rows) && (
          <Flex justify={'center'}>
            <Button
              text="Initialize table"
              onClick={() =>
                client
                  .patch(_id)
                  .set({
                    [pathToString([...path, 'rows'])]: [
                      {
                        _type: 'row',
                        cells: [
                          {
                            _type: 'richTableCell',
                            content: [
                              {
                                _type: 'block',
                                markDefs: [],
                                children: [{ _type: 'span', text: '', marks: [] }],
                              },
                            ] as unknown as PortableTextBlock[],
                          },
                        ],
                      },
                    ],
                    [pathToString([...path, 'columnHeaders'])]: [
                      {
                        _type: 'columnHeader',
                        title: `New column title`,
                        cellIndex: 0,
                      },
                    ],
                  })
                  .commit({ autoGenerateArrayKeys: true })
                  .then((res) => console.log('Table initialized', res))
                  .catch(console.error)
              }
            />
          </Flex>
        )}
        {(!value || !value?.rows) && <InitialiseTable />}
        {value?.rows && (
          <Table
            value={value}
            fieldPath={path}
            onChange={onChange}
            columnCount={columnCount}
            rowCount={rowCount}
            _id={_id}
            client={client}
            handleOpen={handleOpen}
            columnHeaderValue={columnHeaderValue}
            columnHeaderMembers={columnHeaderMembers}
            rowMembersWithCellMembers={rowMembersWithCellMembers}
          />
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
