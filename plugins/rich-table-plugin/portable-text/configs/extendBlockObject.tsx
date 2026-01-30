import { ExtendBlockObjectSchemaType } from '@portabletext/toolbar'

export const extendBlockObject: ExtendBlockObjectSchemaType = (blockObject) => {
  // * YOU CAN ADD CUSTOM BLOCK OBJECT TYPES HERE AND EXTEND THEIR SCHEMA
  /* if (blockObject.name === 'break') {
   return {
     ...blockObject,
     icon: ImageIcon,
   }
 }
 /*
 blockObject.name === 'image') {
   return {
     ...blockObject,
     icon: ImageIcon,
     defaultValues: {
       src: '',
       alt: 'Portable Text logo',
     },
   }
 }*/

  return blockObject
}
