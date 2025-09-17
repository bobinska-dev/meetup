import { Card, Tab, TabList, TabPanel } from '@sanity/ui'
import groq from 'groq'
import { ComponentType, useEffect, useState } from 'react'
import { TbEditCircle, TbEyePlus } from 'react-icons/tb'
import {
  ArrayOfObjectsInputProps,
  ReferenceSchemaType,
  ReferenceValue,
  TitledListValue,
  useClient,
  useFormValue,
} from 'sanity'
import { getQueryResultsNames } from '../../utils/getQueryResiltsNames'

import RefArrayTagPanel from './RefArrayTagPanel'

export interface ReferenceValueWithKey extends ReferenceValue {
  _key: string
}

const ArrayOfReferencesSelectInput: ComponentType<
  ArrayOfObjectsInputProps<ReferenceValueWithKey>
> = (props) => {
  // * Miscellaneous
  const { value, renderDefault, path, onItemRemove, onItemAppend } = props
  // Transform value to match expected type
  const typedValue = value as ReferenceValueWithKey[] | undefined
  const docLanguage = useFormValue(['language']) as string | undefined

  const client = useClient({
    apiVersion: '2025-09-01',
  }).withConfig({
    perspective: 'drafts',
  })

  // get the schema type names from all possible references
  const toSchemaTypeNames = props.schemaType?.of
    .map((type) => (type as ReferenceSchemaType).to?.map((referenceType) => referenceType.name))
    .flat()

  // TODO: -> get reference option filters (if they exist) and apply to query
  const referenceOptionFilters = props.schemaType?.of.map((type) =>
    (type as ReferenceSchemaType).to?.map((referenceType) => referenceType.options.filter),
  )

  const docId = useFormValue(['_id']) as string
  const query = groq`*[_type in $types] { "value": {"_ref": _id, "_type": "reference"}, "title": coalesce(  internationalisedTitle[_key == $language][0].value, title, name, label, 'no name'), _type } | order(title asc) `
  const params = { types: toSchemaTypeNames, language: docLanguage }

  /*
   * States
   */
  /** all possible references as titled list values */
  const [optionsList, setOptionsList] = useState<TitledListValue<ReferenceValueWithKey>[]>([])

  /** the currently selected tab id */
  const [tabId, setTabId] = useState('tags')

  /*
   * Get possible reference data on 1st load
   */
  useEffect(() => {
    getQueryResultsNames({
      query,
      client,
      params,
    })
      .then((result) => {
        setOptionsList(result)
      })
      .catch(console.error)
  }, [])

  return (
    <>
      <TabList space={2}>
        <Tab
          aria-controls="tags-panel"
          icon={TbEyePlus}
          id="tags-tab"
          label="Tags"
          onClick={() => setTabId('tags')}
          selected={tabId === 'tags'}
        />

        <Tab
          aria-controls="default-panel"
          icon={TbEditCircle}
          id="default-tab"
          label="Default"
          onClick={() => setTabId('default')}
          selected={tabId === 'default'}
        />
      </TabList>
      <TabPanel aria-labelledby="tags-tab" hidden={tabId !== 'tags'} id="tags-panel">
        <RefArrayTagPanel
          optionsList={optionsList}
          value={typedValue}
          path={path}
          onItemRemove={onItemRemove}
          onItemAppend={onItemAppend}
        />
      </TabPanel>

      {/*
       * Default input for array of references
       */}
      <TabPanel aria-labelledby="default-tab" hidden={tabId !== 'default'} id="default-panel">
        <Card marginTop={2} padding={4} radius={2} shadow={1}>
          {renderDefault(props as ArrayOfObjectsInputProps<any>)}
        </Card>
      </TabPanel>
    </>
  )
}
export default ArrayOfReferencesSelectInput
