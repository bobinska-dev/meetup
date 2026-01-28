import { defineField, defineType } from 'sanity'

export interface ColumnHeader {
  title: string
  /** test to integrate headers with cell keys */
  cellIndex: number
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
      name: 'cellIndex',
      title: 'Cell Index',
      type: 'number',
      description: 'Index of the cells this header corresponds to.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'cellIndex',
    },
  },
})
