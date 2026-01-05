import { Stack } from '@sanity/ui'
import { ComponentType } from 'react'
import { ArrayOfObjectsInputProps } from 'sanity'

/** ### Array Input Component without any array functions (like "Add Item" button)
 */
export const DeletionLogInputComponent: ComponentType<ArrayOfObjectsInputProps> = (props) => {
  return (
    <>
      <Stack space={4}>
        {/* Remove the Add Item button below the Array input */}
        {props.renderDefault({ ...props, arrayFunctions: () => null })}
      </Stack>
    </>
  )
}
