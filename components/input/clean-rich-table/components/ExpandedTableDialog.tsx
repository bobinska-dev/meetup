import { ComponentType } from 'react'
import { ObjectInputProps, SanityClient } from 'sanity'
import { RichTableType } from '../../rich-table/RichTableInput'
import { Dialog, Flex } from '@sanity/ui'
import Table from './Table'

const ExpandedTableDialog: ComponentType<
  ObjectInputProps<RichTableType> & {
    _id: string
    handleClose?: () => void
    isInDialog?: boolean
    client: SanityClient
  }
> = ({ isInDialog = true, client, _id, value, onChange, ...props }) => {
  return (
    <Dialog
      id={'expanded-table-dialog'}
      width={4}
      header="Expanded table editor"
      onClose={props.handleClose}
    >
      <Flex padding={3} justify={'center'}>
        <Table
          {...props}
          isInDialog={true}
          client={client}
          _id={_id}
          value={value}
          onChange={onChange}
        />
      </Flex>
    </Dialog>
  )
}
export default ExpandedTableDialog
