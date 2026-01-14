import { ComponentType } from 'react'
import { Box, Button, Flex, FlexDirection, Text, Tooltip } from '@sanity/ui'
import { AddIcon, RemoveIcon } from '@sanity/icons'

const TableButtons: ComponentType<{
  removeHandler: () => void
  addHandler: () => void
  /** flex direction -> row = horizontal, column = vertical */
  direction?: FlexDirection
  target: 'row' | 'column'
}> = (props) => {
  const { removeHandler, addHandler, direction, target } = props
  return (
    <Flex direction={direction}>
      <Tooltip
        content={
          <Box padding={1}>
            <Text size={1}>Add {target}</Text>
          </Box>
        }
        portal
      >
        <Button icon={AddIcon} onClick={addHandler} mode={'ghost'} />
      </Tooltip>
      <Tooltip
        content={
          <Box padding={1}>
            <Text size={1}>Remove {target}</Text>
          </Box>
        }
        portal
      >
        <Button icon={RemoveIcon} onClick={removeHandler} mode={'ghost'} />
      </Tooltip>
    </Flex>
  )
}
