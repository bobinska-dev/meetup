import { Card } from '@sanity/ui'
import styled from 'styled-components'

/** A styled Card component that uses CSS Grid to layout its children in a grid format.
 */
export default styled(Card)<{ $columnCount: number; $rowCount: number }>`
  display: grid !important;
  grid-template-columns: ${(props) =>
    props.$columnCount
      ? props.$columnCount <= 1
        ? '2rem'
        : `2rem repeat(${props.$columnCount - 1}, 1fr)`
      : '2rem repeat(4, 1fr)'};
  grid-template-rows: ${(props) =>
    props.$rowCount ? `repeat(${props.$rowCount}, auto);` : 'repeat(1, auto);'};
  width: 100%;
  min-width: 60vw;
  grid-gap-x: 8px;
  // add borders to the grid cells
`
