import { ComponentType } from 'react'
import { Box, Button, Text, Tooltip } from '@sanity/ui'
import { ToolbarBlockObjectSchemaType, useBlockObjectButton } from '@portabletext/toolbar'
import ObjectFormDialog from '../customBlock/ObjectFormDialog'

// TODO: fix issue with Dialog disappearing -> Christian please help
const BlockButton: ComponentType<{ blockObject: ToolbarBlockObjectSchemaType }> = ({
  blockObject,
}) => {
  const { snapshot, send } = useBlockObjectButton({ schemaType: blockObject })
  return (
    <>
      <Tooltip
        content={
          <Box padding={2}>
            <Text size={1}>{blockObject.title}</Text>
          </Box>
        }
      >
        <Button
          key={blockObject.name}
          onClick={
            () => {
              send({
                type: 'insert',
                value: blockObject.defaultValues || { _type: blockObject.name },
                placement: 'auto',
              })
              send({ type: 'open dialog' })
            }
            /*() =>
            send({
              type: 'insert',
              value: blockObject.defaultValues || {},
              placement: 'auto',
            })*/
          }
          icon={blockObject.icon}
          as={'button'}
          padding={2}
          tone={'default'}
          mode={'bleed'}
          title={blockObject.shortcut?.keys.join('+')}
        />
      </Tooltip>
      {snapshot.matches({ enabled: 'showing dialog' }) === true && (
        <ObjectFormDialog
          open={true}
          onClose={() => send({ type: 'close dialog' })}
          blockObject={blockObject}
          send={send}
        />
      )}
    </>
  )
}
export default BlockButton
