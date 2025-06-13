import { TbMap2 } from 'react-icons/tb'
import { defineField, defineType, ReferenceValue } from 'sanity'

export default defineType({
  name: 'market',
  title: 'Market',
  type: 'document',
  icon: TbMap2,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'code',
      title: 'Country Code',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .lowercase()
          .regex(/^[a-z0-9._]*$/),
    }),

    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [
        {
          type: 'reference',
          name: 'language',
          to: [{ type: 'language' }],
          options: {
            filter: ({ document }) => {
              return {
                filter: '_type == "language" && !(_id in $refs)',
                params: {
                  refs: (document?.languages as ReferenceValue[]).map(({ _ref }) => _ref),
                },
              }
            },
          },
        },
      ],

      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
