import { ComponentType, useCallback, useMemo } from 'react'
import { Button, Menu, MenuButton, MenuDivider, MenuItem } from '@sanity/ui'
import { EllipsisVerticalIcon } from '@sanity/icons'
import { Path, pathToString, PortableTextBlock, SanityClient, useFormValue } from 'sanity'
import { RichTableRowType } from '../../../../schemaTypes/rich-table/row.object'
import { RichTableCellType } from '../../../../schemaTypes/rich-table/cell.object'

interface ColumnMenuButtonProps {
  columnIndex: number
  columnHeaderKey: string
  client: SanityClient
  _id: string
  path: Path
}
const ColumnMenuButton: ComponentType<ColumnMenuButtonProps> = (props) => {
  const { client, _id, columnIndex, columnHeaderKey, path } = props
  const columnHeaderPathString = useMemo(() => {
    return `${pathToString(path)}.columnHeaders[_key=="${columnHeaderKey}"]`
  }, [path, columnHeaderKey])

  const rowCount = (useFormValue([...path, 'rows']) as RichTableRowType[])?.length

  const newCellItem: Omit<RichTableCellType, '_key'> = {
    _type: 'richTableCell',
    content: [
      { _type: 'block', markDefs: [], children: [{ _type: 'span', text: '', marks: [] }] },
    ] as unknown as PortableTextBlock[],
  }

  const handleDeleteColumn = useCallback(async () => {
    const headerUnsetPatch = client.patch(_id).unset([columnHeaderPathString])
    const cellPathsToUnset = Array.from({ length: rowCount || 0 }, (_, i) => i).map(
      (rowIndex) => `${pathToString(path)}.rows[${rowIndex}].cells[${columnIndex}]`,
    )
    const cellUnsetPatches = client.patch(_id).unset(cellPathsToUnset)

    return await client
      .transaction()
      .patch(headerUnsetPatch)
      .patch(cellUnsetPatches)
      .commit()
      .then((res) => console.log(res))
      .catch((error) => console.error)
  }, [])

  const handleAddColumn = useCallback(async (side: 'left' | 'right') => {
    const newColumnHeader = { title: 'New Column', columnIndex: columnIndex }
    const transaction = client.transaction()
    const addHeaderPatch =
      side === 'right'
        ? client.patch(_id).insert('after', columnHeaderPathString, [newColumnHeader])
        : client.patch(_id).insert('before', columnHeaderPathString, [newColumnHeader])

    const cellPathsToAdd = Array.from({ length: rowCount || 0 }, (_, i) => i).map((rowIndex) => {
      return `${pathToString(path)}.rows[${rowIndex}].cells[${columnIndex}]`
    })
    const addCellPatches = cellPathsToAdd.map((cellPath) => {
      const direction = side === 'right' ? 'after' : 'before'

      return client.patch(_id).insert(direction, cellPath, [newCellItem])
    })

    transaction.patch(addHeaderPatch)
    addCellPatches.forEach((patch) => transaction.patch(patch))

    return await transaction
      .commit({ autoGenerateArrayKeys: true })
      .then((res) => console.log(res))
      .catch((error) => console.error)
  }, [])

  const handleMoveColumn = useCallback(async (direction: 'left' | 'right') => {
    const transaction = client.transaction()
    // TODO implement move column
    /* first the column header, then each cell in each row  have to be stored somewhere as items to be re-inserted at the new position
     * then the old items have to be unset
     * Finally, the stored items have to be inserted at the new position
     */
  }, [])
  return (
    <MenuButton
      button={<Button icon={EllipsisVerticalIcon} mode={'bleed'} />}
      id="column-menu-button"
      menu={
        <Menu>
          <MenuItem text="Add column to the left" onClick={() => handleAddColumn('left')} />
          <MenuItem text="Add column to the right" onClick={() => handleAddColumn('right')} />
          <MenuDivider />
          <MenuItem text="Move column <-" disabled onClick={() => console.log('moved')} />
          <MenuItem text="Move column ->" disabled onClick={() => console.log('moved')} />
          <MenuDivider />
          <MenuItem text="Delete column" onClick={handleDeleteColumn} />
        </Menu>
      }
      popover={{ placement: 'right', portal: true }}
    />
  )
}
export default ColumnMenuButton
