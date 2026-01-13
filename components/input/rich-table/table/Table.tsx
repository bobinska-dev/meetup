import { ComponentType, useCallback, useMemo } from 'react'
import { Button, Card, Flex, Stack } from '@sanity/ui'
import { RichTableType } from '../RichTableInput'
import { AddIcon } from '@sanity/icons'
import { Path, pathToString, PortableTextBlock, useClient } from 'sanity'
import { RichTableCellType } from '../../../../schemaTypes/rich-table/cell.object'
import { RichTableRowType } from '../../../../schemaTypes/rich-table/row.object'

interface TableProps {
  value: RichTableType['rows']
  columnHeaders?: RichTableType['columnHeaders']
  _id: string
  _type: string
  path: Path
}
const Table: ComponentType<TableProps> = (props) => {
  const { value, columnHeaders, _id, _type, path } = props
  const client = useClient({ apiVersion: '2026-01-01' }).withConfig({
    requestTagPrefix: 'rich-table-input',
  })

  // determine the max number of cells in all rows
  const maxCellCountAllRows = useMemo(
    () => (value ? Math.max(0, ...value.map((row) => row.cells?.length || 0)) : 1),
    [value],
  )
  console.log('maxCellCountAllRows', maxCellCountAllRows)
  const handleAddRow = useCallback(async () => {
    // create as many cell items as there are maxCellCountAllRows
    const cells: Omit<RichTableCellType, '_key'>[] = Array.from(
      { length: maxCellCountAllRows },
      () => {
        return {
          _type: 'richTableCell',
          content: [
            { _type: 'block', markDefs: [], children: [{ _type: 'span', text: '', marks: [] }] },
          ] as unknown as PortableTextBlock[],
        }
      },
    )
    // new row item
    const newRow: Omit<RichTableRowType, '_key'> = {
      _type: 'row',
      // @ts-ignore // keys will be automatically generated
      cells: cells,
    }
    console.log(maxCellCountAllRows, newRow)

    const setArrayPatch = client.patch(_id).setIfMissing({ [pathToString(path)]: { rows: [] } })

    const rowsPath = pathToString([...path, 'rows'])
    const newRowPatch = client.patch(_id).append(rowsPath, [newRow])

    return await client
      .transaction()
      .patch(setArrayPatch)
      .patch(newRowPatch)
      .commit({ autoGenerateArrayKeys: true })
      .then((res) => console.log('Row successfully added', res))
      .catch((err) => console.error(err))
  }, [path, maxCellCountAllRows])

  const handleAddColumn = useCallback(async () => {
    const newCellItem: Omit<RichTableCellType, '_key'> = {
      _type: 'richTableCell',
      content: [
        { _type: 'block', markDefs: [], children: [{ _type: 'span', text: '', marks: [] }] },
      ] as unknown as PortableTextBlock[],
    }
    // if there are no rows -> setIfMissing the rows array -> add first row with one cell
    if (!value || value.length === 0) {
      const firstRow: Omit<RichTableRowType, '_key'> = {
        _type: 'row',
        // @ts-ignore // keys will be automatically generated
        cells: [newCellItem],
      }
      const setArrayPatch = client.patch(_id).setIfMissing({ [pathToString(path)]: { rows: [] } })

      const firstRowPatch = client
        .patch(_id)
        .append(`${pathToString([...path, 'rows'])}`, [firstRow])

      return await client
        .transaction()
        .patch(setArrayPatch)
        .patch(firstRowPatch)
        .commit({ autoGenerateArrayKeys: true })
        .then((res) => console.log('First row and column successfully added', res))
        .catch((err) => console.error(err))
    }

    // for each row, append a new cell
    const transaction = client.transaction()

    value.forEach((row, rowIndex) => {
      const newCellPatch = client
        .patch(_id)
        .append(`${pathToString([...path, 'rows', rowIndex, 'cells'])}`, [newCellItem])
      transaction.patch(newCellPatch)
    })

    return await transaction
      .commit({ autoGenerateArrayKeys: true })
      .then((res) => console.log('Column successfully added', res))
      .catch((err) => console.error(err))
  }, [value])

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Flex gap={4}>
          {/* TABLE */}
          <Card shadow={1} padding={4} tone={'default'} flex={1}></Card>
          {/* Add column button */}
          <Button text={'Add column'} icon={AddIcon} onClick={handleAddColumn} />
        </Flex>
        {/* Add row button */}
        <Flex>
          <Button text={'Add row'} icon={AddIcon} onClick={handleAddRow} />
        </Flex>
      </Stack>
    </Card>
  )
}

export default Table
