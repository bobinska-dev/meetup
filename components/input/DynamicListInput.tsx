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
import { dataset } from '../../lib/api'
import LoadingIndicator from '../LoadingIndicator'

const DynamicListInput: ComponentType<ArrayOfObjectsInputProps> = (props) => {
  // * Initialize the Studio client
  const client = useClient({ apiVersion: '2025-03-01' }).withConfig({
    perspective: 'previewDrafts',
    dataset: dataset,
  })

  // * Initialize the router and get the pane groups
  const { navigate } = useRouter()
  const routerState = useRouterState()
  // * Cast the panes to RouterPanes
  const routerPaneGroups = useMemo<RouterPanes>(
    () => (routerState?.panes || []) as RouterPanes,
    [routerState?.panes],
  )
  // * Get the language
  const documentLanguage = useFormValue(['language'])

  // * Get the current user
  const currentUser = useCurrentUser()

  // * States
  const [listOptions, setListOptions] = useState<TitledListValue<string>[]>([])
  const [loading, setLoading] = useState(true)

  // * Fetch and subscribe to the listOption documents
  let subscription: Subscription
  useEffect(() => {
    const query = groq`*[_type == "listOption"] | order(title asc) {  
      "title": coalesce(
        internationalisedTitle[ _key == $documentLanguage ][0].value,
        title,
        "No title or translation available"
      ), "_type": 'dynamicListItem', "value": { "_ref": _id, _type} }`

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

    documentLanguage &&
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
  }, [documentLanguage])

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
        // TODO: Add better onChange handler (at the moment any change is overridding the whole array and we want to be more granular)
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
                panes: [[{ id: 'listOption' }]],
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
