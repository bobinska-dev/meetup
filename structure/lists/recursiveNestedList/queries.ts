import type { SanityDocument } from '@sanity/client'
import groq from 'groq'
import { TbSignRight } from 'react-icons/tb'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DocumentStore, Id, ListenQueryOptions } from 'sanity'
import type { Divider, ListItem, ListItemBuilder, StructureBuilder, StructureResolverContext } from 'sanity/structure'

import { apiVersion } from '../../../lib/api'
import { childList } from './childList'
import { detailDocListItem } from './detailDocListItem'

/** Define which relationship to use for parent/child checks
 *
 * By default, this uses the `references` function to check for any references to the parent document
 * in the child documents.
 * This is a generic way that works for most use cases, but if you have a specific field that defines
 * the parent/child relationship you might want to change this to use that field instead.
 *
 * Examples:
 * ```ts
 * const childFilter = `parent._ref == ^._id`
 * // or even
 * const childFilter = `^._id in arrayOfReferencesFieldName[]._ref`
 * ```
 */
const childFilter = groq`references(^._id)`

// * * * fetch parents * * *
/** This will fetch parent documents and also their children if there are any */
export function queryParents({
  documentStore,
  S,
  type,
}: {
  documentStore: DocumentStore
  S: StructureBuilder
  /** the schema type name */
  type: string // allow passing a different type if needed
}): Observable<SanityDocument[]> {
  const parentQuery = groq` *[_type == $type && !defined(parent)]{
    _id, _type, title, "slug": slug.current, language,
    // check if the parent has children
    count(*[_type == $type && ${childFilter}]) > 0 => {
      "children": *[_type == $type && ${childFilter}] | order(_createdAt desc){ 
        _id, _type, title, "slug": slug.current, language,
        // check if the child has children
        "hasChildren": count(*[_type == $type && ${childFilter}]) > 0 
      }
    }
  }`
  const params = { type }
  const options = {
    apiVersion,
    perspective: 'drafts',
    includeResult: true,
    tag: `parent-structure-${type}`,
    throttleTime: 1000, // throttle the query to avoid too many requests
  } as ListenQueryOptions

  return documentStore.listenQuery(parentQuery, params, options)
}

// * * * fetch children * * *
/** This will fetch the children of a given parent,  */
export function queryChildren({
  documentStore,
  context,
  parentId,
  S,
  type,
}: {
  documentStore: DocumentStore
  context: StructureResolverContext

  S: StructureBuilder
  /** the page ID of the parent */
  parentId: Id
  /** the schema type name */
  type: string // allow passing a different type if needed
}): Observable<ListItemBuilder | ListItem | Divider> {
  const query = groq`*[_type == $type && references($parentId)] | order(_createdAt desc){
          _id, title, _type, "slug": slug.current, language,
          // check if the child has children
          // if you want to use the same structure for documents without children you can set the comparison to >= 0
          count(*[_type == $type && ${childFilter}]) > 0 => {
            "children": count(*[_type == $type && ${childFilter}]) > 0
          }
        }
  `

  return documentStore
    .listenQuery(
      query,
      { parentId, type },
      {
        apiVersion,
        tag: `pages-child-pages-${parentId}`,
        perspective: 'drafts',
        throttleTime: 1000, // throttle the query to avoid too many requests
      },
    )
    .pipe(
      map<SanityDocument[], any>((documents) =>
        Array.isArray(documents)
          ? documents.map((doc) => {
              const details = detailDocListItem(S, doc, TbSignRight)
              const children = doc.children

              return children
                ? childList({ documentStore, context, S, parent: doc, type })
                : details
            })
          : [],
      ),
    )
}
