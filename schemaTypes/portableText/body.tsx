import { defineArrayMember, defineType } from 'sanity'

export default defineType({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
    }),
    defineArrayMember({
      type: 'image',
      name: 'image',
      title: 'Image',
      options: { hotspot: true },
    }),
    defineArrayMember({
      name: 'richTable',
      title: 'Rich Table',
      type: 'richTableBlock',
    }),
  ],
})
