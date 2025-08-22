// schemas/singletons/deletedDocBinDocument.ts
import { TrashIcon } from '@sanity/icons'
import {
  ArrayOfPrimitivesInputProps,
  defineArrayMember,
  defineField,
  defineType,
  ObjectItem,
  ObjectItemProps,
} from 'sanity'
import { DeletedDocIdInputComponent } from '../../components/recycling-bin/DeletedDocIdInputComponent'
import { DeletionLogInputComponent } from '../../components/recycling-bin/DeletionLogInputComponent'
import { DeletionLogItemComponent } from '../../components/recycling-bin/DeletionLogItemComponent'
import { ComponentType } from 'react'

// import ObjectItem from sanity

export interface LogItem extends ObjectItem {
  docId: string
  deletedAt: string
  type: string
  documentTitle: string | 'Unknown 🥲'
  deletedBy?: string
  revisionId: string
}

export default defineType({
  // We use a dot in the _id to make sure this is a private document which cannot be read unless you are authenticated. We chose to do the same in the type name as a personal naming choice.
  name: 'deletedDocs.bin',
  title: 'Bin: Deleted Document Log',
  type: 'document',
  icon: TrashIcon,
  // we want to skip a draft version of this document, so we set this 👇
  liveEdit: true,
  // Fieldset to "hide away" the deletedDocIds array from view unless we need them
  fieldsets: [
    {
      name: 'deletedDocIdLogs',
      title: 'All Deleted Doc Id Logs',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    // * Main log for restoring documents
    defineField({
      name: 'deletedDocLogs',
      title: 'Deleted Doc Logs',
      type: 'array',
      readOnly: true,
      options: {
        sortable: false,
      },
      description:
        'Log of deleted documents. If you restore a published document with a draft, the most recent draft version will be restored, but the published document is still available its history.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'log',
          title: 'Log',
          readOnly: true,
          fields: [
            defineField({
              name: 'docId',
              title: 'Doc Id',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'deletedAt',
              title: 'Deleted At',
              type: 'datetime',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
            }),
            defineField({
              name: 'documentTitle',
              title: 'Document Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'deletedBy',
              title: 'Deleted By',
              type: 'string',
            }),
            defineField({
              name: 'revisionId',
              title: 'Revision Id',
              type: 'string',
            }),
          ],
          components: {
            item: DeletionLogItemComponent as unknown as ComponentType<ObjectItemProps>,
          },
        }),
      ],
      components: {
        input: DeletionLogInputComponent,
      },
    }),
    // Backup of all deleted doc ids
    defineField({
      name: 'deletedDocIds',
      title: 'Deleted Doc Ids',
      type: 'array',
      components: {
        /* Remove the `Add Item` button below the Array input  */
        input: (props: ArrayOfPrimitivesInputProps) =>
          props.renderDefault({ ...props, arrayFunctions: () => null }),
      },
      readOnly: true,
      options: {
        sortable: false,
      },
      fieldset: 'deletedDocIdLogs',
      of: [
        // TODO: figure out if object with release ids is better suited now.
        defineArrayMember({
          name: 'deletedDocId',
          type: 'string',
          readOnly: true,
          validation: (Rule) => Rule.required(),
          components: {
            input: DeletedDocIdInputComponent,
          },
        }),
      ],
    }),
    // title for the document (will be set during creation via CLI)
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: true,
    }),
  ],
})
