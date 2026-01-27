import { ComponentType } from 'react'
import { ToolbarListSchemaType, useListButton } from '@portabletext/toolbar'
import { Button } from '@sanity/ui'

const ListButton: ComponentType<{ list: ToolbarListSchemaType }> = ({ list }) => {
  const listButton = useListButton({ schemaType: list })

  return (
    <Button
      key={list.name}
      onClick={() => listButton.send({ type: 'toggle' })}
      selected={listButton.snapshot.matches({ enabled: 'active' })}
      icon={list.icon}
      padding={2}
      tone={'default'}
      mode={'bleed'}
      aria-selected={listButton.snapshot.matches({ enabled: 'active' })}
    />
  )
}
export default ListButton
