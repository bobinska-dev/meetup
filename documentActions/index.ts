import { DocumentActionComponent, DocumentActionsContext } from 'sanity'
import { createRebaseDraftPublishAction } from './createRebaseDraftPublishAction'

/** # custom document Actions settings
 *
 * This file is used to customize the document actions in the studio.
 */
export default (prev: DocumentActionComponent[], context: DocumentActionsContext) => {
  // * Add custom publish action to certain schema types
  if (['page'].includes(context.schemaType)) {
    return prev.map((originalAction) =>
      originalAction.action === 'publish'
        ? createRebaseDraftPublishAction(originalAction, context)
        : originalAction,
    )
  }

  // *  if those conditions are not met, return the original actions (sometimes called prev)
  return [
    ...prev.map(
      (originalAction) =>
        /*       originalAction.action === 'publish'
        ? createFirstPublishedAtAction(originalAction) 
        : */ originalAction,
    ),
  ]
}
