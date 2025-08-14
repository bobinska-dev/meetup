import { Box, Card, Stack, Text } from '@sanity/ui'
import { ComponentType, useEffect, useState } from 'react'
import { Subscription } from 'rxjs'
import {
  getIdPair,
  ObjectInputProps,
  SanityDefaultPreview,
  useClient,
  useFormValue,
  useSchema,
} from 'sanity'
import { usePaneRouter } from 'sanity/structure'
import sleep from '../../utils/sleep'

// type for the incoming reference results
type IncomingRefResult = { _type: string; _id: string; title: string }[]

// * * * MAIN COMPONENT * * *
export const IncomingRefIndicator: ComponentType<ObjectInputProps> = (props) => {
  // * Value you will need for the query
  const documentId = useFormValue(['_id']) as string
  // * Get the published ID
  const { publishedId } = getIdPair(documentId)

  // * Narrow down, which document types you want to show incoming references from
  const documentTypes = ['page', 'testDocument']

  // * Studio client
  const client = useClient({ apiVersion: '2025-08-01' }).withConfig({
    perspective: 'drafts',
  })

  // * State to store the incoming references
  const [incomingRefs, setIncomingRefs] = useState<IncomingRefResult>([])

  //* listen for changes incoming references
  let subscription: Subscription

  useEffect(() => {
    // Query: fetch all incoming references to this document if they match the document types
    const queryWithNarrowedTypes = `*[ _type in $types && references($id) ]{ _id, _type, title }`
    // * Query: fetch all incoming references to this document
    const query = `*[ references($id) ]{ _id, _type, title }`

    // add your own query params here if you need them
    const params = { id: publishedId, types: documentTypes }

    const fetchIncomingRefList = async (listening = false) => {
      // listen but with a timeout to debounce the listener
      listening && (await sleep(1500))

      // * Fetch the incoming references
      await client
        .fetch(query, params)
        .then((res) => {
          setIncomingRefs(res)
        })
        .catch((err) => {
          console.error(err.message)
        })
    }

    const listen = () => {
      subscription = client
        .listen(query, params, {
          visibility: 'query',
          tag: `incomingRefs-for-${publishedId}`,
        })
        .subscribe(() => fetchIncomingRefList(true))
    }

    fetchIncomingRefList().then(listen)

    // * Cleanup
    // Never forget to unsubscribe from the listener
    return function cleanup() {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return (
    <Card>
      {incomingRefs && (
        <Card tone="primary" marginBottom={4} padding={4} shadow={1}>
          <Box paddingBottom={4}>
            <Text size={2} weight="semibold">
              Incoming references
            </Text>
          </Box>
          <Stack space={3}>{renderIncomingRefs(incomingRefs)}</Stack>
        </Card>
      )}
      {/*
       * *  comment the next line if you want to use it as a standalone component somewhere else (not inside of a field or input
       */}
      {props.renderDefault(props)}
    </Card>
  )
}

// * * * REFERENCE LINK COMPONENT * * *
const ReferenceLink: ComponentType<{ _type: string; _id: string; title: string }> = (props) => {
  const { _id, _type, title } = props
  const schemaType = useSchema().get(_type)
  const Icon = schemaType?.icon

  const { ReferenceChildLink } = usePaneRouter()
  return (
    <Card as="li" style={{ cursor: 'pointer', textDecoration: 'none' }} shadow={1} radius={3}>
      <ReferenceChildLink
        documentId={_id}
        documentType={_type}
        parentRefPath={[]}
        //@ts-ignore
        style={{ textDecoration: 'none' }}
      >
        <SanityDefaultPreview
          title={title ?? 'Document Type: ' + schemaType?.title}
          schemaType={schemaType}
          icon={Icon}
        />
      </ReferenceChildLink>
    </Card>
  )
}

// * * * RENDER EACH INCOMING REF * * *

const renderIncomingRefs = (incomingRefs: IncomingRefResult) => {
  return incomingRefs?.map((reference) => <ReferenceLink {...reference} key={reference._id} />)
}
