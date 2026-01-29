import { ComponentType, Suspense, useMemo } from 'react'
import {
  ArrayOfObjectsFormNode,
  ArrayOfObjectsItemMember,
  FieldMember,
  ObjectFormNode,
  ObjectInputProps,
  ObjectItem,
  ObjectSchemaType,
  useFormValue,
} from 'sanity'
import { Stack } from '@sanity/ui'
import LoadingIndicator from '../../LoadingIndicator'
import { RichTableRowType } from '../../../schemaTypes/rich-table/row.object'
import { ColumnHeader } from '../../../schemaTypes/rich-table/columnHeader.object'
import Table from './table/Table'
import TableWrapper from './table/TableWrapper'

export interface RichTableType {
  rows: Array<RichTableRowType> | undefined
  columnHeaders?: Array<ColumnHeader & ObjectItem>
  hasColumnTitles?: boolean
  hasRowTitles?: boolean
}

const RichTableInput: ComponentType<ObjectInputProps<RichTableType, ObjectSchemaType>> = (
  props,
) => {
  const _id = useFormValue(['_id']) as string
  const _type = useFormValue(['_type']) as string

  // prepare members for TanStack Table
  const tableObjectMembers = useMemo(() => props.members as FieldMember[], [props.members])

  const rowsFieldMember = useMemo(() => {
    return tableObjectMembers?.find(
      (member) => member.name === 'rows',
    ) as FieldMember<ArrayOfObjectsFormNode>
  }, [tableObjectMembers])

  // TODO: type this properly
  const rowMembersWithCellMembers = useMemo(() => {
    return rowsFieldMember?.field.members.map(
      // @ts-ignore
      (item: ArrayOfObjectsItemMember) =>
        (item.item.members as FieldMember<ObjectFormNode>[]).find(
          (member) => member.name === 'cells',
        )?.field.members,
    ) as (ArrayOfObjectsItemMember[] | undefined)[]
  }, [rowsFieldMember])

  return (
    <Stack space={4}>
      <Suspense fallback={<LoadingIndicator />} name={'RichTableInput Suspense'}>
        <TableWrapper>
          {/* Rich table component */}
          <Table
            value={props.value?.rows}
            _type={_type}
            _id={_id}
            path={props.path}
            columnHeaders={props.value?.columnHeaders}
            rowMembersWithCellMembers={rowMembersWithCellMembers}
            onChange={props.onChange}
          />
        </TableWrapper>
      </Suspense>
      {
        // Default inputs (rows, columnHeaders)
        props.renderDefault(props)
      }
    </Stack>
  )
}
export default RichTableInput
