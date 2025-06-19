import type { SanityDocument } from '@sanity/client'
import groq from 'groq'
import { ComponentType, ReactNode } from 'react'
import { TbDirections, TbSignRight } from 'react-icons/tb'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DocumentStore, Id, ListenQueryOptions } from 'sanity'
import type {
  Divider,
  ListBuilder,
  ListItem,
  ListItemBuilder,
  StructureBuilder,
  StructureResolverContext,
} from 'sanity/structure'
import { apiVersion } from '../../lib/api'

const type = 'page' // needed for more than the params! (see below)

// * * * fetch child pages * * *
export function queryChildPages({
  documentStore,
  pageId,
  S,
}: {
  documentStore: DocumentStore
  pageId: Id
  S: StructureBuilder
}): Observable<ListItemBuilder | ListItem | Divider> {
  // unfortunately the documentStore does not use perspectives as of now, so we need to coalesce
  const query = groq`*[_type == $type && references($pageId)]{
          _id, title, "slug": slug.current, _type,
          count(*[_type == $type && references(^._id)]) > 0 => {
            "children": count(*[_type == $type && references(^._id)]) > 0
          }
        }
  `

  return documentStore
    .listenQuery(
      query,
      { pageId, type },
      {
        apiVersion: '2025-05-31',
        tag: `pages-child-pages-${pageId}`,
        perspective: 'drafts',
      },
    )
    .pipe(
      map<SanityDocument[], any>((documents) =>
        Array.isArray(documents)
          ? documents.map((doc) => {
              const details = detailDocListItem(S, doc, TbSignRight)
              const children = doc.children

              return children ? childPages({ documentStore, page: doc, S }) : details
            })
          : [],
      ),
    )
}

// * * * child pages * * *
/** `childPages` will fetch and listen to child pages on the parent document */
export const childPages = ({
  page,
  documentStore,
  S,
}: {
  documentStore: DocumentStore
  page: SanityDocument
  S: StructureBuilder
}) => {
  const details = detailDocListItem(S, page, TbSignRight)

  return S.listItem()
    .title(page.title || '')
    .icon(TbDirections)
    .child(() => {
      const childPages$ = queryChildPages({ documentStore, pageId: page._id, S })
      return childPages$.pipe(
        map((childPages) => {
          return S.list()
            .title(`Child pages - "${page.title}"`)
            .items([
              details,
              S.divider(),
              ...(Array.isArray(childPages) ? childPages : [childPages]),
            ])
        }),
      )
    })
}

// * * * detailDocListItem * * *
/** This will render out the parent as a document list item  */
export const detailDocListItem = (
  S: StructureBuilder,
  page: SanityDocument,
  icon?: ComponentType<{}> | ReactNode,
) =>
  S.listItem()
    .title(`Page: ${page.title}`)
    .icon(icon || TbSignRight)
    .child(
      // * You can also opt into using a documentListItem instead, if you prefer unnested pages to be displayed with your own preview config
      //S.documentListItem().id(page._id).schemaType(type).icon(TbSignRight)
      S.document()
        .schemaType(page._type)
        .documentId(page?._id || ''),
    )

// * * * recursiveNestedStructure * * *
/** ## Recursive parent-child structure
 *
 * This structure will display a list of pages with their children
 *
 * It is based on a parent-child relationship between documents of a type, and uses an observable to fetch and update the children
 *
 * ### Note: This will *not allow* you to add new documents within this structure
 */
export const recursiveNestedStructure = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const { documentStore } = context

  // add default sorting here
  const parentQuery = groq` *[_type == $type && !defined(parent)]{
          _id, title, "slug": slug.current, _type,

          count(*[_type == $type && references(^._id)]) > 0 => {
            "children": *[_type == $type && references(^._id)]{ 
              _id, title, "slug": slug.current, _type,
              "hasChildren": count(*[_type == $type && references(^._id)]) > 0 
            }
          }
        }`

  const params = { type: type }
  const options = {
    apiVersion,
    perspective: 'drafts',
    includeResult: true,
    tag: `parent-structure-${type}`,
  } as ListenQueryOptions

  return S.listItem()
    .title('Recursive nested Structure')

    .child(() => {
      const parents$ = documentStore.listenQuery(parentQuery, params, options)

      return parents$.pipe(
        map<SanityDocument[], ListBuilder>((documents) => {
          return S.list()
            .title('Parent pages')
            .items(
              documents.map((page) => {
                const details = detailDocListItem(S, page, TbSignRight)
                const children = page.children

                return children
                  ? S.listItem()
                      .title(page.title)
                      .icon(TbDirections)
                      .id(page._id)
                      .child(() => {
                        const childPages$ = queryChildPages({
                          documentStore,
                          pageId: page._id,
                          S,
                        })
                        return childPages$.pipe(
                          map((childPages) => {
                            return S.list()
                              .title('Pages - route ' + page.slug)
                              .items([
                                details,
                                S.divider(),
                                ...(Array.isArray(childPages) ? childPages : [childPages]),
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
