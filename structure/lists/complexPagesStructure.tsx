import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { homeListItem } from './homeListItem'

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
    .title('Pages')
    .child(
      S.list()
        .title('Pages')
        .menuItems(
          S.menuItemsFromInitialValueTemplateItems(
            languages?.map((language) =>
              S.initialValueTemplateItem('internationalised-page', {
                language: language.id,
              })
                .title(language.title + ' Page')
                .serialize({ path: ['pages', 'allPages'] }),
            ),
          ),
          /*           languages?.map((language) => {
            console.log(language)
            return (
              S.menuItem()
                .icon(
                  <Box>
                    <Text>{language.id.toLocaleUpperCase()}</Text>
                  </Box>,
                )
                .title(`${language.title} Page`)
                /*               .action({

              })
                .intent({
                  type: 'create',
                  params: {
                    type: 'page',
                    template: 'internationalised-page',
                    language: language.id,
                  },
                })
                .showAsAction(false)
                .serialize()
            )
          }),  */
        )
        .items([
          S.listItem()
            .title('All pages')
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
          // .initialValueTemplates([]),
          S.divider().title('Navigation settings'),
          // * Home
          await homeListItem(S, context),
        ]),
    )
}
