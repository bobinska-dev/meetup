import { Stack } from '@sanity/ui'
import groq from 'groq'
import { ComponentType, useEffect, useState } from 'react'
import { ArrayOfObjectsInputProps, useClient, useFormValue } from 'sanity'

import { apiVersion } from '../../lib/api'
import { LogItem } from '../../schemaTypes/singletons/deletedDocBinDocument'

/** ### Array Input Component with Button to clean up the log
 *
 * removes restored documents from the logs array
 */
export const DeletionLogInputComponent: ComponentType<ArrayOfObjectsInputProps> = (props) => {
  // * Get the client
  const client = useClient({ apiVersion }).withConfig({
    perspective: 'drafts',
  })

  // * Get Ids and filter unique values
  /** Ids from `props.value` which are also filtered to only return unique IDs */
  const ids = (props.value as LogItem[] | undefined)
    ?.map((item) => item.docId)
    .filter((value, index, self) => self.indexOf(value) === index)

  // * Get the document ID
  /** ID of current `deletedDocIdsDocument` */
  const documentID = useFormValue(['_id']) as string

  // * Set the logs state which will be set by a query
  // that fetches all document ids that are in the logs and check if they exist
  const [logs, setLogs] = useState<string[]>([])
  const query = groq`*[_id in $docIds]._id`
  const params = { docIds: ids }

  // * Create an array of items to unset for documents that were restored
  const itemsToUnset = logs?.map((item) => `deletedDocLogs[docId == "${item}"]`)

  // * This will clean up the logs array by removing the documents that were restored
  // a unaltered log of all published documents that were deleted at some point are in the `deletedDocIds` array
  useEffect(() => {
    // * Run the function only when there is a value and a documentID
    props.value &&
      documentID &&
      client
        .fetch(query, params)
        .then((res) => {
          setLogs(res)
          res.length > 0 &&
            console.log(
              `The log items with the following IDs were restored and are removed from the array: ${res.join(', ')}`,
            )
        })
        .catch((err) => {
          console.error(err.message)
        })
    logs.length > 0 && client.patch(documentID).unset(itemsToUnset).commit().catch(console.error)
  }, [props.value, documentID])

  return (
    <>
      <Stack space={4}>
        {/* Remove the Add Item button below the Array input */}
        {props.renderDefault({ ...props, arrayFunctions: () => null })}
      </Stack>
    </>
  )
}
