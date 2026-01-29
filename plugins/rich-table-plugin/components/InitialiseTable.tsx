import { Box, Button, Card, Flex, Text } from '@sanity/ui'
import React, { ComponentType, useCallback, useState } from 'react'
import { OperationsAPI, PortableTextBlock } from 'sanity'

import { RichTableCellType } from '../schemas/cell.object'
import { ColumnHeader } from '../schemas/columnHeader.object'
import { RichTableRowType } from '../schemas/row.object'
import { generateKey } from '../utils/generateKey'
import { onKeyDownSelectCells } from '../utils/onKeyDownSelect'
import InitialiseGrid from './InitialiseGrid'

type TableSize = { rows: number; cols: number }

interface InitialiseTableProps {
  /** Maximum number of rows to display in the size picker */
  maxRows?: number
  /** Maximum number of columns to display in the size picker */
  maxCols?: number
  path: string
  /** Patch function from Sanity document operations for optimistic changes */
  patch: OperationsAPI['patch']
  isInPortableText?: boolean
  readOnly: boolean | undefined
}

const CELL_SIZE = 28
const GAP = 6

// TODO: add spinner or some other indictor after selection of table size -> atm this is taking too long for the UI to update after patch is gone through
// -> also maybe add toast notification on success / error
// TODO: add a way to create a document when doc was newly created -> _id is available but no way to check if doc exists yet or not

const InitialiseTable: ComponentType<InitialiseTableProps> = ({
  maxRows = 10,
  maxCols = 10,
  path,
  patch,
  isInPortableText,
  readOnly,
}) => {
  // * STATES
  const [selected, setSelected] = useState<TableSize>({
    rows: 0,
    cols: 0,
  })
  const [hover, setHover] = useState<TableSize>({ rows: 0, cols: 0 })

  const handleCommit = useCallback(
    (rowCount: number, cols: number) => {
      setSelected({ rows: rowCount, cols: cols })

      // Prepare the initial table value
      // Cells per row
      const cells: RichTableCellType[] = Array.from({ length: cols ?? 1 }, () => {
        return {
          _type: 'richTableCell',
          _key: generateKey(),
          content: [
            { _type: 'block', markDefs: [], children: [{ _type: 'span', text: '', marks: [] }] },
          ] as unknown as PortableTextBlock[],
        }
      })
      // New rows
      const rows: RichTableRowType[] = Array.from({ length: rowCount ?? 1 }, (_, i) => ({
        _type: 'row',
        cells: cells,
        _key: generateKey(),
        // title: `${i ? i + 1 : 1}`,
      }))

      // New column header item (title uses current header count when available)
      const columnHeaders: Array<ColumnHeader & { _type: string }> = Array.from(
        { length: cols ?? 1 },
        (_, index) => ({
          _type: 'columnHeader',
          _key: generateKey(),
          // title: getLetterBasedOnIndex(index),
          cellIndex: cols ? cols - 1 : 0,
        }),
      )
      const initialTableValue = {
        columnHeaders: columnHeaders,
        rows: rows,
        hasColumnTitles: true,
        hasRowTitles: true,
      }
      const portableBlockInitialValue = {
        ...initialTableValue,
        _type: 'richTable',
        _key: generateKey(),
      }

      // ** Prepare patches
      if (isInPortableText) {
        return patch.execute([
          {
            set: {
              [path]: portableBlockInitialValue,
            },
          },
        ])
      }
      return patch.execute([
        {
          set: {
            [path]: initialTableValue,
          },
        },
      ])
    },
    [path, patch, isInPortableText],
  )
  // * COMMIT SELECTION
  const effectiveRows = selected.rows || hover.rows
  const effectiveCols = selected.cols || hover.cols

  return (
    <Card
      padding={3}
      border
      radius={4}
      tabIndex={0}
      onMouseLeave={() => setHover({ rows: 0, cols: 0 })}
      onKeyDown={(e) =>
        !readOnly &&
        onKeyDownSelectCells({
          e,
          selected,
          setSelected,
          maxCols,
          maxRows,
          onChange: () => handleCommit(selected.rows, selected.cols),
        })
      }
      aria-label="Table size picker"
      style={{
        display: 'inline-block',
        userSelect: 'none',
      }}
    >
      <Flex justify={'center'}>
        <InitialiseGrid
          padding={4}
          $cellSize={CELL_SIZE}
          $gap={GAP}
          $maxHeight={Math.min(maxRows, 10) * (CELL_SIZE + GAP)}
          $maxWidth={Math.min(maxCols, 10) * (CELL_SIZE + GAP)}
          $maxRows={maxRows}
          $maxCols={maxCols}
        >
          {Array.from({ length: maxRows }).map((_, rIdx) =>
            Array.from({ length: maxCols }).map((__, cIdx) => {
              const rowCount = rIdx + 1
              const colCount = cIdx + 1
              const highlighted = rowCount <= effectiveRows && colCount <= effectiveCols
              const isSelected = rowCount <= selected.rows && colCount <= selected.cols
              return (
                <Button
                  key={`${rowCount}-${colCount}`}
                  onMouseEnter={() => setHover({ rows: rowCount, cols: colCount })}
                  onClick={() => {
                    handleCommit(rowCount, colCount)
                  }}
                  role="button"
                  aria-pressed={isSelected}
                  tone={highlighted ? 'primary' : 'default'}
                  mode={highlighted ? 'default' : 'ghost'}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    boxSizing: 'border-box',
                  }}
                  disabled={readOnly}
                />
              )
            }),
          )}
        </InitialiseGrid>
      </Flex>
      <Flex align={'center'} justify={'space-around'} gap={3}>
        <Box>
          <Text size={1}>Selected: {`${hover.rows} × ${hover.cols}`}</Text>
        </Box>

        <Button
          onClick={() => {
            setSelected({ rows: 0, cols: 0 })
            setHover({ rows: 0, cols: 0 })
          }}
          mode={'bleed'}
          aria-label="Clear selection"
          fontSize={0}
          muted
          text={'Clear'}
          disabled={readOnly}
        />
      </Flex>
    </Card>
  )
}
export default InitialiseTable
