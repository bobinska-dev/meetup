import { definePlugin } from 'sanity'

import cellObject from './schemas/cell.object'
import columnHeaderObject from './schemas/columnHeader.object'
import content from './schemas/content'
import richTableBlock from './schemas/richTable.block'
import richTableObject from './schemas/richTable.object'
import rowObject from './schemas/row.object'

interface RichTablePluginOptions {
  // config options coming soon!
}
export const richTablePlugin = definePlugin<RichTablePluginOptions>(({}) => ({
  name: 'rich-table',
  title: 'Rich Table Plugin',

  schema: {
    types: [richTableObject, rowObject, cellObject, columnHeaderObject, richTableBlock, content],
  },
}))
