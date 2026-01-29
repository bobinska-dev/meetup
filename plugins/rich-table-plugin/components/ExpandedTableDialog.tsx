import { ComponentType } from 'react'
import { ObjectInputProps, OperationsAPI } from 'sanity'

import { Dialog, Flex } from '@sanity/ui'
import Table from './Table'
import { RichTableType } from '../schemas/richTable.object'

const ExpandedTableDialog: ComponentType<
  ObjectInputProps<RichTableType> & {
    handleClose?: () => void
    isInDialog?: boolean
    /** Patch function from Sanity document operations for optimistic changes */
    patch: OperationsAPI['patch']
  }
> = ({ isInDialog = true, patch, value, onChange, ...props }) => {
  return (
    <Dialog
      id={'expanded-table-dialog'}
      width={4}
      header="Expanded table editor"
      onClose={props.handleClose}
    >
      <Flex padding={3} justify={'center'}>
        <Table {...props} isInDialog={true} patch={patch} value={value} onChange={onChange} />
      </Flex>
    </Dialog>
  )
}
export default ExpandedTableDialog
