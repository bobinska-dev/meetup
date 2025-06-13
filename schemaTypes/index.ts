import languageDocument from './documents/language.document'
import listOptionDocument from './documents/listOption.document'
import marketDocument from './documents/market.document'
import pageDocument from './documents/page.document'
import menuItemObject from './objects/menuItem.object'
import body from './portableText/body'
import settingsSingleton from './singletons/settingsSingleton'
import menuArrayField from './specialFields/menu.arrayField'

export const schemaTypes = [
  // Documents
  pageDocument,
  listOptionDocument,
  languageDocument,
  marketDocument,

  // objects
  menuItemObject,

  // Special Fields
  menuArrayField,

  // Portable Text
  body,

  // Singletons
  settingsSingleton,
]
