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
              {/* DECORATORS */}
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
              {/* ANNOTATIONS */}
              {toolbarSchema.annotations?.map((annotation) => {
                const annotationButton = useAnnotationButton({ schemaType: annotation })
                return (
                  <MenuItem
                    key={annotation.name}
                    onClick={() =>
                      annotationButton.snapshot.matches({ enabled: 'active' })
                        ? annotationButton.send({ type: 'remove' })
                        : annotationButton.send({
                            type: 'add',
                            annotation: {
                              value: annotation.name === 'link' ? { href: '' } : {},
                            },
                          })
                    }
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
              {/* LISTS */}
              {toolbarSchema.lists?.map((list) => {
                const listButton = useDecoratorButton({ schemaType: list })
                return (
                  <MenuItem
                    key={list.name}
                    onClick={() => listButton.send({ type: 'toggle' })}
                    selected={listButton.snapshot.matches({ enabled: 'active' })}
                    text={
                      list.icon ? (
                        <Inline space={2}>
                          <list.icon />
                          <Text size={0} muted>
                            {list.name}
                          </Text>
                        </Inline>
                      ) : (
                        list.title
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
