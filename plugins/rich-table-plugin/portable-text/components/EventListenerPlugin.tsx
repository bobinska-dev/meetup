import { EventListenerPlugin } from '@portabletext/editor/plugins'
import { ComponentType } from 'react'
import { getPublishedId, Path, pathToString, useDocumentOperation } from 'sanity'

const CustomListenerPlugin: ComponentType<{
  path: Path
  _id: string
  _type: string
  handleFocus: (state: boolean) => void
  // on: (event: EditorEmittedEvent) => void
}> = (props) => {
  const { _id, _type, handleFocus } = props
  const { patch } = useDocumentOperation(getPublishedId(_id), _type)
  return (
    <EventListenerPlugin
      on={(event) => {
        if (event.type === 'focused') {
          handleFocus(true)
        }
        if (event.type === 'blurred') {
          handleFocus(false)
        }
        if (event.type === 'mutation') {
          // * HANDLE MUTATION EVENTS
          const preparedPatches = event.patches.map((patch) => {
            if (patch.type === 'unset') {
              return {
                unset: [pathToString([...props.path, ...patch.path])],
              }
            }

            if (patch.type === 'insert') {
              return {
                insert: {
                  [patch.position]: pathToString([...props.path, ...patch.path]),
                  items: patch.items,
                },
              }
            }
            return {
              [patch.type]: {
                [pathToString([...props.path, ...patch.path])]: patch.value,
              },
            }
          })
          patch.execute(preparedPatches)
          // props.onChange(preparedPatches) // THIS DOES NOT WORK, but TS errors are too weird for me to understand
        }

        // * HANDLE SELECTION EVENTS
        /*if (event.type === 'selection') {
          // show toolbar on selection change above the selection
          console.log('Selection changed:', event)
        }*/
      }}
    />
  )
}
export default CustomListenerPlugin
