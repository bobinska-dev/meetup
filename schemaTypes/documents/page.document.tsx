import { defineField, defineType } from 'sanity'
import { PagePreviewMedia } from '../../components/previews/PagePreview'
import boringList from '../specialFields/boringList'
import dynamicList from '../specialFields/dynamicList'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
      },
    }),
    boringList,
    dynamicList,

    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
    }),

    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      language: 'language',
    },
    prepare({ title, language }) {
      return {
        title,
        media: language ? <PagePreviewMedia language={language} /> : undefined,
      }
    },
  },
})
