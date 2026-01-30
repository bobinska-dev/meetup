import { ComponentType, useCallback } from 'react'
import { Button, Menu, MenuButton, MenuDivider, MenuItem } from '@sanity/ui'
import { EllipsisHorizontalIcon, EllipsisVerticalIcon } from '@sanity/icons'
import { ObjectItem, OperationsAPI, PortableTextBlock } from 'sanity'

import { generateKey } from '../utils/generateKey'
import { PatchOperations } from '@sanity/types'
import { RichTableType } from '../schemas/richTable.object'
import { ColumnHeader } from '../schemas/columnHeader.object'
import { RichTableCellType } from '../schemas/cell.object'
import {
  TbArrowBarLeft,
  TbArrowBarRight,
  TbColumnInsertLeft,
  TbColumnInsertRight,
  TbColumnRemove
} from 'react-icons/tb'

interface ColumnMenuButtonProps {
  columnIndex: number
  columnHeaderKey: string
  /** Patch function from Sanity document operations for optimistic changes */
  patch: OperationsAPI['patch']
  value: RichTableType
  path: string
  rowCount: number
  columnCount: number
  iconHorizontal?: boolean
  readOnly: boolean | undefined
}
const ColumnContextMenu: ComponentType<ColumnMenuButtonProps> = (props) => {
  const {
    patch,
    columnIndex,
    columnHeaderKey,
    path,
    rowCount,
    columnCount,
    value,
    iconHorizontal,
    readOnly,
  } = props
  const columnHeaderPathString = `${path}.columnHeaders[_key=="${columnHeaderKey}"]`

  const handleDeleteColumn = useCallback(() => {
    const headerUnsetPatch: PatchOperations = {
      unset: [columnHeaderPathString],
    }
    const cellPathsToUnset = Array.from({ length: rowCount || 0 }, (_, i) => i).map(
      (rowIndex) => `${path}.rows[${rowIndex}].cells[${columnIndex}]`,
    )
    const cellUnsetPatches: PatchOperations = {
      unset: cellPathsToUnset,
    }

    return patch.execute([headerUnsetPatch, cellUnsetPatches])
  }, [rowCount, columnIndex, path, columnHeaderPathString, patch])

  const handleAddColumn = useCallback(
    (side: 'left' | 'right') => {
      const newColumnIndex = side === 'right' ? columnIndex + 1 : columnIndex
      const newColumnHeader: ColumnHeader & ObjectItem = {
        _type: 'columnHeader',
        cellIndex: newColumnIndex,
        _key: generateKey(),
      }

      // * Patch to add new column header
      const addHeaderPatch: PatchOperations =
        side === 'right'
          ? {
              insert: {
                after: columnHeaderPathString,
                items: [newColumnHeader],
              },
            }
          : {
              insert: {
                before: columnHeaderPathString,
                items: [newColumnHeader],
              },
            }

      const newCellsPaths = Array.from({ length: rowCount || 0 }, (_, i) => i).map((rowIndex) => {
        // Path to insert the new cell > before and after in patch will handle the rest
        return `${path}.rows[${rowIndex}].cells[${columnIndex}]`
      })

      // * Patches to add new cells in each row
      const addCellPatches = newCellsPaths.map((cellPath) => {
        const direction = side === 'right' ? 'after' : 'before'
        // Template cell item
        const newCellItemWithKey: RichTableCellType = {
          _type: 'richTableCell',
          _key: generateKey(),
          content: [
            {
              _type: 'block',
              _key: generateKey(),
              markDefs: [],
              children: [{ _type: 'span', text: '', marks: [] }],
            },
          ] as unknown as PortableTextBlock[],
        }
        return {
          insert: {
            [direction]: cellPath,
            items: [newCellItemWithKey],
          },
        }
      })

      // Patches to increase cellIndex of subsequent columns
      const columnHeaderIndexesToUpdate =
        side === 'right'
          ? // if col has been added after, we need to update all columns with index greater than the current one
            Array.from({ length: columnCount - (columnIndex + 1) }, (_, i) => i + columnIndex + 1)
          : // if col has been added before, we need to update all columns with index greater than or equal to the current one
            Array.from({ length: columnCount - columnIndex }, (_, i) => i + columnIndex)

      const cellIndexPatches = columnHeaderIndexesToUpdate.map((colHeaderIndex) => {
        const colHeaderPath = `${path}.columnHeaders[${colHeaderIndex}]`
        return {
          inc: {
            [`${colHeaderPath}.cellIndex`]: 1,
          },
        }
      })
      // first we move the cellIndexes of the existing columns to make space for the new column
      patch.execute(cellIndexPatches)

      // then we add the new column header and the new cells
      return patch.execute([addHeaderPatch, ...addCellPatches])
    },
    [columnCount, rowCount, columnIndex, path, columnHeaderPathString, patch],
  )

  // TODO: fix issue with cell index not being updated correctly when moving columns multiple times
  const handleMoveColumn = useCallback(
    (direction: 'left' | 'right') => {
      // First we store the current column header and cells (with their values) to temporary variables
      const headerToMove = value.columnHeaders?.[columnIndex]
      const headerToPatch = {
        ...headerToMove,
        cellIndex: direction === 'left' ? columnIndex - 1 : columnIndex + 1,
      }
      const cellsToMove = value.rows?.map((row) => ({
        rowKey: row._key,
        cell: row.cells?.[columnIndex],
      }))

      if (direction === 'left') {
        // * Calculate new column index
        const newColumnIndex = columnIndex - 1

        // * Prepare unset patches
        const headerPathToUnset = `${path}.columnHeaders[${columnIndex}]`
        const cellPathsToUnset = cellsToMove?.map(
          (row) => `${path}.rows[_key=="${row.rowKey}"].cells[${columnIndex}]`,
        )

        const unsetPatches: PatchOperations[] = [
          {
            unset: [...(cellPathsToUnset || []), headerPathToUnset],
          },
        ]

        // * Prepare inc patches for other columns
        const colHeaderPath = `${path}.columnHeaders[${columnIndex - 1}]`
        const incPatch: PatchOperations = {
          inc: {
            [`${colHeaderPath}.cellIndex`]: 1,
          },
        }

        // * Prepare insert patches
        const headerInsertPatch: PatchOperations = {
          insert: {
            before: `${path}.columnHeaders[${newColumnIndex}]`,
            items: [headerToPatch!],
          },
        }

        const cellInsertPatches: PatchOperations[] =
          cellsToMove?.map((row) => ({
            insert: {
              before: `${path}.rows[_key=="${row.rowKey}"].cells[${newColumnIndex}]`,
              items: [row.cell!],
            },
          })) || []

        // * Execute all patches in order (do not change order!)
        return patch.execute([...unsetPatches, incPatch, headerInsertPatch, ...cellInsertPatches])
      }
      if (direction === 'right') {
        // * Prepare unset patches
        const headerPathToUnset = `${path}.columnHeaders[${columnIndex}]`
        const cellPathsToUnset = cellsToMove?.map(
          (row) => `${path}.rows[_key=="${row.rowKey}"].cells[${columnIndex}]`,
        )

        const unsetPatches: PatchOperations[] = [
          {
            unset: [...(cellPathsToUnset || []), headerPathToUnset],
          },
        ]

        // * Prepare dec patches for other columns

        const decPatch: PatchOperations = {
          dec: {
            [`${path}.columnHeaders[${columnIndex}].cellIndex`]: 1,
          },
        }

        // * Prepare insert patches
        const headerInsertPatch: PatchOperations = {
          insert: {
            after: `${path}.columnHeaders[${columnIndex}]`,
            items: [headerToPatch!],
          },
        }

        const cellInsertPatches: PatchOperations[] =
          cellsToMove?.map((row) => ({
            insert: {
              after: `${path}.rows[_key=="${row.rowKey}"].cells[${columnIndex}]`,
              items: [row.cell!],
            },
          })) || []

        // * Execute all patches in order
        return patch.execute([...unsetPatches, decPatch, headerInsertPatch, ...cellInsertPatches])
      }
      return console.warn('Something went wrong, please check `handleMoveColumn` implementation')
    },
    [columnIndex, path, value, patch],
  )

  return (
    <MenuButton
      button={
        <Button
          icon={iconHorizontal ? EllipsisHorizontalIcon : EllipsisVerticalIcon}
          mode={'bleed'}
          padding={2}
        />
      }
      id="column-menu-button"
      menu={
        <Menu>
          <MenuItem
            text="Add column (left)"
            onClick={() => handleAddColumn('left')}
            disabled={readOnly}
            icon={TbColumnInsertLeft}
          />
          <MenuItem
            text="Add column (right)"
            onClick={() => handleAddColumn('right')}
            disabled={readOnly}
            icon={TbColumnInsertRight}
          />
          <MenuDivider />
          <MenuItem
            text="Move column (left)" //"Move column <-"
            onClick={() => handleMoveColumn('left')}
            disabled={readOnly || columnIndex === 0}
            icon={TbArrowBarLeft}
          />
          <MenuItem
            text="Move column (right)" // "Move column ->"
            onClick={() => handleMoveColumn('right')}
            disabled={readOnly || columnIndex - columnCount === -1}
            icon={TbArrowBarRight}
          />
          <MenuDivider />
          <MenuItem
            text="Remove column"
            onClick={handleDeleteColumn}
            disabled={readOnly}
            icon={TbColumnRemove}
          />
        </Menu>
      }
      popover={{ placement: 'right', portal: true }}
    />
  )
}
export default ColumnContextMenu
