import { ComponentType } from 'react'
import { ToolbarAnnotationSchemaType, useAnnotationPopover } from '@portabletext/toolbar'
import { Card, Popover } from '@sanity/ui'

// TODO: solve issue with floating boundary and positioning
// https://sanity-io.slack.com/archives/C02SJP6ULS0/p1769189650118819

const AnnotationPopover: ComponentType<{
  schemaTypes: ReadonlyArray<ToolbarAnnotationSchemaType>
}> = (props) => {
  const annotationPopover = useAnnotationPopover(props)

  if (
    annotationPopover.snapshot.matches('disabled') ||
    annotationPopover.snapshot.matches({ enabled: 'inactive' })
  ) {
    return null
  }
  // Cast the ref's current value to HTMLElement | null to satisfy the Popover prop type
  const referenceEl = annotationPopover.snapshot.context.elementRef?.current as HTMLElement | null

  return (
    <Popover
      open
      animate
      arrow
      content={
        <Card tone={'critical'} padding={3} border>
          hello
        </Card>
      }
      floatingBoundary={referenceEl}
    />
  )
}
export default AnnotationPopover
