import { defineField, defineType, ObjectItem } from 'sanity'
import { RichTableCellType } from './cell.object'

export type RichTableRowType = ObjectItem & {
  title?: string
  cells?: Array<RichTableCellType>
}

export default defineType({
  name: 'richTableRow',
  title: 'Rich Table Row',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title for the row.',
    }),
    defineField({
      name: 'cells',
      title: 'Cells',
      type: 'array',
      of: [
        defineType({
          name: 'richTableCell',
          title: 'Cell',
          type: 'richTableCell',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      cells: 'cells.content',
    },
  },
})
