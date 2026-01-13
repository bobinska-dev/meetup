import {EventListenerPlugin} from '@portabletext/editor/plugins'
import {ComponentType} from 'react'
import {getPublishedId, Path, pathToString, useDocumentOperation} from 'sanity'

const CustomListenerPlugin: ComponentType<{
  path: Path
  _id: string
  _type: string
  // on: (event: EditorEmittedEvent) => void
}> = (props) => {
  const {_id, _type, path} = props
  const {patch} = useDocumentOperation(getPublishedId(_id), _type)
  return (
    <EventListenerPlugin
      on={(event) => {
        // * HANDLE MUTATION EVENTS
        if (event.type === 'mutation') {
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
        if (event.type === 'selection') {
          // show toolbar on selection change above the selection
          console.log('Selection changed:', event.selection)
        }

        /* DOES NOT WORK ALSO
 if (event.type === 'patch') {
   const preparedPatch = {
     ...event.patch,
     path: [...props.path, ...event.patch.path],
   }
   if (event.patch.type === 'set') {
     return props.onChange(set(preparedPatch))
   }
   if (event.patch.type === 'unset') {
     return props.onChange(unset([...props.path, ...event.patch.path]))
   }
   if (event.patch.type === 'diffMatchPatch') {
     return props.onChange(diffMatchPatch(event.patch.value, preparedPatch.path))
   }
   if (event.patch.type === 'insert') {
     return props.onChange(insert(preparedPatch))
   }
   if (event.patch.type === 'setIfMissing') {
     return props.onChange(setIfMissing(preparedPatch))
   }
   return
 }
*/
      }}
    />
  )
}
export default CustomListenerPlugin
