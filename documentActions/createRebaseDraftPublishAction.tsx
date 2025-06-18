import { diffInput, wrap } from '@sanity/diff'
import { Box, Button, Card, Flex, Stack, Text } from '@sanity/ui'
import { useMemo, useState } from 'react'
import { TbArrowsJoin2 } from 'react-icons/tb'
import { useObservable } from 'react-rx'
import {
  ChangeList,
  DocumentActionComponent,
  DocumentActionProps,
  DocumentActionsContext,
  ObjectDiff,
  ObjectSchemaType,
  useEvents,
  useSchema,
} from 'sanity'
import { DocumentChangeContext } from 'sanity/_singletons'

const DIFF_INITIAL_VALUE = {
  diff: null,
  loading: true,
  error: null,
}
export function createRebaseDraftPublishAction(
  originalAction: DocumentActionComponent,
  context: DocumentActionsContext,
): DocumentActionComponent {
  return (props: DocumentActionProps) => {
    // this is the default publish action
    const originalResult = originalAction(props)
    // the draft and published versions of the document
    const { draft, published } = props

    const [isDialogOpen, setDialogOpen] = useState<boolean>(false)

    // Since I dont want people to think about the lastPublishedAt field, I will remove it from the diff and hide it in the field definition
    function removeLastPublishedAtFromDiff(diff: ObjectDiff) {
      // Remove the lastPublishedAt field from the diff if it exists
      if (diff.fields && diff.fields.lastPublishedAt) {
        const { lastPublishedAt, ...restFields } = diff.fields
        return {
          ...diff,
          fields: restFields,
        }
      }
      return diff
    }

    // this is a snippet also used in the ChangeList component in the "Review changes" inspector
    const rootDiff = useMemo(() => {
      const diff = diffInput(
        wrap(published ?? {}, { author: '' }),
        wrap(draft ?? {}, { author: '' }),
      ) as ObjectDiff

      return diff
    }, [published, draft])

    // We even start using the events instead of the documentChangeStore to get the changes list
    const { getChangesList } = useEvents()
    const changesList$ = useMemo(() => getChangesList(), [getChangesList])

    const {
      diff,
      loading: diffLoading,
      error: diffError,
    } = useObservable(changesList$, DIFF_INITIAL_VALUE)

    const schema = useSchema().get(props.type) as ObjectSchemaType

    // if this is a draft without a published version, or the draft is still based on the latest published document version we don't want to show the custom part of the action
    if (!published || !draft || draft.lastPublishedAt === published.lastPublishedAt)
      return originalResult

    // if the draft is out of sync we want to show the custom action
    return {
      ...originalResult,
      label: 'Resync draft and publish',
      icon: TbArrowsJoin2,
      onHandle: () => {
        setDialogOpen(true)
      },
      /*
       * * DIALOG * *
       */
      dialog: isDialogOpen && {
        type: 'dialog',
        onClose: () => {
          setDialogOpen(false)
        },
        header: 'Resync draft with published',
        description:
          'A new version has been published since this draft was created. You need to choose which changes you need to reverse and which to keep.',
        content: (
          <>
            <Stack space={4} padding={4}>
              {diffError && (
                <Card tone="critical" padding={4}>
                  <Stack space={4}>
                    <Text size={1} weight="medium">
                      An error occurred while fetching changes:
                    </Text>
                    <Text size={0} muted>
                      {diffError?.message}
                    </Text>
                  </Stack>
                </Card>
              )}
              <style>
                {`
                  [data-ui="diff-card"] {
                      --diff-card-radius: 0.1875rem;
                      --diff-card-bg-color: #13141b;
                      max-width: 100%;
                      position: relative;
                      border-radius: var(--diff-card-radius);
                      background-color: rgb(70, 26, 50);
                      color: rgb(252, 222, 233);
                  }
                `}
              </style>
              {!diffError && (
                <>
                  <Stack space={2}>
                    <Card padding={4} radius={2} tone="caution" border>
                      <Text size={2} weight="medium">
                        The draft is out of sync with the published version. The following changes
                        highlight the differences between the{' '}
                        <strong>latest published version</strong> and the current draft (with the
                        published version shown as struck through). You can choose to keep (ignore)
                        or revert each change.
                      </Text>
                    </Card>
                  </Stack>

                  <DocumentChangeContext.Provider
                    value={{
                      documentId: props.id,
                      schemaType: schema,
                      rootDiff,
                      isComparingCurrent: true,
                      FieldWrapper: (props) => props.children,
                      value: draft,
                      showFromValue: true,
                    }}
                  >
                    <Box paddingY={1}>
                      <ChangeList
                        diff={removeLastPublishedAtFromDiff(rootDiff)}
                        schemaType={schema}
                      />
                    </Box>
                  </DocumentChangeContext.Provider>

                  <Card padding={4} radius={2} tone="caution">
                    <Text size={1} muted>
                      NB: All changes that were not reversed will be published when you confirm and
                      override the current published document values.
                    </Text>
                  </Card>
                  <Flex gap={4} justify={'flex-end'} align="center">
                    <Button
                      text={'Confirm all changes and publish draft'}
                      mode={'ghost'}
                      tone="positive"
                      onClick={originalResult?.onHandle}
                    />
                  </Flex>
                </>
              )}
            </Stack>
          </>
        ),
      },
    }
  }
}
