import {
  ArrayDefinition,
  ArraySchemaType,
  InputProps,
  pathToString,
  PortableTextBlock,
  useFormValue,
} from 'sanity'
import { ComponentType, Suspense, useRef, useState } from 'react'
import { Card } from '@sanity/ui'
import { EditorConfig, EditorProvider } from '@portabletext/editor'
import { StyledPortableTextEditable } from './components/StyledPortableTextEditable'
import CustomListenerPlugin from './components/EventListenerPlugin'
import renderDecorator from './configs/renderer/renderDecorators'
import renderStyle from './configs/renderer/renderStyle'
import LoadingIndicator from '../../../LoadingIndicator'
import { SlashCommandPickerPlugin } from './pte-slash-commands/SlashCommandPicker'
import { renderListItem } from './configs/renderer/renderListItem'
import { renderAnnotation } from './configs/renderer/renderAnnotation'
import { LinkPlugin } from './components/LinkPlugin'

// import { useFullscreenPTE } from './hooks/useFullScreenPTE'

interface ContentPortableTextInputProps {
  /** used for initial value */
  value: PortableTextBlock[] | undefined
  /** The path is used in the onChange Handler - so it can be relative and absolute ? */ // TODO find this out
  path: InputProps['path']
  /** should be synced to the original fields readOnly */
  readOnly?: InputProps['readOnly']
  /** onChange handler */
  onChange: InputProps['onChange']
  /** pass down the richText definition of your choice
   * Defaults to:
   * ```ts
   * {
   *  name: 'cellPTE',
   *  type: 'array',
   *  of: [
   *    {
   *      type: 'block',
   *    },
   *  ],
   * }
   * ```
   */
  schemaType?: ArraySchemaType<PortableTextBlock> | ArrayDefinition
}

/** # ContentPortableTextInput
 * A Portable Text Input component for the rich table solution.
 */
const ContentPortableTextInput: ComponentType<ContentPortableTextInputProps> = (props) => {
  // * MISC
  const _id = useFormValue(['_id']) as string
  const _type = useFormValue(['_type']) as string

  const [focus, setFocus] = useState<boolean>(false)
  // * INITIAL CONFIG FOR EDITOR PROVIDER
  const initialConfig = useRef<EditorConfig>({
    initialValue: props.value,
    readOnly: props.readOnly ?? false,

    // @ts-ignore
    schema: props.schemaType // TODO verify where the TS error is coming from here
      ? props.schemaType
      : // Backup so that undefined schemaType doesn't break the component
        {
          name: 'cellPTE',
          type: 'array',
          of: [
            {
              type: 'block',
            },
          ],
        },
  })

  // TODO: fullscreen handling
  // const { getFullscreenPath, setFullscreenPath } = useFullscreenPTE()

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Card
        tone={'default'}
        id={`portable-text-${pathToString(props.path)}`}
        border
        style={{ position: 'relative' }}
      >
        <EditorProvider initialConfig={initialConfig.current}>
          <CustomListenerPlugin _id={_id} _type={_type} path={props.path} />
          <SlashCommandPickerPlugin />
          <LinkPlugin />
          {/*<CustomToolbar focus={focus} />*/}

          <StyledPortableTextEditable
            renderStyle={renderStyle}
            renderDecorator={renderDecorator}
            renderBlock={(props) => <div style={{ padding: '5px 0' }}>{props.children}</div>}
            renderListItem={renderListItem}
            renderAnnotation={renderAnnotation}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        </EditorProvider>
      </Card>
    </Suspense>
  )
}

export default ContentPortableTextInput
