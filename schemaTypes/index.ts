import languageDocument from './documents/language.document'
import listOptionDocument from './documents/listOption.document'
import pageDocument from './documents/page.document'
import body from './portableText/body'
import deletedDocBinDocument from './singletons/deletedDocBinDocument'
import testDocument from './documents/ testDocument'

export const schemaTypes = [
  // Documents
  pageDocument,
  listOptionDocument,
  deletedDocBinDocument,
  languageDocument,
  testDocument,

  // Portable Text
  body,
]
