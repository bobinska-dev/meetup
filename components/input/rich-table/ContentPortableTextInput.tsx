import {
  ArrayDefinition,
  ArraySchemaType,
  getPublishedId,
  InputProps,
  PortableTextBlock,
  useDocumentOperation,
  useFormValue,
} from 'sanity'
import { ComponentType, useRef } from 'react'
import { Card } from '@sanity/ui'
import { EditorConfig, EditorProvider } from '@portabletext/editor'
import { StyledPortableTextEditable } from './StyledPortableTextEditable'
import CustomEventListenerPlugin from './event-listener-plugin/CustomEventListenerPlugin'
import renderDecorator from './portable-text-configs/renderDecorators'
import renderStyle from './portable-text-configs/renderStyle'
import CustomToolbar from './toolbar/CustomToolbar'

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

const ContentPortableTextInput: ComponentType<ContentPortableTextInputProps> = (props) => {
  // * MISC
  const _id = useFormValue(['_id']) as string
  const _type = useFormValue(['_type']) as string
  const { patch } = useDocumentOperation(getPublishedId(_id), _type)

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

  return (
    <Card shadow={1} style={{ height: '100%' }} tone={'default'}>
      <EditorProvider initialConfig={initialConfig.current}>
        <CustomEventListenerPlugin _id={_id} _type={_type} path={props.path} />
        <CustomToolbar />

        <StyledPortableTextEditable
          renderStyle={renderStyle}
          renderDecorator={renderDecorator}
          renderBlock={(props) => <div>{props.children}</div>}
          renderListItem={(props) => <>{props.children}</>}
        />
      </EditorProvider>
    </Card>
  )
}

export default ContentPortableTextInput
