import {
  ReferenceFilterResolverContext,
  ReferenceFilterSearchOptions,
  ReferenceValue,
} from 'sanity'
import { MenuItemValue } from '../schemaTypes/specialFields/menu.arrayField'

/** ### `filterForUsedPages` - filter function for the menu item link options
 *
 * Checks both the `menu`, `homePage` and `quickLinks` fields of the `siteSettings` document to filter out pages that are already in use.
 *
 * @param document - the current document passed down through the options.filter context
 * @returns `ReferenceFilterSearchOptions` - an object with a filter and params property
 *
 * @example
 * ```tsx
 * defineField({
 *  name: 'link',
 *  title: 'Link',
 *  type: 'reference',
 *  validation: (Rule) => Rule.required(),
 *  to: [{ type: 'page' }],
 *  options: {
 *    filter: ({ document }) => filterForUsedPages(document),
 *  },
 * }),
 * ```
 */
export const filterForUsedPages = (
  document: ReferenceFilterResolverContext['document'],
): ReferenceFilterSearchOptions => {
  const menuIds =
    (document.menu as MenuItemValue[])?.map((item) =>
      item.isNested ? item.menuItems?.map((menuItem) => menuItem.link?._ref) : item.link?._ref,
    ) ?? []
  const quickLinkIDs = (document.quickLinks as ReferenceValue[])?.map((link) => link._ref) ?? []
  const usedPagesIDs = [...menuIds, quickLinkIDs]
    // return flat version of the IDs
    .flat()
    // remove empty values
    .filter((n) => n)

  return {
    filter: '_type == "page" && !(_id in $usedPages || _id == $currentHome)',
    params: {
      usedPages: usedPagesIDs,
      currentHome: (document.homePage as ReferenceValue)?._ref || '',
    },
  }
}

/** ### `filterForUsedPagesHomePage` - filter function for `homePage` field
 *
 * Checks both the menu and quickLinks fields of the `siteSettings` document to filter out pages that are already in use.
 *
 * @param document - the current document passed down through the `options.filter` context
 * @returns `ReferenceFilterSearchOptions` - an object with a filter and params property
 *
 * @example
 * ```tsx
 * defineField({
 *  name: 'homePage',
 *  title: 'Home Page',
 *  type: 'reference',
 *  validation: (Rule) => Rule.required(),
 *  to: [{ type: 'page' }],
 *  options: {
 *    filter: ({ document }) => filterForUsedPages(document),
 *  },
 * }),
 * ```
 */
export const filterForUsedPagesHomePage = (
  document: ReferenceFilterResolverContext['document'],
): ReferenceFilterSearchOptions => {
  const menuIds =
    (document.menu as MenuItemValue[])?.map((item) =>
      item.isNested ? item.menuItems?.map((menuItem) => menuItem.link?._ref) : item.link?._ref,
    ) ?? []
  const quickLinkIDs = (document.quickLinks as ReferenceValue[])?.map((link) => link._ref) ?? []
  const usedPagesIDs = [...menuIds, quickLinkIDs]
    // return flat version of the IDs
    .flat()
    // remove empty values
    .filter((n) => n)

  return {
    filter: '_type == "page" && !(_id in $usedPages)',
    params: {
      usedPages: usedPagesIDs,
    },
  }
}
