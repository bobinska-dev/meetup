import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

export default defineBlueprint({
  blueprintVersion: '2025-06-01',
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
