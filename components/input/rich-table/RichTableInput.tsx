import { ComponentType, Suspense } from 'react'
import { ObjectInputProps, ObjectSchemaType, useFormValue } from 'sanity'
import { Stack } from '@sanity/ui'
import LoadingIndicator from '../../LoadingIndicator'
import { RichTableRowType } from '../../../schemaTypes/rich-table/row.object'
import { ColumnHeader } from '../../../schemaTypes/rich-table/columnHeader.object'
import Table from './table/Table'
import TableWrapper from './table/TableWrapper'

export interface RichTableType {
  rows: Array<RichTableRowType> | undefined
  columnHeaders?: Array<ColumnHeader>
}

const RichTableInput: ComponentType<ObjectInputProps<RichTableType, ObjectSchemaType>> = (
  props,
) => {
  const _id = useFormValue(['_id']) as string
  const _type = useFormValue(['_type']) as string
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
