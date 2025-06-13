import { TagIcon } from '@sanity/icons'
import { defineArrayMember, defineField } from 'sanity'
import DynamicListInput from '../../components/input/DynamicListInput'

export default (group: string[] | undefined) =>
  defineField({
    name: 'dynamicList',
    title: 'Dynamic List',
    type: 'array',
    options: {
      list: [],
    },
    components: {
      input: DynamicListInput,
    },
    of: [
      defineArrayMember({
        type: 'object',
        name: 'dynamicListItem',
        icon: TagIcon,
        fields: [
          /* {
  "title": "List Option 1",
  "value": {
    "_ref": "a3297256-47ef-4f4a-909d-a5da5246f2aa",
    "_type": "dynamicListItem"
  },
  "_key": "auto-generated-0"
} */
          defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
          }),
          defineField({
            name: 'value',
            title: 'Value',
            type: 'reference',
            to: [{ type: 'listOption' }],
          }),
        ],
      }),
    ],
    group: group ?? undefined,
  })
