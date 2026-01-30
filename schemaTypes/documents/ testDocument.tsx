import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testDocument',
  title: 'Test Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'richTable',
      title: 'Rich Table',
      type: 'richTable',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
    }),
  ],
})
