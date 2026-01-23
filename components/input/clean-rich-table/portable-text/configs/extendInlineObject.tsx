import { ExtendInlineObjectSchemaType } from '@portabletext/toolbar'

export const extendInlineObject: ExtendInlineObjectSchemaType = (inlineObject) => {
  // YOU CAN ADD CUSTOM INLINE OBJECT TYPES HERE AND EXTEND THEIR SCHEMA

  // TODO: implement icon inline object
  /*  if (inlineObject.name === 'icon') {
    return {
      ...inlineObject,
      icon: TbIcons,
      defaultValues: {
        userId: '1',
        name: 'Alice Smith',
        username: 'alice',
      },
    }
  }*/

  return inlineObject
}
