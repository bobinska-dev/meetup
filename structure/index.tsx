import { CogIcon, TrashIcon } from '@sanity/icons'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'

import { hiddenDocTypes } from './hiddenDocTypes'

/** # Structure Tool with Custom Structure list
 *
 * This is the custom structure tool for the studio.
 *
 * ## AI Assist context document type
 *
 * the `assist.instruction.context` document type is hidden here {@link hiddenDocTypes}
 *
 * (go to the Template Structure to work on those)
 */
export const structure = async (S: StructureBuilder, context: StructureResolverContext) => {
  return S.list()
    .title('Content')
    .items([
      S.divider(),
      // The rest of this document is from the original manual grouping
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      S.divider(),

      S.divider().title('Settings'),
      S.listItem()
        .title('List Options and i18n Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('List Options and i18n Settings')
            .items([
              S.documentTypeListItem('listOption').title('List Options'),
              S.divider(),
              S.documentTypeListItem('language').title('Languages'),
              S.documentTypeListItem('translation.metadata').title('Translation Metadata'),
            ]),
        ),
      // All singleton documents
      S.listItem()
        .title('Bin')
        .icon(TrashIcon)
        .child(
          S.editor()
            .id('deletedDocs.bin')
            .schemaType('deletedDocs.bin')
            .documentId('deletedDocs.bin'),
        ),
    ])
}
