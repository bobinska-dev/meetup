import { defineArrayMember, defineType, ObjectInputProps } from 'sanity'
import { Card } from '@sanity/ui'
import CustomRichTableInput from '../../components/input/rich-table/custom-table'
import { ComponentType } from 'react'

export default defineType({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
    }),
    defineArrayMember({
      type: 'image',
      name: 'image',
      title: 'Image',
      options: { hotspot: true },
    }),
    // TODO: test out richTable inside of portable text
    defineArrayMember({
      name: 'richTable',
      title: 'Rich Table',
      type: 'richTable',
      components: {
        block: (props) => {
          return <Card>{props.children}</Card>
        },
        input: CustomRichTableInput as ComponentType<ObjectInputProps>,
      },
    }),
  ],
})
