import { documentEventHandler } from '@sanity/functions'
import { createClient } from '@sanity/client'
import { getPublishedId } from '@sanity/id-utils'

export const handler = documentEventHandler(async ({ context, event }) => {
  const clientOptions = context.clientOptions
  const client = createClient({
    ...clientOptions,
    apiVersion: '2025-08-22',
    requestTagPrefix: 'recycling-bin',
    perspective: 'raw',
    useCdn: false,
  })
  const { data } = event
  if (!data || !data._id) {
    console.error('No data found.')
    return
  }
  console.group('::: DATA ::: ')
  console.dir(data, { depth: null })
  console.groupEnd()

  const { _id, _type, deletedAt, documentTitle, rev, deletedBy } = data
  const publishedId = getPublishedId(_id)
  // Check if this document was published
  const hasPublishedVersion = await client
    .request({
      method: 'GET',
      uri: `/data/doc/${process.env.SANITY_STUDIO_DATASET}/${publishedId}?includeAllVersions=true`,
    })
    .then((res) => {
      console.group('::: hasPublishedVersion docs ::: ')
      console.dir(res)
      console.groupEnd()
      // return false if both documents
      return res.documents.length > 0
    })
    .catch(console.error)

  if (hasPublishedVersion) {
    console.log(
      `Document has been deleted: ${data._id} but it has other existing versions: ${hasPublishedVersion}`,
    )
    return
  }

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
          revisionId: rev,
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
      .commit({ autoGenerateArrayKeys: true })
      .then((res) => {
        console.group('Recycling bin logs successfully updated')
        console.dir(res, { depth: null })
        console.groupEnd()
      })
      .catch(console.error)
  }
})
