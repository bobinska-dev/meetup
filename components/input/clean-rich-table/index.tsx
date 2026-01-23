import { ComponentType, Suspense, useCallback, useState } from 'react'
import { ObjectInputProps, pathToString, useClient, useFormValue } from 'sanity'
import { RichTableType } from '../rich-table/RichTableInput'
import LoadingIndicator from '../../LoadingIndicator'
import { Box, Button, Flex, Stack, Switch, Text, Tooltip } from '@sanity/ui'
import InitialiseTable from './components/InitialiseTable'
import Table from './components/Table'
import { ExpandIcon } from '@sanity/icons'
import ExpandedTableDialog from './components/ExpandedTableDialog'

// TODO: read only for new documents that do not yet exist
const RichTable: ComponentType<ObjectInputProps<RichTableType>> = (props) => {
  const client = useClient({ apiVersion: '2026-01-01' }).withConfig({
    requestTagPrefix: 'rich-table-input',
  })
  const _id = useFormValue(['_id']) as string
  const pathString = pathToString(props.path)
  // * Debug mode
  const [debug, setDebug] = useState(false)
  const handleDebugChange = useCallback(() => setDebug(!debug), [debug])
  const [openDialog, setOpenDialog] = useState(false)
  const handleOpen = useCallback(() => setOpenDialog(true), [])
  const handleClose = useCallback(() => setOpenDialog(false), [])

  return (
    <Stack space={4}>
      <Suspense fallback={<LoadingIndicator />} name={'RichTableInput Suspense'}>
        {!props.value && <InitialiseTable _id={_id} client={client} path={pathString} />}
        {props.value && (
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
                client={client}
                _id={_id}
                handleOpen={handleOpen}
                // We need this key to force remounting the table when opening/closing the dialog
                key={openDialog ? 'table-in-dialog-open' : 'table-in-dialog-closed'}
              />
            </Box>
            {openDialog && (
              <ExpandedTableDialog
                {...props}
                isInDialog={true}
                handleClose={handleClose}
                client={client}
                _id={_id}
              />
            )}
          </>
        )}
      </Suspense>
      {/* DEBUG SWITCH*/}
      <Flex justify={'flex-start'} align={'center'} gap={2}>
        <Switch
          checked={debug}
          onChange={handleDebugChange}
          label={'Open field to debug'}
          id={'debug-toggle'}
        />
        <Text as={'label'} htmlFor={'debug-toggle'} size={0} muted>
          Debug mode
        </Text>
      </Flex>
      {debug &&
        // Default inputs (rows, columnHeaders)
        props.renderDefault(props)}
    </Stack>
  )
}
export default RichTable
