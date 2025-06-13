import { Box } from '@sanity/ui'
import groq from 'groq'
import { useEffect, useMemo, useState } from 'react'
import { Subscription } from 'rxjs'
import { useClient } from 'sanity'
import { useRouter, useRouterState } from 'sanity/router'
import { RouterPanes, UserViewComponent } from 'sanity/structure'
import { Page } from '../../sanity.types'
import LoadingIndicator from '../LoadingIndicator'

const HomeTranslationView: UserViewComponent = (props) => {
  console.log(props)
  const { documentId, document } = props
  const client = useClient({ apiVersion: '2024-01-29' }).withConfig({
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
  console.log(routerPaneGroups)

  // * Get the language
  const documentLanguage = document.displayed?.language as string | undefined

  // * States
  const [loading, setLoading] = useState(true)
  const [translations, setTranslations] = useState<Page[] | []>([])

  // * Fetch and subscribe to the listOption documents
  let subscription: Subscription
  useEffect(() => {
    const query = groq`*[ _type == 'translation.metadata' && $documentId in translations[].value._ref ][0].translations[ value._ref != $documentId ]->{
        _id,
        title,
        language,
        _type
      
    }`
    const params = {
      documentId: props.documentId,
    }

    // * Listen to changes in the translations
    const listen = () => {
      subscription = client
        .listen(query, params, {
          visibility: 'query',
          tag: `homepage-translations`,
          includeResult: false,
        })
        .subscribe(() =>
          client.fetch(query, params).then((data) => {
            setTranslations(data)
            setLoading(false)
          }),
        )
    }

    // * Fetch the initial translations
    client
      .fetch(query, params)
      .then((data) => {
        setTranslations(data)
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
  }, [props.documentId])

  /** Opens the translated documents to the right of the current document */
  const handleOpentranslation = (translationId: string) => {
    const nextPanes: RouterPanes = [
      // keep existing panes
      ...routerPaneGroups,
      [
        {
          id: translationId,
          params: {
            type: 'page',
            //template: 'listOption',
          },
        },
      ],
    ]

    navigate({
      panes: nextPanes,
    })
  }

  /* 
  - fetch all translations of the currently selected home page
  - display them in a list based on the item components see for more https://github.com/bobinska-dev/meetup/blob/06f70f941ef5fa0258772f4bde47cd91bc0feeb1/components/tools/personalDashboard/components/Dashboard.tsx#L60-L74
   */
  if (loading) return <LoadingIndicator />
  return <Box></Box>
}
export default HomeTranslationView
