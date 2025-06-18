import { TbGlobe, TbLanguage, TbMap2 } from 'react-icons/tb'
import { type StructureBuilder, type StructureResolverContext } from 'sanity/structure'
import { apiVersion } from '../../lib/api'

export const internationalisedPagesListItem = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  return S.listItem()
    .id('internationalisedPages')
    .title('Internationalised Pages')
    .icon(TbGlobe)
    .child(
      S.list()
        .title('Internationalised Pages')
        .items([
          // * * BY MARKETS
          S.listItem()
            .title('By markets')
            .icon(TbMap2)
            .child(
              S.documentTypeList('market')
                .title('Pages by Market')
                .child((marketId) =>
                  S.documentTypeList('page')
                    .apiVersion(apiVersion)
                    .filter(
                      '_type == "page" && language in *[_type == "market" && _id == $marketId].languages[]->code',
                    )
                    .params({ marketId }),
                ),
            ),

          // * * BY LANGUAGES
          S.listItem()
            .title('By language')
            .icon(TbLanguage)
            .child(
              S.documentTypeList('language')
                .title('Pages by language')
                .child((languageId) =>
                  S.documentTypeList('page')
                    .apiVersion(apiVersion)
                    .filter(
                      '_type == "page" && language == *[_type == "language" && _id == $languageId][0].code',
                    )
                    .params({ languageId }),
                ),
            ),
        ]),
    )
}
