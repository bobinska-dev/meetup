import { defineArrayMember, defineType, ObjectInputProps } from 'sanity'
import { Stack } from '@sanity/ui'
import RichTableInput from '../../components/input/clean-rich-table/index'

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
          return (
            <Stack>
              {props.renderDefault({ ...props })}
              {/*<Card shadow={1}>{props.children}</Card>*/}
              {/*  TODO: add preview here, but without inline editing */}
            </Stack>
          )
        },
        // TODO: fix this
        input: function RichTablePortableInput(props: ObjectInputProps) {
          return <RichTableInput {...(props as any)} isInPortableText={true} />
        },
      },
    }),
  ],
})
