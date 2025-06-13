/** # Hidden document types
 *
 * This is a list of all the document types that should be hidden from the auto-generated document type lists in the structure builder.
 *
 * This includes:
 *
 * - all the singletons imported from the `singletons` folder
 *
 * - the `assist.instruction.context` document type (go to the Template Structure to work on those)
 *
 *
 */
export const hiddenDocTypes = (listItem: any) =>
  ![
    'media.tag',
    'translation.metadata',
    // All Documents
    'page',

    // meta documents
    'assist.instruction.context',
    // All Singletons
    'settings',
  ].includes(listItem.getId())
