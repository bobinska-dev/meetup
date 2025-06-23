import type { SanityDocument } from '@sanity/client'
import { TbDirections, TbSignRight } from 'react-icons/tb'
import { map } from 'rxjs/operators'
import type { ListBuilder, StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { createChildDraftMenuItem } from './createChildDraftMenuItem'
import { detailDocListItem } from './detailDocListItem'
import { queryChildren, queryParents } from './queries'

const type = 'page' // needed for more than the params! (see below)

// * * * recursiveNestedStructure * * *
/** ## Recursive parent-child structure
 *
 * This structure will display a recursive list of parents with their children
 *
 * It is based on a parent-child relationship between documents of one type, and uses an observable to fetch and update the children
 *
 * ### Note: This will *not allow* you to add new documents within this structure
 *
 * ### Not very performant, but useful for small to medium sized sites
 *
 * If you need a more performant solution, consider using a similar structure to `navPagesList`, which uses a menu array defined in Site Settings.
 *
 */
export const recursiveNestedStructure = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const { documentStore } = context

  return S.listItem()
    .title('Recursive parent-child structure')

    .child(() => {
      const parents$ = queryParents({ documentStore, S, type })

      return parents$.pipe(
        map<SanityDocument[], ListBuilder>((documents) => {
          return S.list()
            .title('Parents')

            .items(
              documents.map((parent) => {
                const details = detailDocListItem(S, parent, TbSignRight)
                const children = parent.children

                return children
                  ? S.documentListItem()
                      .schemaType(parent._type || type)
                      .icon(TbDirections)
                      .id(parent._id)
                      .child(() => {
                        const childPages$ = queryChildren({
                          documentStore,
                          S,
                          context,
                          parentId: parent._id,
                          type,
                        })

                        return childPages$.pipe(
                          map((childPages) => {
                            return S.list()
                              .title(`Parent & Children - "${parent.title}"`)
                              .canHandleIntent(
                                (intentName, params) =>
                                  intentName === 'edit' && params.type === 'page',
                              )
                              .items([
                                details,
                                S.divider().title('Children'),
                                ...(Array.isArray(childPages) ? childPages : [childPages]),
                              ])
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
                  : details
              }),
            )
        }),
      )
    })
}
