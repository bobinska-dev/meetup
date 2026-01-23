
import { RenderDecoratorFunction } from '@portabletext/editor'

const renderDecorator: RenderDecoratorFunction = (props) => {
  if (props.value === 'strong') {
    return <strong>{props.children}</strong>
  }
  if (props.value === 'em') {
    return <em>{props.children}</em>
  }
  if (props.value === 'underline') {
    return <u>{props.children}</u>
  }
  if (props.value === 'code') {
    return (
      <code
        style={{
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
          backgroundColor: 'var(--card-code-bg-color)',
          color: 'var(--card-code-fg-color)',
          padding: '0.125em 0.3em',
          borderRadius: '1px',
          mixBlendMode: 'screen',
        }}
      >
        {props.children}
      </code>
    )
  }
  if (props.value === 'strike-through') {
    return <s>{props.children}</s>
  }
  return <>{props.children}</>
}

export default renderDecorator
