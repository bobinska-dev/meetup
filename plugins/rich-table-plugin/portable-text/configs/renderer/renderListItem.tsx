import { RenderListItemFunction } from '@portabletext/editor'
import styled from 'styled-components'

// TODO: reduce space between list items and levels
export const renderListItem: RenderListItemFunction = (props) => {
  const listType = props.schemaType.value

  return (
    <StyledLi $level={props.level} $listType={listType === 'number' ? 'number' : 'bullet'}>
      {props.children}
    </StyledLi>
  )
}

const StyledLi = styled.li<{ $level: number; $listType: 'bullet' | 'number' }>`
  display: list-item;
  list-style-type: ${(props) => (props.$listType === 'number' ? 'decimal' : 'disc')};

  margin-left: ${(props) => (props.$level ? `${props.$level}rem` : '0rem')};
  list-style-position: outside;
  // no padding top, small padding bottom
  padding: 0.1rem 0rem 0.25rem 0rem;

  // This is needed, so that the text and marker are aligned
  > div > div {
    transform: none !important;
  }

  &::marker {
    font-size: 0.8125rem;
  }
`
