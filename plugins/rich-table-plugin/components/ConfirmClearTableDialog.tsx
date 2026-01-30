import { Box, Button, Dialog, Flex, Stack, Text } from '@sanity/ui'
import { ComponentType, useCallback } from 'react'
import { OperationsAPI } from 'sanity'

interface ConfirmClearTableDialogProps {
  /** Patch function from Sanity document operations for optimistic changes */
  patch: OperationsAPI['patch']
  path: string
  onClose: () => void
  open: boolean
}
const ConfirmClearTableDialog: ComponentType<ConfirmClearTableDialogProps> = ({
  patch,
  path,
  onClose,
  open,
}) => {
  const handleConfirm = useCallback(() => {
    patch.execute([{ unset: [path] }])
    return onClose()
  }, [patch, path, onClose])
  return (
    <Dialog
      id={'confirm-clear-table-dialog'}
      header="Clear table value completely"
      width={1}
      onClose={onClose}
      open={open}
    >
      <Stack space={4} padding={4}>
        <Box>
          <Text size={1} weight={'semibold'}>
            Are you sure you want to clear the entire table?
          </Text>
        </Box>
        <Box>
          <Text muted size={1}>
            You will be able to re-initialise the table afterwards, but all current data will be
            lost. If you want to undo this, you will need to use the Review Changes panel in the
            History inspector to revert the changes (potentially one by one).
          </Text>
        </Box>
        <Flex justify={'flex-end'} gap={3}>
          <Button text={'Cancel'} mode={'ghost'} onClick={onClose} tone={'critical'} />
          <Button text={'Confirm'} mode={'ghost'} onClick={handleConfirm} tone={'positive'} />
        </Flex>
      </Stack>
    </Dialog>
  )
}
export default ConfirmClearTableDialog
