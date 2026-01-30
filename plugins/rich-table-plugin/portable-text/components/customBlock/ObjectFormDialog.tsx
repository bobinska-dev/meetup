import { ComponentType } from 'react'
import { Dialog } from '@sanity/ui'
import { BlockObjectButtonEvent, ToolbarBlockObjectSchemaType } from '@portabletext/toolbar'

// TODO: Implement the form fields based on blockObject schema
const ObjectFormDialog: ComponentType<{
  open: boolean
  onClose: () => void
  blockObject: ToolbarBlockObjectSchemaType
  send: (event: BlockObjectButtonEvent) => void
}> = ({ open, onClose, blockObject, send }) => {
  return (
    <Dialog
      id={'object-form-dialog'}
      // open={open}
      onClose={onClose}
      header={'Edit ' + blockObject.title}
      zOffset={100}
    >
      hello
    </Dialog>
  )
}
export default ObjectFormDialog
