import { TbBrowser } from 'react-icons/tb'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { homeListItem } from './homeListItem'
import { internationalisedPagesListItem } from './iternationalisedPagesListItem'
import { navPagesList } from './navPagesList'

export const complexPagesStructure = async (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const client = context
    .getClient({ apiVersion: '2024-01-29' })
    .withConfig({ perspective: 'previewDrafts' })
  // * Fetch all languages
  const languages: { id: string; title: string }[] = await client
    .fetch(`*[_type == 'language']{ 'id': code, title }`)
    .then((data) => data)
    .catch(console.error)

  return S.listItem()
    .title('Pages with bling')
    .icon(TbBrowser)
    .child(
      S.list()
        .title('Pages')
        .menuItems(
          /* this adds the initial value templates for each language */
          S.menuItemsFromInitialValueTemplateItems(
            languages?.map((language) =>
              S.initialValueTemplateItem('internationalised-page', {
                language: language.id,
              })
                .title(language.title + ' Page')
                .serialize(),
            ),
          ),
        )
        .items([
          S.listItem()
            .title('All pages')
            .icon(TbBrowser)
            .child(
              S.documentTypeList('page')
                .title('All Pages')
                .id('complexPagesStructure-allPages')
                .menuItems(
                  S.menuItemsFromInitialValueTemplateItems(
                    languages?.map((language) =>
                      S.initialValueTemplateItem('internationalised-page', {
                        language: language.id,
                      })
                        .title(language.title + ' Page')
                        .serialize(),
                    ),
                  ),
                ),
            ),

          S.divider().title('Page structure in settings'),
          // * Home
          await homeListItem(S, context),
          // * Pages in Menu
          navPagesList(S, context),
          S.divider().title('Internationalised Pages'),
          internationalisedPagesListItem(S, context),
        ]),
    )
}
