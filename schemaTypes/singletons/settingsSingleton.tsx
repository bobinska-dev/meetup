import { TbSettings } from 'react-icons/tb'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { filterForUsedPages, filterForUsedPagesHomePage } from '../../utils/filterOptions'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: TbSettings,
  groups: [
    {
      name: 'menuDef',
      title: 'Menu Definition',
      default: true,
    },
    {
      name: 'footer',
      title: 'Footer',
    },
  ],
  fields: [
    // * * * * Title * * * *
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      hidden: true,
    }),

    // * * * * homePage * * * *
    defineField({
      name: 'homePage',
      title: 'Home Page',
      description: 'Select the page to be displayed as the home page',
      type: 'reference',
      to: [{ type: 'page' }],
      options: {
        filter: ({ document }) => filterForUsedPagesHomePage(document),
      },
      group: 'menuDef',
      validation: (Rule) => Rule.required(),
    }),
    // * * * * Menu * * * *
    defineField({
      name: 'menu',
      title: 'Menu',
      type: 'menu',
      group: 'menuDef',
      description:
        'The menu that is used in the navigation. The first menu item will appear first in the navigation. You can add menu items with or without nested submenus.',
    }),

    // * * * * Footer Quick Links * * * *
    defineField({
      name: 'quickLinks',
      title: 'QuickLinks in the Footer',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'page' }],
          description:
            'Select a page to add it to the footer quick links. Pages used in the menu are excluded.',
          options: {
            filter: ({ document }) => filterForUsedPages(document),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
        subtitle: 'Menu Items, Footer Info, and Open Graph Image',
      }
    },
  },
})
