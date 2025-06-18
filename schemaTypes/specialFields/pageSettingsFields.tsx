import { defineField } from 'sanity'
import InMenuInput from '../../components/isInMenu'

/** ## Page Settings fields
 *
 * - Page Placement settings -> Displays if page is part of the main navigation
 * - firstPublishedAt -> Automatically set when the page is first published
 *
 */
export const pageSettingsFields = [
  // * * * * Page Placement Settings * * * *
  defineField({
    name: 'isInMenu',
    title: 'Is in Menu',
    type: 'boolean',
    group: 'settings',
    components: {
      input: InMenuInput,
    },
  }),

  // * * * * First Published At * * * *
  defineField({
    name: 'firstPublishedAt',
    title: 'First Published At',
    description: 'This field is automatically set when the page is first published.',
    type: 'datetime',
    readOnly: true,
    hidden: true,
    group: 'settings',
  }),

  // * * * * Last Published At * * * *
  defineField({
    name: 'lastPublishedAt',
    title: 'Last Published At',
    description:
      'This field is automatically set when the page is published. It can be used to check the sync status of drafts after scheduled publishing (with Content Releases especially).',
    type: 'datetime',
    readOnly: true,
    hidden: true, // Hide this field from the editor
    group: 'settings',
  }),
]
