import { defineArrayMember, defineField, defineType, ObjectInputProps } from 'sanity'
import { ComponentType } from 'react'
import RichTableInput from '../../components/input/clean-rich-table/index'
import { TbTable } from 'react-icons/tb'

export default defineType({
  name: 'richTable',
  title: 'Rich Table',
  type: 'object',
  icon: TbTable,
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
    defineField({
      name: 'hasColumnTitles',
      title: 'Has Column Titles',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'hasRowTitles',
      title: 'Has Row Titles',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Rich Table',
      icon: TbTable,
    }),
  },
})
