import React, { KeyboardEvent, useEffect, useState } from 'react'
import { Button, Card, Flex, Text } from '@sanity/ui'

type TableSize = { rows: number; cols: number }

interface InitialiseTableProps {
  maxRows?: number
  maxCols?: number
  value?: TableSize
  onChange?: (rows: number, cols: number) => void
  // optional label or small help text
  label?: string
}

const CELL_SIZE = 28
const GAP = 6

const InitialiseTable: React.FC<InitialiseTableProps> = ({
  maxRows = 10,
  maxCols = 10,
  value,
  onChange,
  label,
}) => {
  const [selected, setSelected] = useState<TableSize>({
    rows: value?.rows ?? 0,
    cols: value?.cols ?? 0,
  })
  console.log(selected)
  const [hover, setHover] = useState<TableSize>({ rows: 0, cols: 0 })

  useEffect(() => {
    if (value) setSelected({ rows: value.rows, cols: value.cols })
  }, [value])

  const commit = (r: number, c: number) => {
    setSelected({ rows: r, cols: c })
    onChange?.(r, c)
  }

  const effectiveRows = hover.rows || selected.rows
  const effectiveCols = hover.cols || selected.cols

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // change selection with arrow keys, commit with Enter
    let { rows, cols } = selected
    if (e.key === 'ArrowUp') {
      rows = Math.max(0, rows - 1)
      setSelected({ rows, cols })
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      rows = Math.min(maxRows, rows + 1)
      setSelected({ rows, cols })
      e.preventDefault()
    } else if (e.key === 'ArrowLeft') {
      cols = Math.max(0, cols - 1)
      setSelected({ rows, cols })
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      cols = Math.min(maxCols, cols + 1)
      setSelected({ rows, cols })
      e.preventDefault()
    } else if (e.key === 'Enter') {
      onChange?.(rows, cols)
      e.preventDefault()
    }
  }

  return (
    <Card padding={3}>
      {label && (
        <Text size={1} style={{ marginBottom: 8 }}>
          {label}
        </Text>
      )}
      <Flex
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseLeave={() => setHover({ rows: 0, cols: 0 })}
        aria-label="Table size picker"
        style={{
          display: 'inline-block',
          padding: 8,
          borderRadius: 6,
          border: '1px solid var(--card-border-color, #e6e6e6)',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: GAP,
            gridTemplateColumns: `repeat(${maxCols}, ${CELL_SIZE}px)`,
            marginBottom: 12,
            overflow: 'auto',
            maxWidth: Math.min(maxCols, 10) * (CELL_SIZE + GAP),
            maxHeight: Math.min(maxRows, 10) * (CELL_SIZE + GAP),
            padding: 6,
            background: 'transparent',
          }}
        >
          {Array.from({ length: maxRows }).map((_, rIdx) =>
            Array.from({ length: maxCols }).map((__, cIdx) => {
              const r = rIdx + 1
              const c = cIdx + 1
              const highlighted = r <= effectiveRows && c <= effectiveCols
              const isSelected = r <= selected.rows && c <= selected.cols
              return (
                <Button
                  key={`${r}-${c}`}
                  onMouseEnter={() => setHover({ rows: r, cols: c })}
                  onClick={() => commit(r, c)}
                  role="button"
                  aria-pressed={isSelected}
                  tone={highlighted ? 'primary' : 'default'}
                  mode={highlighted ? 'default' : 'ghost'}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    boxSizing: 'border-box',
                  }}
                />
              )
            }),
          )}
        </div>

        <Flex align={'center'} justify={'space-between'} gap={3}>
          <Text size={1}>Selected:</Text>
          <div style={{ padding: '4px 8px', borderRadius: 4 }}>
            <Text size={1}>{`${selected.rows} × ${selected.cols}`}</Text>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected({ rows: 0, cols: 0 })
              setHover({ rows: 0, cols: 0 })
              onChange?.(0, 0)
            }}
            style={{
              marginLeft: 'auto',
              border: 'none',
              background: 'transparent',
              color: '#666',
              cursor: 'pointer',
            }}
            aria-label="Clear selection"
          >
            Clear
          </button>
        </Flex>
      </Flex>
    </Card>
  )
}

export default InitialiseTable
