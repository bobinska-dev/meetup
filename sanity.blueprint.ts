import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

export default defineBlueprint({
  blueprintVersion: '2026-01-01',

  resources: [
    defineDocumentFunction({
      name: 'recyclingBin',
      type: 'sanity.function.document',
      src: './functions/recyclingBin',
      event: {
        // This function is triggered when a document is deleted
        on: ['delete'],
        // we can include drafts but versions are not relevant here
        includeDrafts: true,
        includeAllVersions: false,
        filter: '_type in ["language", "listOption", "page"]',
        projection:
          '{ _id, _type, "rev": _rev, "deletedAt": now(), "deletedBy": identity(), "documentTitle": coalesce(title, name) }',
      },
    }),
    defineDocumentFunction({
      name: 'cleanUpBinLogs',
      type: 'sanity.function.document',
      src: './functions/cleanUpBinLogs',
      event: {
        on: ['create'],
        includeDrafts: true,
        includeAllVersions: false,
        filter: '_type in ["language", "listOption", "page"]',
        projection: '{ _id }',
      },
    }),

    defineDocumentFunction({
      name: 'updateLastPublishedAt',
      type: 'sanity.function.document',
      src: './functions/updateLastPublishedAt',
      event: {
        on: ['publish'],
        filter: "_type == 'page'",
        projection: '{ _id }',
      },
    }),
  ],
})
