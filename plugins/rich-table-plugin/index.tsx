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
/** # Rich Table Plugin for Sanity by Saskia Bobinska
 *
 * This plugin adds a rich table object type and block type to your schemas.
 * It allows users to create and manage rich tables both in documents and in Portable Text.
 *
 * ## Features
 * - Rich table object type with customizable rows and columns
 * - Rich table block type for embedding tables in Portable Text
 * - Support for cell content using Portable Text blocks
 * - Portable Text goodies like a floating toolbar, slash commands, and a mark down emoji picker - thanks to the amazing work of Christian Groengaard!
 * - Row and column titles (optional)
 * - Context menus for adding, deleting, and moving rows and columns
 * - Expandable table dialog for better editing experience
 *
 * ## Installation
 * To install the Rich Table Plugin, add it to your Sanity studio's `sanity.config.ts` file:
 *
 * ```ts
 * import { defineConfig } from 'sanity'
 * import { richTablePlugin } from 'path-to-rich-table-plugin'
 *
 * export default defineConfig({
 *   // ... other config options ...
 *   plugins: [richTablePlugin({})],
 * })
 * ```
 *
 * ## Usage
 * After installing the plugin, you can use the `richTable` object type in your schemas as a field (object) or the `richTableBlock` type in your Portable Text fields.
 *
 *  ### Using as a field
 *
 * ```ts
 *  defineField({
 *    name: 'myRichTable',
 *    title: 'My Rich Table',
 *    type: 'richTable', // Use the rich table object type
 *  })
 * ```
 *
 * ### Using as a custom block in Portable Text
 *
 * ```ts
 *  // in the portable text schema
 *  defineArrayMember({
 *    name: 'richTableBlock',
 *    title: 'Rich Table Block',
 *    type: 'richTableBlock', // Use the rich table block type
 *  })
 *  ```
 *
 *  ## Features coming
 *
 *  - More customization options for table styles and behaviors
 *  - Additional cell types and content options
 *  - Improved performance for large tables
 *  - Enhanced accessibility features
 *  - Integration with other Sanity plugins and tools
 */
export const richTablePlugin = definePlugin<RichTablePluginOptions>(({}) => ({
  name: 'rich-table',
  title: 'Rich Table Plugin',

  schema: {
    types: [richTableObject, rowObject, cellObject, columnHeaderObject, richTableBlock, content],
  },
}))
