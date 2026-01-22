import { Card, TextInput } from '@sanity/ui'
import { ComponentType, useCallback, useState } from 'react'
import { ColumnHeader } from '../../../../schemaTypes/rich-table/columnHeader.object'
import { ObjectItem, Path, pathToString, SanityClient } from 'sanity'
import styled from 'styled-components'
import ColumnMenuButton from './ColumnMenuButton'

interface ColumnHeaderWithInputProps {
  columnHeader: ColumnHeader & ObjectItem
  _id: string
  client: SanityClient
  path: Path
  columnIndex: number
}

export const ColumnHeaderWithInput: ComponentType<ColumnHeaderWithInputProps> = ({
  columnHeader,
  client,
  _id,
  path,
  columnIndex,
}) => {
  const [title, setTitle] = useState(columnHeader.title || '')
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value
    setTitle(newTitle)
  }, [])

  const handleBlur = useCallback(async () => {
    setIsFocused(false)
    return await client
      .patch(_id)
      .set({
        [`${pathToString(path)}.columnHeaders[_key=="${columnHeader._key}"].title`]: title,
      })
      .commit()
      .then((res) => console.log(res))
      .catch((error) => console.error)
  }, [title, _id, columnHeader._key])

  return (
    <StyledCard shadow={isFocused ? 1 : undefined} tone={isFocused ? 'primary' : undefined}>
      <TextInput
        onChange={handleChange}
        onBlur={handleBlur}
        value={title}
        aria-label="Column Header Title"
        weight={'semibold'}
        onFocus={() => setIsFocused(true)}
        style={{ textAlign: 'center' }}
        suffix={
          <ColumnMenuButton
            _id={_id}
            client={client}
            path={path}
            columnHeaderKey={columnHeader._key}
            columnIndex={columnIndex}
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
