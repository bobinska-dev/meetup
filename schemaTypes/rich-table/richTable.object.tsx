import { defineArrayMember, defineField, defineType, ObjectInputProps } from 'sanity'
import { ComponentType } from 'react'
import CustomRichTableInput from '../../components/input/rich-table/custom-table'

export default defineType({
  name: 'richTable',
  title: 'Rich Table',
  type: 'object',
  components: {
    input: CustomRichTableInput as ComponentType<ObjectInputProps>,
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
