import { Card } from '@sanity/ui'
import styled from 'styled-components'

const MINMAX_HEADER_ROW_HEIGHT = 35 // in px
const ROW_TITLE_COLUMN_WIDTH = 4 // in rem
/** A styled Card component that uses CSS Grid to layout its children in a grid format.
 */
export default styled(Card)<{ $columnCount: number; $rowCount: number; $isInDialog: boolean }>`
  display: grid !important;

  grid-template-columns: ${(props) =>
    props.$columnCount
      ? props.$columnCount <= 1
        ? `${ROW_TITLE_COLUMN_WIDTH}rem`
        : `${ROW_TITLE_COLUMN_WIDTH}rem repeat(${props.$columnCount - 1}, 1fr)`
      : `${ROW_TITLE_COLUMN_WIDTH}rem repeat(4, 1fr)`};

  grid-template-rows: ${(props) =>
    props.$rowCount
      ? props.$rowCount <= 1
        ? `minmax(0, ${MINMAX_HEADER_ROW_HEIGHT}px)`
        : `minmax(0, ${MINMAX_HEADER_ROW_HEIGHT}px) repeat(${props.$rowCount - 1}, auto)`
      : `minmax(0, ${MINMAX_HEADER_ROW_HEIGHT}px) repeat(1, auto)`};
  min-width: 60vw;
  min-height: ${(props) => (props.$isInDialog ? '50vh' : 'auto')};
`
