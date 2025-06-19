import { TbDirections, TbEdit, TbSignRight } from 'react-icons/tb'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { apiVersion } from '../../lib/api'
import { MenuItem } from '../../sanity.types'

/** ## Pages according to their appearance in the menu array defined in Site Settings */
export const navPagesList = (S: StructureBuilder, context: StructureResolverContext) => {
  // * Fetch the client
  const client = context.getClient({ apiVersion }).withConfig({ perspective: 'previewDrafts' })

  return S.listItem()
    .id('menuPages')
    .title('Pages in menu')
    .icon(TbDirections)
    .child(async () => {
      // * Fetch menu Items
      const pageMenuItems = await client
        .fetch(
          // make sure you don't overfetch -> only return the value that you need and name it appropriately
          `*[_id == 'settings'][0].menu`,
        )
        .catch(console.error)
        .then((res) => res)
      const pageItems = pageMenuItems?.map((menuItem: MenuItem & { _key: string }) => {
        // * Check if the menu item is nested return a list item with a child list
        const isNested = menuItem.isNested
        if (isNested) {
          return S.listItem()
            .id(menuItem._key)
            .title(menuItem.title)
            .icon(TbDirections)

            .child(
              S.list()
                .title(menuItem.title)
                .id(menuItem._key)
                .items(
                  menuItem.menuItems?.map((nestedMenuItem: MenuItem & { _key: string }) => {
                    return S.documentListItem()
                      .id(nestedMenuItem.link?._ref!)
                      .schemaType('page')
                      .title(nestedMenuItem.title)
                      .icon(TbSignRight)
                      .child(
                        S.document()
                          .id(nestedMenuItem.link?._ref!)
                          .schemaType('page')
                          .documentId(nestedMenuItem.link?._ref!),
                      )
                  }) || [],
                ),
            )
        }
        // *  If the menu item is not nested return a list item which opens the document in question
        return S.listItem()
          .id(menuItem.link?._ref!)
          .title(menuItem.title)
          .icon(TbSignRight)
          .child(
            S.document()
              .id(menuItem.link?._ref!)
              .schemaType('page')
              .documentId(menuItem.link?._ref!),
          )
      })
      return S.list()
        .title('Pages in menu')
        .items([
          ...pageItems,
          S.divider().title('Edit menu'),
          S.documentListItem({ id: 'settings', schemaType: 'settings' }),
        ])
        .menuItems([
          S.menuItem()
            .title('Edit menu in settings')
            .icon(TbEdit)
            .showAsAction()
            .intent({
              type: 'edit',
              params: {
                id: 'settings',
                type: 'settings',
                path: 'menu',
              },
            }),
        ])
        .canHandleIntent(
          (intentName, params) =>
            (intentName === 'edit' &&
              params.id === 'settings' &&
              params.type === 'settings' &&
              params.path === 'menu') ||
            (intentName === 'edit' && params.type === 'page'),
        )
    })
}
