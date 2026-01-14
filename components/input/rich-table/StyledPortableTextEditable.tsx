import { PortableTextEditable } from '@portabletext/editor'
import styled from 'styled-components'

export const StyledPortableTextEditable = styled(PortableTextEditable)`
  //border: 1px solid var(--card-border-color);
  border-radius: 0.0625rem;
  padding: 0.5rem;
  // TODO: Fix height issue within table cell -> nothing will stretch the input to full size
  height: stretch !important;
`
