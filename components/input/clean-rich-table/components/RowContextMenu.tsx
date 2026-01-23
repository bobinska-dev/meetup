import { ComponentType } from 'react'
import { Button, Menu, MenuButton, MenuDivider, MenuItem } from '@sanity/ui'
import { EllipsisVerticalIcon } from '@sanity/icons'
import { SanityClient } from 'sanity'

interface RowContextMenuProps {
  rowIndex: number
  rowKey: string
  client: SanityClient
  _id: string
  path: string
}

/** # Menu button for each row in the table
 *
 * Menu items for adding, moving, and deleting rows.
 *
 * Currently, the move row functionality is disabled.
 */
const RowContextMenu: ComponentType<RowContextMenuProps> = (props) => {
  return (
    <MenuButton
      button={<Button icon={EllipsisVerticalIcon} mode={'bleed'} />}
      id="row-menu-button"
      menu={
        <Menu>
          <MenuItem text="Add row above" />
          <MenuItem text="Add row below" />
          <MenuDivider />
          <MenuItem text="Move row ↑" disabled onClick={() => console.log('moved')} />
          <MenuItem text="Move row ↓" disabled onClick={() => console.log('moved')} />
          <MenuDivider />
          <MenuItem text="Delete row" />
        </Menu>
      }
      popover={{ placement: 'right', portal: true }}
    />
  )
}
export default RowContextMenu
