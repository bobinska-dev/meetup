import { TbSitemap } from 'react-icons/tb'
import { StructureBuilder } from 'sanity/structure'
import { apiVersion } from '../../lib/api'

export const defaultXbyYStructure = (S: StructureBuilder) =>
  S.listItem()
    .id('defaultXbyYStructure')
    .title('Default X-by-Y Structure (Parents and Children)')
    .icon(TbSitemap)
    .child(
      S.documentTypeList('page')
        .title('Parents')
        .id('defaultXbyYStructure-parents')
        .filter('_type == "page" && !defined(parent._ref)')
        .apiVersion(apiVersion)
        .canHandleIntent((intentName, params) => intentName === 'edit' && params.type === 'page')
        .child((parentId) =>
          S.documentTypeList('page')
            .id(`defaultXbyYStructure-children-${parentId}`)
            .title('Children')
            .filter('_type == "page" && parent._ref == $parentId')
            .apiVersion(apiVersion)
            .params({ parentId })
            .initialValueTemplates([
              S.initialValueTemplateItem('parentPageTemplate', {
                parentId,
              }),
            ]),
        ),
    )
