import { defineType, ObjectInputProps } from 'sanity'

import RichTableBock from '../components/RichTableBock'
import RichTableInput from '../components/RichTableInput'

export default defineType({
  name: 'richTableBlock',
  title: 'Rich Table Block',
  type: 'richTable',
  components: {
    block: RichTableBock,
    input: function RichTablePortableInput(props: ObjectInputProps) {
      return <RichTableInput {...(props as any)} isInPortableText={true} />
    },
  },
})
