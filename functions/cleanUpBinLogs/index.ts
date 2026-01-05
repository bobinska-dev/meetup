import { documentEventHandler } from '@sanity/functions'
import { createClient } from '@sanity/client'
import { getPublishedId, isDraftId } from '@sanity/id-utils'

export const handler = documentEventHandler(async ({ context, event }) => {
  const clientOptions = context.clientOptions
  const client = createClient({
    ...clientOptions,
    apiVersion: '2026-01-01',
    requestTagPrefix: 'recycling-bin-cleanup',
    perspective: 'published',
    useCdn: false,
  })
  const { data } = event
  if (!data || !data._id) {
    console.error('No data found. Cannot clean up bin logs.')
    return
  }

  const { _id } = data

  const isDraft = isDraftId(_id)
  const publishedId = getPublishedId(_id)
  // Check if this document was published
  const restoredItemKeys = await client
    .fetch(
      `*[_type == "deletedDocs.bin" && _id == 'deletedDocs.bin'][0].deletedDocLogs[docId in $createdDocIds]._key`,
      { createdDocIds: isDraft ? [_id, publishedId] : [_id] },
    )
    .catch(console.error)

  if (!restoredItemKeys) {
    console.log('No logs exist for:', _id)
    return
  }
  // Clean up the bin logs by removing the document item
  const itemsToUnset = restoredItemKeys.map((key: string) => `deletedDocLogs[_key == "${key}"]`)
  await client
    .patch('deletedDocs.bin')
    .unset(itemsToUnset)
    .commit({ dryRun: false }) // IMPORTANT: Set dryRun to true when testing your function locally!
    .then((res) => {
      console.log(`Cleaned up bin logs for document: ${_id}`)
      console.dir(res)
    })
    .catch((err) => {
      console.error('Error cleaning up bin logs:', err)
    })
})
