import { ComponentType } from 'react'
import { Box, Button, Text, Tooltip } from '@sanity/ui'
import { ToolbarDecoratorSchemaType, useDecoratorButton } from '@portabletext/toolbar'

const DecoratorButton: ComponentType<{ decorator: ToolbarDecoratorSchemaType }> = ({
  decorator,
}) => {
  const decoratorButton = useDecoratorButton({ schemaType: decorator })
  return (
    <Tooltip
      content={
        <Box padding={2}>
          <Text size={1}>{decorator.title}</Text>
        </Box>
      }
    >
      <Button
        key={decorator.name}
        onClick={() => decoratorButton.send({ type: 'toggle' })}
        selected={decoratorButton.snapshot.matches({ enabled: 'active' })}
        aria-selected={decoratorButton.snapshot.matches({ enabled: 'active' })}
        icon={decorator.icon}
        as={'button'}
        padding={2}
        tone={'default'}
        mode={'bleed'}
      />
    </Tooltip>
  )
}
export default DecoratorButton
