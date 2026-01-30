import { EditorConfig, EditorProvider } from '@portabletext/editor'
import { Card } from '@sanity/ui'
import { ComponentType, Suspense, useCallback, useRef, useState } from 'react'
import { ArrayDefinition, ArraySchemaType, InputProps, pathToString, PortableTextBlock, useFormValue } from 'sanity'

import LoadingIndicator from '../components/LoadingIndicator'
import content from '../schemas/content'
import ButtonToolbar from './components/context-menu-toolbar/ButtonToolbar'
import CustomListenerPlugin from './components/EventListenerPlugin'
import { LinkPlugin } from './components/LinkPlugin'
import { StyledPortableTextEditable } from './components/StyledPortableTextEditable'
import { renderAnnotation } from './configs/renderer/renderAnnotation'
import { renderBlock } from './configs/renderer/renderBlock'
import renderDecorator from './configs/renderer/renderDecorators'
import { renderListItem } from './configs/renderer/renderListItem'
import renderStyle from './configs/renderer/renderStyle'
import { EmojiPickerPlugin } from './emoji-picker/EmojiPicker'
import { SlashCommandPickerPlugin } from './pte-slash-commands/SlashCommandPicker'

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
   * Defaults to {@link content} schema
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
  // STATES
  const [focused, setFocused] = useState<boolean>(false)
  const handleFocus = useCallback((state: boolean) => setFocused(state), [])
  // * INITIAL CONFIG FOR EDITOR PROVIDER
  const initialConfig = useRef<EditorConfig>({
    initialValue: props.value,
    readOnly: props.readOnly ?? false,

    // @ts-ignore
    schema: props.schemaType // TODO verify where the TS error is coming from here
      ? props.schemaType
      : // Backup so that undefined schemaType doesn't break the component
        content,
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
        {/* eslint-disable-next-line react-hooks/refs */}
        <EditorProvider initialConfig={initialConfig.current}>
          <CustomListenerPlugin
            _id={_id}
            _type={_type}
            path={props.path}
            handleFocus={handleFocus}
          />
          <SlashCommandPickerPlugin />
          <LinkPlugin />
          <EmojiPickerPlugin />

          <StyledPortableTextEditable
            renderStyle={renderStyle}
            renderDecorator={renderDecorator}
            renderBlock={renderBlock}
            renderListItem={renderListItem}
            renderAnnotation={renderAnnotation}
          />
          {!props.readOnly && <ButtonToolbar focused={focused} editorRef={initialConfig} />}
        </EditorProvider>
      </Card>
    </Suspense>
  )
}

export default ContentPortableTextInput
