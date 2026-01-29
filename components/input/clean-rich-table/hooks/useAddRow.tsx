import { RichTableType } from '../../rich-table/RichTableInput'
import { OperationsAPI, PortableTextBlock } from 'sanity'
import { useCallback } from 'react'
import { RichTableCellType } from '../../../../schemaTypes/rich-table/cell.object'
import { RichTableRowType } from '../../../../schemaTypes/rich-table/row.object'
import { generateKey } from '../utils/generateKey'

// Todo add row titles based on numbers
interface UseAddRowProps {
  /** Patch function from Sanity document operations for optimistic changes */
  patch: OperationsAPI['patch']
  /** Document ID in the Sanity dataset. */
  _id: string
  /** Path to the rich table in the document. */
  path: string
  /** Current value of the rich table object */
  value: RichTableType
}

export default function useAddRow({ _id, path, value, patch }: UseAddRowProps) {
  return useCallback(async () => {
    const colCount = value?.columnHeaders?.length || 0
    // Create an array of empty cells for the new row.
    const cells: RichTableCellType[] = Array.from({ length: colCount ?? 1 }, () => {
      return {
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
    })

    // const newRowTitle = `${value?.rows ? value.rows.length + 1 : 1}`
    // Define the new row with the generated cells.
    const newRow: RichTableRowType = {
      _type: 'row',
      _key: generateKey(),
      cells: cells,
    }
    // Use the patch function to optimistically add the new row.
    patch.execute([
      {
        insert: {
          after: path + `.rows[-1]`,
          items: [newRow],
        },
      },
    ])
  }, [_id, path, value])
}
