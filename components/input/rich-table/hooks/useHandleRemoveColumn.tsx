// components/input/rich-table/hooks/useHandleRemoveColumn.tsx
import { useCallback } from 'react'
import type { SanityClient } from '@sanity/client'
import { Path, pathToString } from 'sanity'
import { RichTableRowType } from '../../../../schemaTypes/rich-table/row.object'

/**
 * Parameters for the `useHandleRemoveColumn` hook.
 */
interface UseHandleRemoveColumnParams {
  /** Sanity client instance for performing patches/transactions. */
  client: SanityClient
  /** Document ID in the Sanity dataset. */
  _id: string
  /** Path to the rich table inside the document. */
  path: Path
  /** Current rows value from the editor (may be undefined or null). */
  value: RichTableRowType[] | undefined
}

/**
 * Custom hook returning a callback that removes a column (by index) from a rich table.
 *
 * Behavior:
 * - Builds the Sanity paths for each cell in the given column index.
 * - Creates `unset` patches for existing cells in that column.
 * - Executes a single Sanity transaction to unset all targeted cell entries.
 *
 * @param params - Hook parameters (client, document id, path, current rows).
 * @returns A stable callback `(columnIndex: number) => Promise<any>` that removes the column when called.
 */
export default function useHandleRemoveColumn({
  client,
  _id,
  path,
  value,
}: UseHandleRemoveColumnParams) {
  return useCallback(
    async (columnIndex: number) => {
      // Map rows to full paths for the cell at `columnIndex`, or undefined if missing
      const cellPathsToRemove = value?.map((row) => {
        return row.cells && row.cells[columnIndex]
          ? pathToString([
              ...path,
              'rows',
              { _key: row._key },
              'cells',
              { _key: row.cells[columnIndex]._key },
            ])
          : undefined
      })

      if (!cellPathsToRemove) {
        console.error('No cells in column to remove')
        return
      }

      // Build unset patches only for existing paths
      const unsetPatches = cellPathsToRemove
        .map((cellPath) => {
          if (cellPath) {
            return client.patch(_id).unset([cellPath])
          }
          return null
        })
        .filter((patch) => patch !== null) as ReturnType<typeof client.patch>[]

      if (unsetPatches.length === 0) {
        console.error('No valid cell paths found to unset')
        return
      }

      // Add all unset patches to a single transaction and commit
      const transaction = client.transaction()
      unsetPatches.forEach((patch) => transaction.patch(patch))

      return await transaction
        .commit()
        .then((res) => console.info('Column successfully removed', res))
        .catch((err) => console.error(err))
    },
    [_id, path, value],
  )
}
