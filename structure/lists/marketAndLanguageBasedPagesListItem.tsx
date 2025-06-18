// what we want is a list of pages based on markets, but the pages are ordered by language and have a language divider

import groq from 'groq'
import { TbMap2 } from 'react-icons/tb'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { apiVersion } from '../../lib/api'

export const marketAndLanguageBasedPagesListItem = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  // * documentStore is used to listen and rerender to changes
  const { documentStore } = context

  return S.listItem()
    .id('marketAndLanguageBasedPages')
    .title('Pages for each market')
    .icon(TbMap2)
    .child(
      S.documentTypeList('market')
        .title('Pages by Market')
        .child((marketId) => {
          const query = groq`*[ _type == 'market' && _id == $marketId ]{
            _id,
            title,
            languages[]->{
              code,
              title,
              isDefault
            },
            "pages": *[_type == 'page' && language in ^.languages[].code] | order(language asc) {
              _id,
              title,
              language
            }
          }`
          const queryMarketPages = () => {
            return documentStore.listenQuery(
              query,
              { marketId },
              {
                tag: 'observable-structure-pages',
                apiVersion,
              },
            )
          }
          // this is a rxjs observable variable
          const $marketWithPages = queryMarketPages()

          return S.list()
            .title('Pages by Market')
            .items([S.documentListItem().schemaType('market').id(marketId)])
        }),
    )
}
