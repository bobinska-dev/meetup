import { ToolbarSchema, useDecoratorButton } from '@portabletext/toolbar'
import { Box, Button, Card, Menu, MenuButton, MenuItem, Text, Tooltip } from '@sanity/ui'
import { ComponentType } from 'react'
import { ColorWheelIcon } from '@sanity/icons'

const DecoratorDropdown: ComponentType<{ toolbarSchema: ToolbarSchema }> = ({ toolbarSchema }) => {
  return (
    <Card borderRight>
      <MenuButton
        button={
          <Tooltip
            portal
            content={
              <Box padding={3}>
                <Text>Decorators</Text>
              </Box>
            }
          >
            <Button
              size={1}
              fontSize={1}
              padding={2}
              mode={'bleed'}
              iconRight={<ColorWheelIcon />}
              tone={'default'}
            />
          </Tooltip>
        }
        id={'decorator-selection'}
        menu={
          <Menu>
            {toolbarSchema.decorators?.map((decorator) => {
              const decoratorButton = useDecoratorButton({ schemaType: decorator })
              return (
                <MenuItem
                  key={decorator.name}
                  onClick={() => decoratorButton.send({ type: 'toggle' })}
                  selected={decoratorButton.snapshot.matches({ enabled: 'active' })}
                  text={decorator.icon ? <decorator.icon /> + decorator.title! : decorator.title}
                  as={'button'}
                  padding={2}
                  tone={'default'}
                />
              )
            })}
          </Menu>
        }
      />
    </Card>
  )
}
export default DecoratorDropdown
