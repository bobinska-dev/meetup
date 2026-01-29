import { RenderBlockFunction } from '@portabletext/editor'

export const renderBlock: RenderBlockFunction = (props) => {
  return <div style={{ padding: '5px 0' }}>{props.children}</div>
}
