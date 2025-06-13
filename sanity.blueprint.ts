import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

export default defineBlueprint({
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
