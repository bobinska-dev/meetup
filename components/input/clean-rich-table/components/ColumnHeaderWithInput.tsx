import { ColumnHeader } from '../../../../schemaTypes/rich-table/columnHeader.object'
import { ObjectItem, SanityClient } from 'sanity'
import { ChangeEvent, ComponentType, useCallback, useState } from 'react'
import { Card, TextInput } from '@sanity/ui'

import styled from 'styled-components'
import ColumnContextMenu from './ColumnContextMenu'

interface ColumnHeaderWithInputProps {
  columnHeader: ColumnHeader & ObjectItem
  _id: string
  client: SanityClient
  path: string
  columnIndex: number
  rowCount: number
}

export const ColumnHeaderWithInput: ComponentType<ColumnHeaderWithInputProps> = ({
  columnHeader,
  client,
  _id,
  path,
  columnIndex,
  rowCount,
}) => {
  const [title, setTitle] = useState(columnHeader.title || '')
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value
    setTitle(newTitle)
  }, [])

  const handleBlur = useCallback(async () => {
    setIsFocused(false)
    return await client
      .patch(_id)
      .set({
        [`${path}.columnHeaders[_key=="${columnHeader._key}"].title`]: title,
      })
      .commit()
      .then((res) => console.log(res))
      .catch(console.error)
  }, [title, _id, columnHeader._key])
  // TODO ADD KEY WITH OPEN DIALOG TO FORCE REMOUNT
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
        style={{ textAlign: 'center' }}
        suffix={
          <ColumnContextMenu
            _id={_id}
            client={client}
            path={path}
            columnHeaderKey={columnHeader._key}
            columnIndex={columnIndex}
            rowCount={rowCount}
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
