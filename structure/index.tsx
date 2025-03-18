import { CogIcon } from '@sanity/icons'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { hiddenDocTypes } from './hiddenDocTypes'
import { internationalisedPagesStructure } from './internationalisedPagesStructure'

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
export const customStructure = async (S: StructureBuilder, context: StructureResolverContext) => {
  return S.list()
    .title('Content')
    .items([
      S.listItem().title(`All Pages`).child(S.documentTypeList('page').title('Pages')),
      await internationalisedPagesStructure(S, context),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.documentTypeListItem('language').title('Languages'),
              S.documentTypeListItem('market').title('Markets'),
              S.documentTypeListItem('translation.metadata').title('Translation Metadata'),
              S.divider(),
              S.documentTypeListItem('listOption').title('List Options'),
              S.divider(),
            ]),
        ),
    ])
}
