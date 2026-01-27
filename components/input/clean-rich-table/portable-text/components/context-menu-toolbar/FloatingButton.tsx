// styled button that floats over content in right top corner of parent

import styled from 'styled-components'
import { Button } from '@sanity/ui'

export default styled(Button)`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 20;
`
