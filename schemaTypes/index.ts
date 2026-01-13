import languageDocument from './documents/language.document'
import listOptionDocument from './documents/listOption.document'
import pageDocument from './documents/page.document'
import body from './portableText/body'
import deletedDocBinDocument from './singletons/deletedDocBinDocument'
import cellObject from './rich-table/cell.object'
import rowObject from './rich-table/row.object'
import columnHeaderObject from './rich-table/columnHeader.object'
import richTableObject from './rich-table/richTable.object'
import content from './portableText/content'
import testDocument from './documents/ testDocument'

export const schemaTypes = [
  // Documents
  pageDocument,
  listOptionDocument,
  deletedDocBinDocument,
  languageDocument,
  testDocument,

  // objects
  cellObject,
  rowObject,
  columnHeaderObject,
  richTableObject,

  // Portable Text
  body,
  content,
]
