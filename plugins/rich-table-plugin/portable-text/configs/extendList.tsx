import { ExtendListSchemaType } from '@portabletext/toolbar'
import { ListIcon, ListOrderedIcon } from '../icons'

export const extendList: ExtendListSchemaType = (list) => {
  if (list.name === 'bullet') {
    return {
      ...list,
      icon: ListIcon,
    }
  }

  if (list.name === 'number') {
    return {
      ...list,
      icon: ListOrderedIcon,
    }
  }

  return list
}
