import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

export default defineBlueprint({
  blueprintVersion: '2025-08-22',

  resources: [
    defineDocumentFunction({
      name: 'recyclingBin',
      event: {
        // This function is triggered when a document is deleted
        on: ['delete'],
        // we can include drafts but versions are not relevant here
        includeDrafts: true,
        includeAllVersions: false,
        // filter: '!(_type in path("sanity.**")) || !(_type in path("_**"))',
        filter: '_type in ["language", "listOption", "page"]',
        projection:
          '{ _id, _type, "rev": _rev, "deletedAt": now(), "deletedBy": identity(), "documentTitle": coalesce(title, name) }',
      },
    }),
    defineDocumentFunction({
      name: 'cleanUpBinLogs',
      event: {
        on: ['create'],
        includeDrafts: true,
        includeAllVersions: false,
        // filter: '!(_type in path("sanity.**")) || !(_type in path("_**"))',
        filter: '_type in ["language", "listOption", "page"]',
        projection: '{ _id }',
      },
    }),

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
