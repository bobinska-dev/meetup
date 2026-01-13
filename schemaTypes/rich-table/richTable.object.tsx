import { defineArrayMember, defineField, defineType, ObjectInputProps } from 'sanity'
import RichTableInput from '../../components/input/rich-table/RichTableInput'
import { ComponentType } from 'react'

export default defineType({
  name: 'richTable',
  title: 'Rich Table',
  type: 'object',
  components: {
    input: RichTableInput as ComponentType<ObjectInputProps>,
  },
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      validation: (Rule) => Rule.min(1).error('A table must have at least one row.').required(),
      of: [
        defineArrayMember({
          name: 'row',
          type: 'richTableRow',
        }),
      ],
    }),
    defineField({
      name: 'columnHeaders',
      title: 'Column Headers',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'columnHeader',
          type: 'columnHeader',
        }),
      ],
    }),
  ],
})
