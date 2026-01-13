import { defineField, defineType } from 'sanity'

export interface ColumnHeader {
  title: string
  /** test to integrate headers with cell keys */
  cellKeys?: Array<string>
}
export default defineType({
  name: 'columnHeader',
  title: 'Column Header',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('Column title is required.'),
    }),
    defineField({
      name: 'cellKeys',
      title: 'Cell Keys',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})
