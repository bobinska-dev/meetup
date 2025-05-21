import { SanityUser } from '@sanity/client'
import { Box, Flex, Text } from '@sanity/ui'
import { ComponentType } from 'react'

/** ### User Component
 *
 * Displays the user who deleted the document
 *
 * Can be extended to show an avatar or other user information because we have it at our disposal, but here we only use the display name.
 */
const User: ComponentType<SanityUser> = (props) => {
  const { displayName } = props

  // You can also use the Sanity UI Avatar component to display the user's avatar but I like the clean look of just the name
  return (
    <Flex>
      <Box>
        <Text muted size={1}>
          Deleted by: {displayName}
        </Text>
      </Box>
    </Flex>
  )
}
export default User
