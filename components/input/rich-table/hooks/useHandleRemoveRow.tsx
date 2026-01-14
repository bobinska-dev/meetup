import { useCallback } from 'react'
import { SanityClient } from '@sanity/client'
import { Path, pathToString } from 'sanity'

/**
 * Parameters for the `useHandleRemoveRow` hook.
 */
type UseHandleRemoveRowParams = {
  /** Sanity client instance for interacting with the database. */
  client: SanityClient
  /** Document ID in the Sanity dataset. */
  _id: string
  /** Path to the rich table in the document. */
  path: Path
}

/**
 * Custom hook to handle removing a row from a rich table in a Sanity document.
 *
 * @param {UseHandleRemoveRowParams} params - The parameters for the hook.
 * @returns {(rowKey: string) => Promise<any>} - A callback function to remove a row by its key.
 */
export default function useHandleRemoveRow({ client, _id, path }: UseHandleRemoveRowParams) {
  return useCallback(
    /**
     * Removes a row from the rich table.
     *
     * @param {string} rowKey - The unique key of the row to remove.
     * @returns {Promise<any>} - The result of the Sanity transaction.
     * @throws Will throw an error if the transaction fails.
     */
    async (rowKey: string) => {
      // Construct the path to the row to be removed.
      const rowToRemove = pathToString([...path, 'rows', { _key: rowKey }])
      return await client
        .patch(_id)
        .unset([rowToRemove])
        .commit()
        .then((res) => console.info('Row successfully removed', res))
        .catch((err) => console.error(err))
    },
    [_id, path],
  )
}
