import { documentEventHandler } from '@sanity/functions'
import { createClient } from '@sanity/client'

export const handler = documentEventHandler(async ({ context, event }) => {
  const clientOptions = context.clientOptions
  const client = createClient({
    ...clientOptions,
    apiVersion: '2025-08-22',
    requestTagPrefix: 'recycling-bin',
    perspective: 'published',
    useCdn: false,
  })
  const { data } = event
  if (!data || !data._id) {
    console.error('No data found.')
    return
  }
  const { _id, _type, deletedAt, documentTitle, _rev, deletedBy } = data
  const publishedId = _id.split('.')
  // Check if this document was published
  const hasPublishedVersion = await client
    .fetch(`count(*[_type == $type && _id == $id]._id) > 0`, {
      type: data._type,
      id: publishedId[publishedId.length - 1],
    })
    .catch(console.error)
  console.dir(data, { depth: null })

  if (!hasPublishedVersion) {
    const idLogPatch = client
      .patch('deletedDocs.bin')
      .setIfMissing({ deletedDocIds: [] })
      .insert('before', 'deletedDocIds[0]', [_id])

    const logPatch = client
      .patch('deletedDocs.bin')
      .setIfMissing({ deletedDocLogs: [] })
      .insert('before', 'deletedDocLogs[0]', [
        {
          docId: _id,
          deletedAt,
          type: _type,
          documentTitle,
          _key: _rev,
          deletedBy,
          _type: 'log',
        },
      ])
    await client
      .transaction()
      .createIfNotExists({
        _id: 'deletedDocs.bin',
        _type: 'deletedDocs.bin',
        title: 'Bin: Deleted Document Logs',
      })
      .patch(idLogPatch)
      .patch(logPatch)
      .commit()
      .then((res) => console.dir('logs successfully updated', res))
      .catch(console.error)
  }

  console.log(`Document has been deleted: ${data._id} but it was published: ${hasPublishedVersion}`)
})
