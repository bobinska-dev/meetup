import { AddIcon, EditIcon } from '@sanity/icons'
import { Button, Flex, Stack } from '@sanity/ui'
import { uuid } from '@sanity/uuid'
import groq from 'groq'
import { ComponentType, useEffect, useMemo, useState } from 'react'
import { Subscription } from 'rxjs'
import {
  ArrayOfObjectsInputProps,
  TitledListValue,
  useClient,
  useCurrentUser,
  useFormValue,
} from 'sanity'
import { useRouter, useRouterState } from 'sanity/router'
import { RouterPanes } from 'sanity/structure'

import { apiVersion } from '../../lib/api'
import LoadingIndicator from '../LoadingIndicator'

interface TitledListValueWithDescription extends TitledListValue<string> {
  description: string
}

const DynamicListInput: ComponentType<ArrayOfObjectsInputProps> = (props) => {
  // * Initialize the Studio client
  const client = useClient({ apiVersion }).withConfig({
    perspective: 'previewDrafts',
  })

  // * Initialize the router and get the pane groups
  const { navigate } = useRouter()
  const routerState = useRouterState()
  // * Cast the panes to RouterPanes
  const routerPaneGroups = useMemo<RouterPanes>(
    () => (routerState?.panes || []) as RouterPanes,
    [routerState?.panes],
  )

  // * Get the current user
  const currentUser = useCurrentUser()

  // * Get the language
  const documentLanguage = useFormValue(['language'])

  // * States
  const [listOptions, setListOptions] = useState<TitledListValueWithDescription[]>([])
  const [loading, setLoading] = useState(true)

  // * Fetch and subscribe to the listOption documents
  let subscription: Subscription
  useEffect(() => {
    const query = groq`*[_type == "listOption"] | order(title asc) { 
      "_key": _id, 
      "title": coalesce(
        internationalisedTitle[ _key == $documentLanguage ][0].value,
        title,
        "No title or translation available"
      ), 
      "value": value.current, 
      "_type": 'dynamicListItem',
      description
    }`

    const params = {
      documentLanguage,
    }
    const listen = () => {
      subscription = client
        .listen(query, params, {
          visibility: 'query',
          tag: `dynamic-list-input-${props.id}`,
          includeResult: false,
        })
        .subscribe(() =>
          client.fetch(query, params).then((data) => {
            setListOptions(data)
            setLoading(false)
          }),
        )
    }

    client
      .fetch(query, params)
      .then((data) => {
        setListOptions(data)
        setLoading(false)
      })
      .then(listen)
      .finally(() => setLoading(false))

    // * Cleanup
    // Never forget to unsubscribe from the listener
    return function cleanup() {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  if (loading) return <LoadingIndicator />

  /** Opens a pane with new listOption document to the right of the current ones */
  const handleAddOption = () => {
    const nextPanes: RouterPanes = [
      // keep existing panes
      ...routerPaneGroups,
      [
        {
          id: uuid(),
          params: {
            type: 'listOption',
            template: 'listOption',
          },
        },
      ],
    ]

    navigate({
      panes: nextPanes,
    })
  }

  // * Check if the current user is an admin to show the edit options button
  const isAdmin = currentUser?.roles?.some((role) => role.name === 'administrator')

  return (
    <Stack space={2}>
      {props.renderDefault({
        ...props,
        schemaType: {
          ...props.schemaType,
          options: {
            ...props.schemaType.options,
            list: listOptions,
          },
        },
      })}
      {isAdmin && (
        <Flex gap={4} paddingY={2} align={'center'} justify={'flex-start'}>
          <Button
            mode="ghost"
            fontSize={0}
            text="Edit options"
            icon={EditIcon}
            onClick={() =>
              navigate({
                panes: [[{ id: 'siteSettings' }], [{ id: 'listOption' }]],
              })
            }
          />

          <Button
            mode="ghost"
            fontSize={0}
            onClick={handleAddOption}
            icon={AddIcon}
            text="Add new option"
          />
        </Flex>
      )}
    </Stack>
  )
}

export default DynamicListInput
