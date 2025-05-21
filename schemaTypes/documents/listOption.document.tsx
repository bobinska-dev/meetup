import { TbCheckbox } from 'react-icons/tb'
import { defineField, defineType } from 'sanity'
import { Value } from 'sanity-plugin-internationalized-array'

export default defineType({
  name: 'listOption',
  title: 'List Option',
  type: 'document',
  icon: TbCheckbox,

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'internationalisedTitle',
      title: 'Internationalised Title',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        // @ts-ignore
        Rule.required().custom((value: Value[], context) => {
          if (value.length === 0) {
            return 'At least one language is required'
          }
          if (value.some((v) => !v.value)) {
            const getEmptyInputPaths = () => {
              return value.map((languageField, i) => {
                if (!languageField.value) {
                  return [{ _key: languageField._key }, 'value']
                }
              })
            }

            return {
              message: 'All languages must have a value',
              paths: getEmptyInputPaths(),
            }
          }
          return true
        }),
    }),

    defineField({
      name: 'value',
      title: 'Value',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
  ],
})
