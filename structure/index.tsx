import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { hiddenDocTypes } from './hiddenDocTypes'
import { complexPagesStructure } from './lists/complexPagesStructure'
import { defaultXbyYStructure } from './lists/defaultXbyYStructure'
import { recursiveNestedStructure } from './lists/recursiveNestedStructure'
import { singletonListItems } from './lists/singletonStructure'

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
      defaultXbyYStructure(S),
      S.divider().title('Pages'),
      await complexPagesStructure(S, context),

      recursiveNestedStructure(S, context),
      S.divider().title('All Documents'),
      // The rest of this document is from the original manual grouping in this series of articles
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      S.divider().title('Singleton Documents'),
      ...singletonListItems(S),
    ])
}
