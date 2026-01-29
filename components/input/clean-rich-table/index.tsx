import { ChangeEvent, ComponentType, Suspense, useCallback, useState } from 'react'
import {
  getPublishedId,
  ObjectInputProps,
  pathToString,
  useClient,
  useDocumentOperation,
  useFormValue,
} from 'sanity'
import { RichTableType } from '../rich-table/RichTableInput'
import LoadingIndicator from '../../LoadingIndicator'
import { Box, Button, Flex, Inline, Stack, Switch, Text, Tooltip } from '@sanity/ui'
import InitialiseTable from './components/InitialiseTable'
import Table from './components/Table'
import { ExpandIcon } from '@sanity/icons'
import ExpandedTableDialog from './components/ExpandedTableDialog'
import { useToggleTitles } from './hooks/useToggleTitles'

// TODO: read only for new documents that do not yet exist OR way to detect if document has yet to be created
const RichTable: ComponentType<ObjectInputProps<RichTableType> & { isInPortableText?: boolean }> = (
  props,
) => {
  const client = useClient({ apiVersion: '2026-01-01' }).withConfig({
    requestTagPrefix: 'rich-table-input',
  })
  const _id = useFormValue(['_id']) as string
  const _type = useFormValue(['_type']) as string

  // Document operations -> with optimistic changes
  const { patch } = useDocumentOperation(getPublishedId(_id), _type)

  const pathString = pathToString(props.path)

  // * Debug mode
  const [debug, setDebug] = useState(false)
  const handleDebugChange = useCallback(() => setDebug(!debug), [debug])
  // * Expand table dialog
  const [openDialog, setOpenDialog] = useState(false)
  const handleOpen = useCallback(() => setOpenDialog(true), [])
  const handleClose = useCallback(() => setOpenDialog(false), [])

  const { hasColumnTitles, hasRowTitles } = props.value
  const { toggleColumnTitles, toggleRowTitles } = useToggleTitles(
    hasColumnTitles,
    hasRowTitles,
    patch,
    pathString,
  )
  return (
    <Stack space={4}>
      <Suspense fallback={<LoadingIndicator />} name={'RichTableInput Suspense'}>
        {!props.value?.rows && (
          <InitialiseTable
            _id={_id}
            client={client}
            path={pathString}
            isInPortableText={props.isInPortableText}
          />
        )}
        {props.value && props.value.rows && (
          <>
            <Box>
              {/* EXPAND TABLE BUTTON */}
              <Flex justify={'flex-end'}>
                <Tooltip
                  content={
                    <Box>
                      <Text size={1}>Expand table</Text>
                    </Box>
                  }
                  portal
                >
                  <Button
                    iconRight={ExpandIcon}
                    onClick={handleOpen}
                    mode={'bleed'}
                    fontSize={0}
                    text={'Expand table'}
                    muted
                  />
                </Tooltip>
              </Flex>

              <Table
                {...props}
                isInDialog={false}
                _id={_id}
                handleOpen={handleOpen}
                patch={patch}
                // We need this key to force remounting the table when opening/closing the dialog
                key={openDialog ? 'table-in-dialog-open' : 'table-in-dialog-closed'}
              />
            </Box>
            {openDialog && (
              <ExpandedTableDialog
                {...props}
                isInDialog={true}
                handleClose={handleClose}
                patch={patch}
                _id={_id}
              />
            )}
          </>
        )}
      </Suspense>
      {/* DEBUG SWITCH*/}
      <Flex justify={'space-between'} align={'center'} gap={2} key={`debug-switch-${openDialog}`}>
        <Inline space={2}>
          <Switch
            checked={debug}
            onChange={handleDebugChange}
            label={'Open field to debug'}
            id={'debug-toggle'}
          />
          <Text as={'label'} htmlFor={'debug-toggle'} size={0} muted>
            Debug mode
          </Text>
        </Inline>
        <Flex gap={3} justify={'flex-end'} align={'center'}>
          <Inline space={2}>
            <Text as={'label'} htmlFor={'row-title-toggle'} size={0} muted>
              Show row titles
            </Text>
            <Switch
              checked={hasRowTitles}
              role="switch"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                toggleRowTitles(e.currentTarget.checked)
              }
              label={'Show row titles'}
              id={'row-title-toggle'}
            />
          </Inline>
          <Inline space={2}>
            <Text as={'label'} htmlFor={'column-title-toggle'} size={0} muted>
              Show column titles
            </Text>
            <Switch
              checked={hasColumnTitles}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                toggleColumnTitles(e.currentTarget.checked)
              }
              label={'Show column titles'}
              id={'column-title-toggle'}
            />
          </Inline>
        </Flex>
      </Flex>
      {debug &&
        // Default inputs (rows, columnHeaders)
        props.renderDefault(props)}
    </Stack>
  )
}
export default RichTable
