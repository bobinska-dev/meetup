import { useCallback } from 'react'
import { OperationsAPI } from 'sanity'

import { RichTableType } from '../schemas/richTable.object'

/** Hook to toggle the presence of column and row titles in a rich table. */
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
    [patch, path],
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
    [patch, path],
  )
  return {
    toggleColumnTitles,
    toggleRowTitles,
  }
}
