import { useToolbarSchema } from '@portabletext/toolbar'
import { Card, Flex } from '@sanity/ui'
import { ComponentType, useCallback, useState } from 'react'
import extendDecorator from '../configs/extendDecorators'
import extendStyle from '../configs/extendStyles'
import StyleSelector from '../components/StyleSelector'
import DecoratorDropdown from '../components/DecoratorDropdown'
import styled from 'styled-components'
import AnnotationPopover from './AnnotationPopover'

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
      {toolbarSchema.annotations ? (
        <AnnotationPopover schemaTypes={toolbarSchema.annotations} />
      ) : null}
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
