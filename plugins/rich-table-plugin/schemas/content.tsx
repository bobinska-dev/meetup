import { defineArrayMember, defineType } from 'sanity'
import { RichTablePluginOptions } from '../index'

export default defineType({
  name: 'content',
  title: 'Rich table content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // TODO: add customizations for block and inline block types, decorators, annotations, etc. as needed
      options: {
        // Restrict to a single line for table cell content to make it more manageable
        oneLine: false,
      },
    }),

    /*    defineArrayMember({
      type: 'image',
      name: 'image',
      title: 'Image',
      options: { hotspot: true },
      // TODO: Add small preview and block component so that less real estate is being used inside of the table cell
    }),*/
    // TODO: test out richTable inside of portable text
  ],
})
export const defineContentArrayMember = ({
  customBlockTypes,
}: {
  customBlockTypes?: RichTablePluginOptions['customBlockTypes']
}) => {
  const blockTypes = customBlockTypes ? customBlockTypes : []
  const customBlockMembers = blockTypes.map((blockType) => {
    console.log('defining custom block member for rich table content:', blockType)
    return defineArrayMember({ ...(blockType.type as any), icon: blockType.icon })
  })
  return defineArrayMember({
    name: 'content',
    title: 'Rich table content',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
      }),
      ...customBlockMembers,
    ],
  })
}
