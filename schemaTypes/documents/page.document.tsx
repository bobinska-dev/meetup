import { TbBrowser } from 'react-icons/tb'
import { defineField, defineType, getIdPair } from 'sanity'
import dynamicList from '../specialFields/dynamicList'
import { pageSettingsFields } from '../specialFields/pageSettingsFields'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: TbBrowser,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
      },
      group: ['content', 'settings'],
    }),

    // * * PAGE SETTINGS * *
    dynamicList(['content']),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
      group: 'content',
    }),

    defineField({
      name: 'parent',
      title: 'Parent Page',
      type: 'reference',
      to: [{ type: 'page' }],
      options: {
        filter: ({ document }) => {
          const documentId = document?._id
          const { publishedId } = getIdPair(documentId)

          return {
            filter: '!(_id == $documentId)',
            params: {
              documentId: publishedId,
            },
          }
        },
      },
      group: ['settings', 'content'],
    }),

    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),

    // * * PAGE SETTINGS * *
    ...pageSettingsFields,
  ],
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'settings',
      title: 'Page Settings',
    },
  ],
})
