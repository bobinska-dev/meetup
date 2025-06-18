import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

export default defineBlueprint({
  // blueprintVersion
  resources: [
    defineDocumentFunction({
      name: 'updateLastPublishedAt',
      event: {
        on: ['publish'],
        filter: "_type == 'page'",
        projection: '_id',
      },
    }),
  ],
})
