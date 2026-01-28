import { ChangeEvent, ComponentType, useCallback, useState } from 'react'
import { OperationsAPI } from 'sanity'
import { RichTableRowType } from '../../../../schemaTypes/rich-table/row.object'
import { PatchOperations } from '@sanity/types'
import { Box, Button, Card, Dialog, Flex, Stack, Text, TextInput, Tooltip } from '@sanity/ui'
import styled from 'styled-components'
import RowContextMenu from './RowContextMenu'
import { TextIcon, WarningOutlineIcon } from '@sanity/icons'

interface RowHeaderWithInputProps {
  row: RichTableRowType
  /** Patch function from Sanity document operations for optimistic changes */
  patch: OperationsAPI['patch']
  rowIndex: number
  path: string
}
/** Row header component with input field for editing the row title */
const RowHeaderWithInput: ComponentType<RowHeaderWithInputProps> = ({
  row,
  patch,
  path,
  rowIndex,
}) => {
  const [title, setTitle] = useState(row.title || '')
  const [isFocused, setIsFocused] = useState(false)
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value
    setTitle(newTitle)
  }, [])
  const handleSubmit = useCallback(() => {
    const setPatch: PatchOperations = {
      set: {
        [`${path}.rows[_key=="${row._key}"].title`]: title,
      },
    }
    patch.execute([setPatch])
    return handleClose()
  }, [title, row._key])

  return (
    <Flex direction={'row'} gap={2} justify={'center'} align={'center'}>
      <Tooltip
        content={
          <Box padding={2}>
            {row.title && <Text size={1}>Row title: {row.title}</Text>}
            {!row.title && (
              <Text size={1} muted>
                <WarningOutlineIcon style={{ paddingRight: '0.5rem' }} /> Add row title
              </Text>
            )}
          </Box>
        }
      >
        <Button
          icon={TextIcon}
          mode={'bleed'}
          padding={1}
          onClick={handleOpen}
          fontSize={0}
          muted={!row.title}
        />
      </Tooltip>

      <RowContextMenu
        row={row}
        patch={patch}
        path={path}
        rowIndex={rowIndex}
        handleOpen={handleOpen}
      />
      {open && (
        <Dialog
          id={'row-title-dialog'}
          header="Edit Row Title"
          width={1}
          open={open}
          onClose={handleClose}
        >
          <Stack padding={4} space={3}>
            <Text as={'label'} htmlFor={'row-title-input-' + row._key} size={1} weight={'semibold'}>
              Row Title
            </Text>
            <TextInput
              id={'row-title-input-' + row._key}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit()
                }
              }}
              value={title}
              aria-label="Row Title"
              onFocus={() => setIsFocused(true)}
              placeholder={'Enter short row title'}
            />
            <Flex justify={'flex-end'}>
              <Button text={'Save'} onClick={handleSubmit} mode={'ghost'} />
            </Flex>
          </Stack>
        </Dialog>
      )}
    </Flex>
  )
}
const StyledCard = styled(Card)<{ $isFocused?: boolean }>`
  max-height: 50px;
  border: unset;
  [data-border] {
    box-shadow: unset;
  }
`
const VerticalBox = styled(Box)`
  //transform: rotate(-90deg);
`

export default RowHeaderWithInput
