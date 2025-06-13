import { Card, Stack, Text } from '@sanity/ui'
import { Subscription } from 'rxjs'
import { apiVersion } from '../../lib/api'

import { ComponentType, useEffect, useMemo, useState } from 'react'
import { BooleanInputProps, Path, getIdPair, useClient, useFormValue } from 'sanity'
import { renderItems } from './renderItems'

import { useRouter, useRouterState } from 'sanity/router'
import { RouterPanes } from 'sanity/structure'
import { Settings } from '../../sanity.types'
import { sleep } from '../../utils/sleep'

export interface HomeDummy {
  _ref: string
  _type: 'home'
  _key: string
}

/** ## InMenuInput
 *
 * This component is used to render the input for the `isInMenu` field in the Sanity Studio.
 *
 */
const InMenuInput: ComponentType<BooleanInputProps> = (props) => {
  const client = useClient({ apiVersion }).withConfig({
    perspective: 'previewDrafts',
  })
  const documentId = useFormValue(['_id']) as string
  const documentType = useFormValue(['_type']) as string

  // * Router states for panes and navigation functions
  const { navigate } = useRouter()
  const routerState = useRouterState()
  // * Get the current router pane groups that are open
  const routerPaneGroups = useMemo<RouterPanes>(
    () => (routerState?.panes || []) as RouterPanes,
    [routerState?.panes],
  )

  // * Open a new pane with the settings document to the right of current routerState
  const openPane = (path: Path) => {
    const nextPanes: RouterPanes = [
      // keep existing panes
      ...routerPaneGroups.filter((group) => group[0].id !== 'settings'),
      [
        {
          id: 'settings',
          params: {
            type: 'settings',
          },
        },
      ],
    ]

    navigate(
      {
        panes: nextPanes,
      },
      { replace: true },
    )
  }
  const [loading, setLoading] = useState(true)
  const [menuItems, setMenuItems] = useState<Settings['menu'] | HomeDummy[] | undefined>()
  const [footerQuickLinks, setFooterQuickLinks] = useState<Settings['quickLinks'] | undefined>()
  const { publishedId } = getIdPair(documentId)

  let subscription: Subscription
  // fetch settings doc and get menu
  useEffect(() => {
    setLoading(true)

    const settingsQuery = `*[_type == "settings"][0]{
      homePage._ref == $documentId => { "homePage": { "_ref": homePage._ref, "_type": 'home' } },
      "firstMenuItems": menu[link._ref == $documentId],
      "nestedMenuItems": menu[]{
        ...,
        "menuItems":select(count(menuItems[link._ref == $documentId]) > 0 => menuItems[link._ref == $documentId], null),
        }[menuItems != null],
      "footerQuickLinks": quickLinks[_ref == $documentId]
      }{
        "menuItems": array::compact([homePage, ...firstMenuItems, ...nestedMenuItems]), footerQuickLinks,
      }`
    const params = { documentId: publishedId }
    const fetchSettings = async (listening = false) => {
      listening && (await sleep(1500)) // chances are the data isn't query-able yet, so we wait a bit

      await client
        .fetch(settingsQuery, params)
        .then((res) => {
          res.menuItems.length > 0 && setMenuItems(res.menuItems)
          res.footerQuickLinks.length > 0 && setFooterQuickLinks(res.footerQuickLinks)
          setLoading(false)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
    // since we store our referenced data in a state we need to make sure, we also listen to changes
    const listen = () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      subscription = client
        .listen(settingsQuery, params, { visibility: 'query' })
        .subscribe(() => fetchSettings(true))
    }
    publishedId ? fetchSettings().then(listen) : null

    // and then we need to cleanup after ourselves, so we don't get any memory leaks
    return function cleanup() {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return (
    <Card>
      <Stack space={2}>
        <Card>
          <Text weight="semibold" as={'h2'} size={1} id="pagePlacement">
            Page Placement Settings
          </Text>
        </Card>
        {loading && (
          <Card padding={3}>
            <Text style={{ fontStyle: 'italic' }} size={1} muted>
              Loading...
            </Text>
          </Card>
        )}
        {!loading &&
          documentType !== 'news' &&
          renderItems({
            title: 'Menu',
            items: menuItems,
            openPane: openPane,
            path: ['menu', 'menuItems'],
          })}
        {!loading &&
          renderItems({
            title: 'Footer Quick Links',
            items: footerQuickLinks,
            openPane: openPane,
            path: ['quickLinks'],
          })}
      </Stack>
    </Card>
  )
}
export default InMenuInput
