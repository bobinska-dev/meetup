import { RichTableType } from '../../rich-table/RichTableInput'
import { PortableTextBlock, SanityClient } from 'sanity'
import { useCallback } from 'react'
import { RichTableCellType } from '../../../../schemaTypes/rich-table/cell.object'
import { ColumnHeader } from '../../../../schemaTypes/rich-table/columnHeader.object'

interface UseAddColumnParams {
  /** Sanity client instance for performing patches/transactions. */
  client: SanityClient
  /** Document ID in the Sanity dataset. */
  _id: string
  /** Path to the rich table inside the document. */
  path: string
  /** Current value of the rich table object */
  value: RichTableType
}

/** # Custom hook returning a callback that appends a new column to a rich table.
 *
 * @param client - Sanity client instance for performing patches/transactions.
 * @param _id - Document ID in the Sanity dataset.
 * @param path - Path string to the rich table inside the document.
 * @param value - Current value of the rich table object.
 */
export default function useAddColumn({ client, _id, path, value }: UseAddColumnParams) {
  return useCallback(async () => {
    const colCount = value?.columnHeaders?.length || 0
    const rowCount = value?.rows?.length || 0

    // Template for a new empty cell (no _key; Sanity will generate it)
    const newCellItem: Omit<RichTableCellType, '_key'> = {
      _type: 'richTableCell',
      content: [
        { _type: 'block', markDefs: [], children: [{ _type: 'span', text: '', marks: [] }] },
      ] as unknown as PortableTextBlock[],
    }

    // New column header item (title uses current header count when available)
    const newColumnHeaderItem: ColumnHeader & { _type: string } = {
      _type: 'columnHeader',
      title: `New column ${colCount ? colCount + 1 : ''}`,
      cellIndex: colCount ? colCount - 1 : 0,
    }

    const transaction = client.transaction()
    // For each existing row, append a new cell
    value.rows?.forEach((_, rowIndex) => {
      const rowCellPath = path + `.rows[${rowIndex}].cells`
      const newCellPatch = client.patch(_id).append(rowCellPath, [newCellItem])
      // Add the new cell to the transaction
      transaction.patch(newCellPatch)
    })
    // Append the column header
    const headerPath = path + `.columnHeaders`
    const addColumnToHeadersPatch = client.patch(_id).append(headerPath, [newColumnHeaderItem])

    transaction.patch(addColumnToHeadersPatch)

    return await transaction
      .commit({ autoGenerateArrayKeys: true })
      .then((res) => console.info('Column successfully added', res))
      .catch((err) => console.error(err))
  }, [_id, path, value])
}
