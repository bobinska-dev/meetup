import { ComponentType } from 'react'
import { Button, Menu, MenuButton, MenuDivider, MenuItem } from '@sanity/ui'
import { EllipsisVerticalIcon } from '@sanity/icons'
import { OperationsAPI } from 'sanity'
import { RichTableRowType } from '../../../../schemaTypes/rich-table/row.object'

interface RowContextMenuProps {
  rowIndex: number
  row: RichTableRowType
  /** Patch function from Sanity document operations for optimistic changes */
  patch: OperationsAPI['patch']
  path: string
  handleOpen?: () => void
}

/** # Menu button for each row in the table
 *
 * Menu items for adding, moving, and deleting rows.
 *
 * @param rowIndex - Index of the row
 * @param row - {@link RichTableRowType} The row object
 * @param patch - {@link OperationsAPI.patch} function from Sanity document operations for optimistic changes
 * @param path - {@link Path} to the row in the Sanity document
 */
const RowContextMenu: ComponentType<RowContextMenuProps> = ({
  row,
  rowIndex,
  patch,
  path,
  handleOpen,
}) => {
  return (
    <MenuButton
      button={<Button icon={EllipsisVerticalIcon} mode={'bleed'} padding={1} />}
      id="row-menu-button"
      menu={
        <Menu>
          {<MenuItem text="Edit row title" onClick={handleOpen} />}
          <MenuDivider />
          <MenuItem text="Add row above" disabled />
          <MenuItem text="Add row below" disabled />
          <MenuDivider />
          <MenuItem text="Move row ↑" onClick={() => console.log('moved')} disabled />
          <MenuItem text="Move row ↓" onClick={() => console.log('moved')} disabled />
          <MenuDivider />
          <MenuItem text="Delete row" disabled />
        </Menu>
      }
      popover={{ placement: 'right', portal: true }}
    />
  )
}
export default RowContextMenu
