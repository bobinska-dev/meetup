import { ComponentType, ReactElement, RefObject, useCallback, useEffect, useState } from 'react'
import { useAnnotationPopover, useToolbarSchema } from '@portabletext/toolbar'
import extendDecorator from '../../configs/extendDecorators'
import extendStyle from '../../configs/extendStyles'

const AnnotationPopover: ComponentType<{
  children: ReactElement
  content: ReactElement
  title: string
  ref: RefObject<null>
  annotationValue: any
}> = (props) => {
  const { ref, annotationValue } = props
  const [open, setOpen] = useState(false)
  const handleToggleOpenClose = useCallback(() => {
    setOpen(!open)
  }, [])
  const [value, setValue] = useState<string>(annotationValue.href as string)
  const toolbarSchema = useToolbarSchema({
    extendDecorator,
    extendStyle,
  })
  const annotationPopover = useAnnotationPopover({ schemaTypes: toolbarSchema.annotations! })

  useEffect(() => {
    // close popover when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !(ref.current as any).contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}
