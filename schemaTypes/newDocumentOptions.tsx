import { NewDocumentCreationContext, TemplateItem } from 'sanity'

/** # custom newDocumentOptions settings
 *
 * This file is used to customize the new document options in the studio.
 *
 */
export const newDocumentSettings = (
  prev: TemplateItem[],
  creationContext: NewDocumentCreationContext,
) => {
  /* if (creationContext.type === 'global') {
    return prev.filter(
      (templateItem) => !hiddenTypesFromGlobalCreation.includes(templateItem.templateId),
    )
  } */
  /* if (creationContext.type === 'structure') {
    return prev.filter(
      (templateItem) => !hiddenTypesFromGlobalCreation.includes(templateItem.templateId),
    )
  } */

  return prev
}
