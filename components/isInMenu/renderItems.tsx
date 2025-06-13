import { AddCircleIcon, EditIcon } from '@sanity/icons'
import { Button, Card, Flex, Stack, Text } from '@sanity/ui'
import { Path } from 'sanity'
import { HomeDummy } from '.'
import { Settings } from '../../sanity.types'

export const renderItems = ({
  path,
  items,
  title,
  openPane,
}: {
  path: Path
  items: Settings['menu'] | Settings['quickLinks'] | HomeDummy[] | undefined
  title: string
  openPane: (path: Path) => void
}) => {
  return (
    <Stack space={3} paddingX={3}>
      {/*
       * * * * Title * * * *
       */}
      <Card paddingTop={3}>
        <Text as={'h3'} weight="semibold" size={1}>
          {title}
        </Text>
      </Card>
      {/*
       * * * * No items -> buttons to settings fields to add a new items for this page * * * *
       */}
      {!items && (
        <Card padding={3} shadow={1}>
          <Flex justify={'space-between'} align={'center'}>
            <Card>
              <Text size={1}>This page is not part of the {title}</Text>
            </Card>
            <Button
              text={`Add to the ${title}`}
              onClick={() => openPane(path)}
              icon={AddCircleIcon}
              mode="ghost"
              padding={2}
            />
          </Flex>
        </Card>
      )}
      {/*
       * * * * Items with IntentButtons * * * *
       */}
      {items && (
        <Stack space={3}>
          {items.map((item, index: number) => {
            return (
              <Card key={item._key} padding={3} shadow={1}>
                <Flex justify={'space-between'} align={'center'}>
                  <Text as={'h4'} weight="semibold" size={1}>
                    {/* If item is of type MenuItemValue, return item.title, if not a string `This page is part of the Quicklinks as the ${item.index+1}th item` */}
                    {item._type === 'menuItem'
                      ? item.isNested
                        ? // @ts-ignore
                          item.title + ' → ' + item.menuItems[0]?.title
                        : item.title
                      : item._type === 'home'
                        ? 'This page is set as the Home Page'
                        : `This page is part of the Quick Links array as the ${index + 1}. item`}
                  </Text>
                  <Button
                    text={`Edit in ${title}`}
                    onClick={() => openPane(path)}
                    icon={EditIcon}
                    mode="ghost"
                    padding={2}
                  />
                </Flex>
              </Card>
            )
          })}
        </Stack>
      )}
    </Stack>
  )
}
