import { ColumnHeader } from '../../../../schemaTypes/rich-table/columnHeader.object'
import { ObjectItem, OperationsAPI } from 'sanity'
import { ChangeEvent, ComponentType, useCallback, useState } from 'react'
import { Card, TextInput } from '@sanity/ui'

import styled from 'styled-components'
import ColumnContextMenu from './ColumnContextMenu'
import { PatchOperations } from '@sanity/types'
import { RichTableType } from '../../rich-table/RichTableInput'
import { getLetterBasedOnIndex } from '../utils/getLetterBasedOnIndex'

interface ColumnHeaderWithInputProps {
  columnHeader: ColumnHeader & ObjectItem
  _id: string
  /** Patch function from Sanity document operations for optimistic changes */
  patch: OperationsAPI['patch']
  value: RichTableType
  path: string
  columnIndex: number
  rowCount: number
  columnCount: number
}

export const ColumnHeaderWithInput: ComponentType<ColumnHeaderWithInputProps> = ({
  columnHeader,

  patch,
  _id,
  path,
  columnIndex,
  rowCount,
  columnCount,
  value,
}) => {
  const [title, setTitle] = useState(columnHeader.title || '')
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value
    setTitle(newTitle)
  }, [])

  const handleBlur = useCallback(async () => {
    setIsFocused(false)
    const setPatch: PatchOperations = {
      set: {
        [`${path}.columnHeaders[_key=="${columnHeader._key}"].title`]: title,
      },
    }
    patch.execute([setPatch])
  }, [title, _id, columnHeader._key])
  // TODO ADD KEY WITH OPEN DIALOG TO FORCE REMOUNT
  const newColumnTitle = getLetterBasedOnIndex(columnIndex)
  return (
    <StyledCard shadow={isFocused ? 1 : undefined} tone={isFocused ? 'primary' : undefined}>
      <TextInput
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleBlur()
          }
        }}
        value={title}
        aria-label="Column Header Title"
        weight={'semibold'}
        onFocus={() => setIsFocused(true)}
        style={{
          textAlign: 'center',
          textOverflow: 'ellipsis',
          color: 'var(--card-muted-fg-color)',
        }}
        title={title}
        padding={0}
        placeholder={newColumnTitle}
        suffix={
          <ColumnContextMenu
            patch={patch}
            path={path}
            value={value}
            columnHeaderKey={columnHeader._key}
            columnIndex={columnIndex}
            rowCount={rowCount}
            columnCount={columnCount}
          />
        }
      />
    </StyledCard>
  )
}
const StyledCard = styled(Card)<{ $isFocused?: boolean }>`
  max-height: 50px;
  border: unset;
  [data-border] {
    box-shadow: unset;
  }
`

export default ColumnHeaderWithInput
