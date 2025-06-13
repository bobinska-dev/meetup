import { defineArrayMember, defineType } from 'sanity'

/** Type for menu item schema type in the Studio */
export interface MenuItemValue {
  title: string
  _type: string
  _key: string
  isNested: boolean
  link?: {
    _type: string
    _ref: string
  }
  menuItems?: MenuItemValue[]
}

/**
 * Menu items for page navigation
 *
 */
export default defineType({
  name: 'menu',
  title: 'Menu',
  type: 'array',
  validation: (Rule) => Rule.required().min(2),
  of: [
    defineArrayMember({
      type: 'menuItem',
      name: 'menuItem',
      title: 'Menu Item',
    }),
  ],
})
