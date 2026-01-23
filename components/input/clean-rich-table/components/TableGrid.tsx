import { Card } from '@sanity/ui'
import styled from 'styled-components'

/** A styled Card component that uses CSS Grid to layout its children in a grid format.
 */
export default styled(Card)<{ $columnCount: number; $rowCount: number; $isInDialog: boolean }>`
  display: grid !important;

  grid-template-columns: ${(props) =>
    props.$columnCount
      ? props.$columnCount <= 1
        ? '2rem'
        : `2rem repeat(${props.$columnCount - 1}, 1fr)`
      : '2rem repeat(4, 1fr)'};

  grid-template-rows: ${(props) =>
    props.$rowCount
      ? props.$rowCount <= 1
        ? 'minmax(0, 50px)'
        : `minmax(0, 50px) repeat(${props.$rowCount - 1}, auto)`
      : 'minmax(0, 50px) repeat(1, auto)'};
  min-width: 60vw;
  min-height: ${(props) => (props.$isInDialog ? '50vh' : 'auto')};
`
