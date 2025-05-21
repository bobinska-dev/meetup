import { Box, Flex, Text } from '@sanity/ui'
import { ComponentType } from 'react'

export const PagePreviewMedia: ComponentType<{ language: string }> = (props) => {
  return (
    <Flex align="center" justify="center">
      <Box>
        <Text size={0}>{props.language?.toUpperCase() || 'N/A'}</Text>
      </Box>
    </Flex>
  )
}
