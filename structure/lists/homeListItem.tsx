import { Flex, Stack, Text } from '@sanity/ui'
import { TbHome } from 'react-icons/tb'
import { IntentButton } from 'sanity'
import { type StructureBuilder, type StructureResolverContext } from 'sanity/structure'
import { apiVersion } from '../../lib/api'

export const homeListItem = async (S: StructureBuilder, context: StructureResolverContext) => {
  // * Fetch the client
  const client = context.getClient({ apiVersion }).withConfig({ perspective: 'previewDrafts' })

  // * Fetch the home document defined in the settings
  const homeDocument = await client.fetch(`*[_type == 'settings'][0].homePage._ref`)

  return S.listItem()
    .id('home')
    .title('Home')
    .icon(TbHome)
    .child(
      homeDocument
        ? S.document()
            .id('homePage')
            .schemaType('page')
            .documentId(homeDocument)
            .views([S.view.form()])
        : S.component(() => {
            return (
              <Flex align={'center'} justify={'center'} padding={6}>
                <Stack space={5}>
                  <Text as="h3" weight="semibold">
                    Home page not set
                  </Text>
                  <Text as="p" size={1}>
                    Please select a page to be used as the home page in the site settings.
                  </Text>
                  <Text as="p" size={1} muted>
                    If you have set a page already, you might need to reload the Studio.
                  </Text>
                  <IntentButton
                    intent="edit"
                    mode="ghost"
                    replace={false}
                    params={{
                      id: 'settings',
                      type: 'settings',
                      path: 'homePage',
                    }}
                    text="Add home page to site settings"
                    tooltipProps={{
                      placement: 'top',
                      content: 'Edit the home page Site Settings',
                    }}
                  />
                </Stack>
              </Flex>
            )
          }).id('missingHomePage'),
    )
}
