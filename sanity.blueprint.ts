import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

export default defineBlueprint({
  blueprintVersion: '2025-08-22',

  resources: [
    defineDocumentFunction({
      name: 'recyclingBin',
      event: {
        // This function is triggered when a document is deleted
        on: ['delete'],
        // we can include drafts and all versions of the document ->
        includeDrafts: true,
        includeAllVersions: true,
        // filter: '!(_type in path("sanity.**")) || !(_type in path("_**"))',
        filter: '_type in ["language", "listOption", "page"]',
        projection:
          '{ _id, _type, _rev, "deletedAt": now(), "deletedBy": identity(), "documentTitle": coalesce(title, name) }',
      },
    }),
  ],
})
