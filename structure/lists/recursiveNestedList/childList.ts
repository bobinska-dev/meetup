import type { SanityDocument } from '@sanity/client'
import { TbDirections, TbSignRight } from 'react-icons/tb'
import { map } from 'rxjs/operators'
import { DocumentStore } from 'sanity'
import type { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { createChildDraftMenuItem } from './createChildDraftMenuItem'
import { detailDocListItem } from './detailDocListItem'
import { queryChildren } from './queries'

/** `childPages` will fetch and listen to child pages on the parent document */
export const childList = ({
  parent,
  documentStore,
  context,
  S,
  type,
}: {
  documentStore: DocumentStore
  context: StructureResolverContext
  parent: SanityDocument
  S: StructureBuilder
  /** the schema type name for both parent and children */
  type: string
}) => {
  const details = detailDocListItem(S, parent, TbSignRight)

  return S.documentListItem()
    .schemaType(parent._type || type)
    .id(parent._id)
    .icon(TbDirections)
    .child(() => {
      const childPages$ = queryChildren({ documentStore, context, S, type, parentId: parent._id })
      return childPages$.pipe(
        map((childPages) => {
          return S.list()
            .title(`Parent & Children - "${parent.title}"`)
            .items([
              details,
              S.divider().title('Children'),
              ...(Array.isArray(childPages) ? childPages : [childPages]),
            ])
            .canHandleIntent(
              (intentName, params) => (intentName === 'create' || 'edit') && params.type === type,
            )
            .menuItems([
              createChildDraftMenuItem({
                S,
                context,
                parent,
                type,
              }),
            ])
        }),
      )
    })
}
