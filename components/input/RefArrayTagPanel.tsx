import { Button, Card, Flex, Stack, Text, TextInput } from '@sanity/ui'
import { randomKey } from '@sanity/util/content'
import { ComponentType, useState } from 'react'
import { TbLetterX } from 'react-icons/tb'
import { Path, TitledListValue } from 'sanity'
import { ReferenceValueWithKey } from './ArrayOfReferencesSelectInput'

const RefArrayTagPanel: ComponentType<{
  optionsList: TitledListValue<ReferenceValueWithKey>[]
  value: ReferenceValueWithKey[] | undefined
  path: Path
  onItemRemove: (itemKey: string) => void
  onItemAppend: (item: ReferenceValueWithKey) => void
}> = (props) => {
  const { optionsList, value, onItemRemove, onItemAppend } = props

  //* States
  /** the search input value */
  const [searchTerm, setSearchTerm] = useState<string>('')

  //* Handlers
  const handleRemoveTag = (itemKey: string) => {
    onItemRemove(itemKey)
  }
  const handleAppend = (item: ReferenceValueWithKey) => {
    const _key = randomKey(12)
    onItemAppend({ ...item, _key })
  }

  return (
    <Card border marginTop={2} padding={4}>
      <Stack space={4}>
        <Flex gap={3} align={'center'} justify={'flex-start'} wrap="wrap">
          {value?.map((item) => (
            <Card radius={5} padding={2} key={item._key} tone={'primary'}>
              <Flex gap={2} justify={'space-between'} align={'center'}>
                <Text size={1} weight="semibold">
                  {optionsList.find((option) => option.value?._ref === item._ref)?.title ||
                    'Unknown'}
                </Text>
                <Button padding={0} mode="bleed" onClick={() => handleRemoveTag(item._key)}>
                  <Text size={0}>
                    <TbLetterX />
                  </Text>
                </Button>
              </Flex>
            </Card>
          ))}
        </Flex>
        <Flex marginRight={19}>
          <TextInput
            fontSize={1}
            onChange={(event) => {
              setSearchTerm(event.currentTarget.value)
            }}
            padding={3}
            radius={3}
            placeholder="Search Options"
            value={searchTerm}
            type="search"
            id="ref-array-tag-panel-search-input"
          />
        </Flex>
        <Flex
          gap={2}
          align={'center'}
          justify={'flex-start'}
          wrap="wrap"
          id="preview-list"
          data-testid="preview-list"
        >
          {optionsList
            // show only those options that match the search term
            ?.filter((refOption) =>
              refOption.title?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
            )
            .map((refOption) => {
              if (
                !refOption.value ||
                !refOption.value._ref ||
                value?.some((item) => item._ref === refOption.value?._ref)
              ) {
                return null // Skip options without a valid ID/reference
              }
              return (
                <Button
                  padding={2}
                  mode="bleed"
                  onClick={() => handleAppend(refOption.value!)}
                  key={`item-${refOption.value?._ref}`}
                  radius={5}
                >
                  <Text size={1}>{refOption.title}</Text>
                </Button>
              )
            })}
        </Flex>
      </Stack>
    </Card>
  )
}
export default RefArrayTagPanel
