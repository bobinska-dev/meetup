import { ToolbarSchema, useAnnotationButton, useDecoratorButton } from '@portabletext/toolbar'
import { Box, Button, Card, Inline, Menu, MenuButton, MenuItem, Text, Tooltip } from '@sanity/ui'
import { ComponentType } from 'react'
import { ChevronDownIcon, TextIcon } from '@sanity/icons'

const DecoratorDropdown: ComponentType<{ toolbarSchema: ToolbarSchema }> = ({ toolbarSchema }) => {
  return (
    <Tooltip
      portal
      content={
        <Box padding={3}>
          <Text size={1}>Decorators</Text>
        </Box>
      }
    >
      <Card borderLeft>
        <MenuButton
          button={
            <Button
              size={1}
              fontSize={1}
              padding={2}
              mode={'bleed'}
              icon={<TextIcon />}
              iconRight={<ChevronDownIcon />}
              tone={'default'}
            />
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
                    text={
                      decorator.icon ? (
                        <Inline space={2}>
                          <decorator.icon />{' '}
                          <Text size={0} muted>
                            {decorator.name}
                          </Text>
                        </Inline>
                      ) : (
                        decorator.title
                      )
                    }
                    as={'button'}
                    padding={2}
                    tone={'default'}
                  />
                )
              })}
              {toolbarSchema.annotations?.map((annotation) => {
                const annotationButton = useAnnotationButton({ schemaType: annotation })

                return (
                  <MenuItem
                    key={annotation.name}
                    onClick={() => annotationButton.send({ type: 'add' })}
                    selected={annotationButton.snapshot.matches({ enabled: 'active' })}
                    text={
                      annotation.icon ? (
                        <Inline space={2}>
                          <annotation.icon />{' '}
                          <Text size={0} muted>
                            {annotation.name}
                          </Text>
                        </Inline>
                      ) : (
                        annotation.title
                      )
                    }
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
    </Tooltip>
  )
}
export default DecoratorDropdown
