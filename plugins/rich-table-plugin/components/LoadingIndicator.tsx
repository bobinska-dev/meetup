import { Flex, Spinner } from '@sanity/ui'
import { ComponentType } from 'react'

const LoadingIndicator: ComponentType = () => {
  return (
    <Flex justify={'center'} align={'center'} padding={4}>
      <Spinner />
    </Flex>
  )
}

export default LoadingIndicator
