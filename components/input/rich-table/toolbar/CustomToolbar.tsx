import { useToolbarSchema } from '@portabletext/toolbar'
import { Card, Flex } from '@sanity/ui'
import { ComponentType, useCallback, useState } from 'react'
import extendDecorator from '../portable-text-configs/extendDecorators'
import extendStyle from '../portable-text-configs/extendStyles'
import StyleSelector from '../portable-text-configs/StyleSelector'
import DecoratorDropdown from '../portable-text-configs/DecoratorDropdown'
import styled from 'styled-components'

const CustomToolbar: ComponentType<{ focus: boolean }> = ({ focus }) => {
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null)

  const toolbarSchema = useToolbarSchema({
    extendDecorator,
    extendStyle,
  })
  const preventEditorBlurOnToolbarMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault()
  }, [])

  return (
    <StyledCard
      // @ts-ignore
      onMouseDown={preventEditorBlurOnToolbarMouseDown}
      ref={setRootElement}
      $focus={focus}
    >
      <StyledFlex justify={'space-between'} $focus={focus}>
        <StyleSelector toolbarSchema={toolbarSchema} />
        <DecoratorDropdown toolbarSchema={toolbarSchema} />
      </StyledFlex>
    </StyledCard>
  )
}
const StyledCard = styled(Card)<{ $focus: boolean }>`
  /*  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;*/
`

const StyledFlex = styled(Flex)<{ $focus: boolean }>``
export default CustomToolbar
