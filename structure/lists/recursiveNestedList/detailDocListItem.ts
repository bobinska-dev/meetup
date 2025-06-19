import type { SanityDocument } from '@sanity/client'
import type { ReactNode } from 'react'
import { IconType } from 'react-icons/lib'
import { TbSignRight } from 'react-icons/tb'
import type { StructureBuilder } from 'sanity/structure'

/** This will render out the parent as a document list item  */
export const detailDocListItem = (
  S: StructureBuilder,
  document: SanityDocument,
  icon?: IconType | ReactNode,
) =>
  // * You can also opt into using a documentListItem instead, if you prefer unnested documents to be displayed with your own preview config
  S.documentListItem()
    .id(document._id)
    .schemaType(document._type)
    .icon(icon || TbSignRight)
/* S.listItem()
    .title(document.title || '')
    .id(document._id)
    .icon(icon || TbSignRight)
    .child(
      S.document()
        .schemaType(document._type || '')
         .documentId(document?._id || ''),
    )*/
