/**
 * This plugin contains all the logic for setting up the singletons
 */

import {
  DocumentActionComponent,
  DocumentActionsContext,
  NewDocumentOptionsContext,
  TemplateItem,
} from 'sanity'

export const singletonPlugin = (types: string[]) => {
  return {
    name: 'singletonPlugin',
    document: {
      // Hide 'Singletons (such as Home)' from new document options
      // https://user-images.githubusercontent.com/81981/195728798-e0c6cf7e-d442-4e58-af3a-8cd99d7fcc28.png
      newDocumentOptions: (
        prev: TemplateItem[],
        { creationContext }: NewDocumentOptionsContext,
      ) => {
        if (creationContext.type === 'global') {
          return prev.filter((templateItem) => !types.includes(templateItem.templateId))
        }
        if (creationContext.type === 'structure') {
          return prev.filter((templateItem) => !types.includes(templateItem.templateId))
        }
        return prev
      },
      // Removes the "duplicate" action on the Singletons (such as the recycling bin document)
      actions: (prev: DocumentActionComponent[], { schemaType }: DocumentActionsContext) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }) => action !== 'duplicate' || 'delete')
        }

        return prev
      },
    },
  }
}
