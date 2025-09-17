import { defineArrayMember, defineField } from 'sanity'
import ArrayOfReferencesSelectInput from '../../components/input/ArrayOfReferencesSelectInput'

export default defineField({
  name: 'labels',
  title: 'Labels',
  type: 'array',
  description: 'Add any relevant labels...',

  of: [
    defineArrayMember({
      type: 'reference',
      // weak: true,
      to: [
        {
          type: 'listOption',
        },
      ],
    }),
  ],

  components: {
    // @ts-ignore
    input: ArrayOfReferencesSelectInput,
  },
})
