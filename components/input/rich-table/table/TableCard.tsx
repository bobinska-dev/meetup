import styled from 'styled-components'
import { Card } from '@sanity/ui'

export default styled(Card)`
  display: block;
  max-width: 100%;
  position: relative;
  top: 0;
  left: 0;
  overflow: visible;
`

export const TableWidthCard = styled(Card)<{ $tableWidth: number | undefined }>`
  width: ${(props) => (props.$tableWidth ? `${props.$tableWidth}px` : 'auto')};
  min-width: 100%;
`
