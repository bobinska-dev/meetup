import defineStructure from '../utils/defineStructure'

import { Info } from '@phosphor-icons/react'
import groq from 'groq'
import { type Observable, catchError, distinctUntilChanged, map, of } from 'rxjs'
import { type DocumentStore, type Id, Reference, getIdPair } from 'sanity'

function queryColorways({
  documentStore,
  productId,
}: {
  documentStore: DocumentStore
  productId: Id
}): Observable<Id[]> {
  const query = groq`coalesce(*[_id == $draftId][0], *[_id == $publishedId][0])`

  const idPair = getIdPair(productId)

  return documentStore
    .listenQuery(query, idPair, {
      apiVersion: '2023-07-31',
      tag: `product-colorways`,
    })
    .pipe(
      map<any, Id[]>((product) =>
        Array.isArray(product?.colorways)
          ? product.colorways
              .filter((reference: any): reference is Reference => Boolean(reference?._ref))
              .map((reference: Reference) => reference._ref)
          : [],
      ),
      distinctUntilChanged(
        (a, b) =>
          Array.isArray(a) &&
          Array.isArray(b) &&
          a.length == b.length &&
          a.every((element, i) => element === b[i]),
      ),
    )
}

export const productsMenu = defineStructure<ListItemBuilder>((S, { documentStore }) =>
  S.listItem()
    .title('Products')
    .schemaType('product')
    .child(
      S.documentTypeList('product')
        // Product
        .child((productId) => {
          const colorways$ = queryColorways({ documentStore, productId })

          const details = S.listItem()
            .title('Details')
            .icon(Info)
            .child(S.document().schemaType('product').documentId(productId))

          return colorways$.pipe(
            map((colorways) =>
              colorways.map((colorwayId) =>
                S.documentListItem().schemaType('colorway').id(colorwayId),
              ),
            ),
            catchError((error) => (console.error(error), of([]))),
            map((colorways) =>
              S.list()
                .title('Product')
                .items([details, S.divider(), ...colorways]),
            ),
          )
        }),
    ),
)
