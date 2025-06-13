import { createClient } from '@sanity/client'
import { documentEventHandler } from '@sanity/functions'
// SANITY_STUDIO_DATASET="structure-showroom" npx sanity functions test updateLastPublishedAt --data '{ "_id": "12345", "_type": "page"}'

export const handler = documentEventHandler(async ({ context, event }) => {
  const time = new Date().toISOString()

  console.log('::event::', event)

  const client = createClient({
    ...context.clientOptions,
    apiVersion: '2025-05-01',
    useCdn: false,
  })
  const { _id } = event.data || {}

  try {
    await client
      .patch(_id, {
        setIfMissing: {
          firstPublishedAt: time,
        },
        set: {
          lastPublishedAt: time,
        },
      })
      .commit({ dryRun: false })
      .then((res) => console.log('Last published at updated:', res))
  } catch (error) {
    console.error(error)
  }
})
