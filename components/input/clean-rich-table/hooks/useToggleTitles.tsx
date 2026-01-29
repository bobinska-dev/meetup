// a callback function to toggle the titles of a rich table
import { useCallback } from 'react'
import { OperationsAPI } from 'sanity'
import { RichTableType } from '../../rich-table/RichTableInput'

export const useToggleTitles = (
  hasColumnTitles: RichTableType['hasColumnTitles'],
  hasRowTitles: RichTableType['hasRowTitles'],
  patch: OperationsAPI['patch'],
  path: string,
) => {
  const toggleColumnTitles = useCallback(
    (newValue: boolean) => {
      const hasColumnTitlePath = `${path}.hasColumnTitles`
      const setPatch = {
        set: { [hasColumnTitlePath]: true },
      }
      const unsetPatch = {
        unset: [hasColumnTitlePath],
      }
      newValue ? patch.execute([setPatch]) : patch.execute([unsetPatch])
    },
    [patch],
  )

  const toggleRowTitles = useCallback(
    (newValue: boolean) => {
      const hasRowTitlePath = `${path}.hasRowTitles`
      const setPatch = {
        set: { [hasRowTitlePath]: true },
      }
      const unsetPatch = {
        unset: [hasRowTitlePath],
      }
      newValue ? patch.execute([setPatch]) : patch.execute([unsetPatch])
    },
    [patch],
  )
  return {
    toggleColumnTitles,
    toggleRowTitles,
  }
}
