import {ToolbarSchema, useDecoratorButton} from '@portabletext/toolbar'
import {Button, Flex, Text} from '@sanity/ui'
import {ComponentType} from 'react'

const Decorators: ComponentType<{toolbarSchema: ToolbarSchema}> = ({toolbarSchema}) => {
  return (
    <Flex gap={1}>
      {toolbarSchema.decorators?.map((decorator) => {
        const decoratorButton = useDecoratorButton({schemaType: decorator})
        return (
          <Button
            type="button"
            onClick={() => decoratorButton.send({type: 'toggle'})}
            selected={decoratorButton.snapshot.matches({enabled: 'active'})}
            mode={'bleed'}
            padding={2}
            key={decorator.name}
            tone={'default'}
          >
            <Text size={1}>
              {decorator.icon && <decorator.icon />}
              {decorator.title}
            </Text>
          </Button>
        )
      })}
    </Flex>
  )
}
export default Decorators
