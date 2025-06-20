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
  preview: {
    select: {
      title: 'title',
      code: 'code',
      language1: 'languages.0.code',
      language2: 'languages.1.code',
      language3: 'languages.2.code',
      language4: 'languages.3.code',
    },
    prepare({ title, language1, language2, language3, language4, code }) {
      const languages = [language1, language2, language3, language4]
        .filter(Boolean)
        .map((lang) => lang.toUpperCase())
      const subtitle = languages.length > 0 ? languages.join(', ') : null
      const codeTitle = code ? `${title}  (${code.toUpperCase()})` : ''
      return {
        title: codeTitle || 'Market',
        subtitle: subtitle ? `(${subtitle})` : 'No languages assigned',
      }
    },
  },
})
