import { RichTableType } from '../../rich-table/RichTableInput'
import { OperationsAPI, PortableTextBlock } from 'sanity'
import { PatchOperations } from '@sanity/types'
import { useCallback } from 'react'
import { RichTableCellType } from '../../../../schemaTypes/rich-table/cell.object'
import { ColumnHeader } from '../../../../schemaTypes/rich-table/columnHeader.object'
import { generateKey } from '../utils/generateKey'

interface UseAddColumnParams {
  /** Patch function from Sanity document operations for optimistic changes */
  patch: OperationsAPI['patch']
  /** Document ID in the Sanity dataset. */
  _id: string
  /** Path to the rich table inside the document. */
  path: string
  /** Current value of the rich table object */
  value: RichTableType
}

export function useAddColumn({ _id, path, value, patch }: UseAddColumnParams) {
  return useCallback(async () => {
    const colCount = value?.columnHeaders?.length || 0

    // Template for a new empty cell (no _key; Sanity will generate it)
    const newCellItem: RichTableCellType = {
      _type: 'richTableCell',
      _key: generateKey(),
      content: [
        { _type: 'block', markDefs: [], children: [{ _type: 'span', text: '', marks: [] }] },
      ] as unknown as PortableTextBlock[],
    }

    // New column header item (title uses current header count when available)
    const newColumnHeaderItem: ColumnHeader & { _key: string; _type: string } = {
      _type: 'columnHeader',
      _key: generateKey(),
      title: `New column ${colCount ? colCount + 1 : ''}`,
      cellIndex: colCount,
    }

    // Patches based on `patch` function
    const rowPatchEvents: PatchOperations[] =
      value.rows?.map((_, rowIndex) => {
        const rowCellPath = path + `.rows[${rowIndex}].cells[-1]`
        return {
          insert: {
            after: rowCellPath,
            items: [newCellItem],
          },
        } as PatchOperations
      }) ?? []
    const headerPatchEvent: PatchOperations = {
      insert: {
        after: path + `.columnHeaders[-1]`,
        items: [newColumnHeaderItem],
      },
    }
    patch.execute([...rowPatchEvents, headerPatchEvent])
  }, [_id, path, value])
}
