import { ComponentType, useCallback, useEffect, useRef, useState } from 'react'
import FloatingButton from './FloatingButton'
import { useEditor } from '@portabletext/editor'
import { useToolbarSchema } from '@portabletext/toolbar'
import extendDecorator from '../../configs/extendDecorators'
import extendStyle from '../../configs/extendStyles'
import { extendList } from '../../configs/extendList'
import { extendBlockObject } from '../../configs/extendBlockObject'
import { extendInlineObject } from '../../configs/extendInlineObject'
import { extendAnnotation } from '../../configs/extendAnnotation'
import { EllipsisVerticalIcon } from '@sanity/icons'
import { Box, Card, Flex, Popover } from '@sanity/ui'
import StyleSelector from '../StyleSelector'
import DecoratorButton from './DecoratorButton'
import AnnotationButton from './AnnotationButton'
import ListButton from './ListButton'
import AnnotationPopover from '../annotation/AnnotationPopover'

/** A floating button toolbar for rich text editing, providing access to styles, decorators, annotations, and lists.
 *
 * @returns A React component rendering a floating button that opens a toolbar popover for rich text editing.
 *
 * ## Usage
 * ```tsx
 *  // in the `EditorProvider` and before the `PortableTextEditable`
 *  <ButtonToolbar />
 * ```
 */
const ButtonToolbar: ComponentType = () => {
  const editor = useEditor()
  const toolbarSchema = useToolbarSchema({
    extendDecorator,
    extendAnnotation,
    extendStyle,
    extendList,
    extendBlockObject,
    extendInlineObject,
  })

  // STATES
  const [open, setOpen] = useState(false)
  const handleOpenClick = useCallback(() => {
    if (open === true) return setOpen(false)
    setOpen(true)
  }, [open])

  // Use concrete element types so TS accepts the refs where needed.
  // triggerRef is the actual button element (no wrapper div, so FloatingButton stays floating 🏝️
  // ).
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  // Close popover on outside click (but not on internal clicks)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!open) return

      const composedPath = (event as any).composedPath?.() || (event as any).path || []
      if (composedPath && composedPath.length) {
        if (triggerRef.current && composedPath.includes(triggerRef.current)) return
        if (popoverRef.current && composedPath.includes(popoverRef.current)) return
        setOpen(false)
        return
      }

      // Fallback for browsers without composedPath
      const target = event.target as Node | null
      if (triggerRef.current && target && triggerRef.current.contains(target)) return
      if (popoverRef.current && target && popoverRef.current.contains(target)) return
      setOpen(false)
    }

    // Use 'click' so internal button clicks fire before the close handler
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [open])

  // open popover when keyboard shortcut (cmd+shift+t) is pressed and the PTE is focused

  useEffect(() => {
    const handleHotkey = (e: KeyboardEvent) => {
      const target = e.target as Node | null
      if (
        e.shiftKey &&
        e.metaKey &&
        e.key === 'o' &&
        triggerRef.current?.parentNode &&
        target &&
        triggerRef.current?.parentNode?.contains(target)
      ) {
        setOpen((prev) => !prev)
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handleHotkey)

    return () => window.removeEventListener('keydown', handleHotkey)
  }, [])

  return (
    <>
      <Popover
        open={open}
        id={'context-menu-toolbar-popover'}
        placement="bottom"
        content={
          <Box ref={popoverRef}>
            <Flex padding={3} justify={'space-between'} gap={1}>
              {/* TOOLBAR CONTENT */}
              <StyleSelector toolbarSchema={toolbarSchema} />
              {toolbarSchema.decorators &&
                toolbarSchema.decorators?.map((decorator) => (
                  <DecoratorButton key={decorator.name} decorator={decorator} />
                ))}
              <Card borderRight />
              {toolbarSchema.annotations &&
                toolbarSchema.annotations?.map((annotation) => (
                  <AnnotationButton key={annotation.name} annotation={annotation} />
                ))}
              <Card borderRight />
              {/* LISTS */}
              {toolbarSchema.lists?.map((list) => (
                <ListButton key={list.name} list={list} />
              ))}
            </Flex>
          </Box>
        }
        portal
        arrow
        zOffset={5}
      >
        <FloatingButton
          fontSize={0}
          mode={'bleed'}
          icon={EllipsisVerticalIcon}
          onClick={handleOpenClick}
          padding={1}
          // cast the ref because FloatingButton is a custom component whose forwarded ref type may differ;
          // the concrete ref type keeps TS happy elsewhere.
          ref={triggerRef as unknown as React.Ref<HTMLButtonElement>}
          style={{ display: 'inline-block' }}
          title="Open text formatting toolbar (⇧⌘O)"
        />
      </Popover>
      {toolbarSchema.annotations && <AnnotationPopover schemaTypes={toolbarSchema.annotations} />}
    </>
  )
}
export default ButtonToolbar
