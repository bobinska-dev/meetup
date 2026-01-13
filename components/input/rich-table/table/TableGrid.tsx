import styled from 'styled-components'

/** A grid container for rich tables
 * @param $columns - Number of columns in the grid. Defaults to 5.
 * @param $rows - Number of rows in the grid. Defaults to 5.
 */
const TableGrid = styled.div<{ $columns?: number; $rows?: number }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$columns ? `repeat(${props.$columns}, 1fr);` : 'repeat(5, 1fr);'};
  grid-template-rows: ${(props) =>
    props.$rows ? `repeat(${props.$rows}, auto);` : 'repeat(5, auto);'};
  gap: 1rem;
  //align-items: stretch;
`
export default TableGrid
