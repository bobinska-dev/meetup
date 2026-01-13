import { useToolbarSchema } from '@portabletext/toolbar'
import { Flex } from '@sanity/ui'
import { ComponentType } from 'react'
import extendDecorator from '../portable-text-configs/extendDecorators'
import extendStyle from '../portable-text-configs/extendStyles'
import StyleSelector from '../portable-text-configs/StyleSelector'
import DecoratorDropdown from '../portable-text-configs/DecoratorDropdown'

const CustomToolbar: ComponentType = () => {
  // useToolbarSchema provides access to the PTE schema
  // optionally, pass in updated schemas to override the default
  const toolbarSchema = useToolbarSchema({
    extendDecorator,
    extendStyle,
  })
  return (
    <Flex justify={'space-between'} style={{ borderBottom: '1px solid var(--card-border-color)' }}>
      <StyleSelector toolbarSchema={toolbarSchema} />
      <DecoratorDropdown toolbarSchema={toolbarSchema} />
    </Flex>
  )
}
export default CustomToolbar
