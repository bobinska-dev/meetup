import { Card, Flex, Text } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { defineArrayMember, defineType, useClient } from 'sanity'
import styled from 'styled-components'
import NumberedHeadingPTEInput from '../../components/input/NumberedHeadingPTEInput'

export default defineType({
  name: 'counterBody',
  title: 'Counter Body',
  type: 'array',
  components: {
    input: NumberedHeadingPTEInput,
  },
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        {
          title: 'H1',
          value: 'h1',
          component: (props) => (
            <Text as={'span'} size={4} weight={'bold'} className={'h1-counter'}>
              {props.children}
            </Text>
          ),
        },
        {
          title: 'H2',
          value: 'h2',
          component: (props) => (
            <Text as={'span'} size={3} weight={'bold'} className={'h2-counter'}>
              {props.children}
            </Text>
          ),
        },
        {
          title: 'H3',
          value: 'h3',
          component: (props) => (
            <Text as={'span'} size={3} weight={'semibold'} className={'h3-counter'}>
              {props.children}
            </Text>
          ),
        },
        {
          title: 'H4',
          value: 'h4',
          component: (props) => (
            <Text as={'span'} size={3} weight={'semibold'} className={'h4-counter'}>
              {props.children}
            </Text>
          ),
        },
      ],
    },

    defineArrayMember({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
      components: {
        preview: (props) => {
          // get the client and setup state for image url
          const client = useClient({ apiVersion: '2025-00-01' })
          const [imageUrl, setImageUrl] = useState<string | null>(null)
          const Wrapper = styled(Card)`
            max-height: 400px;

            [data-ui='Media'] > img {
              max-height: 400px;
            }
          `
          // fetch the image url from the media asset reference
          useEffect(() => {
            // @ts-expect-error
            if (props.media && props.media?._ref) {
              client
                // @ts-expect-error
                .fetch(`*[_id == $id][0].url`, { id: props.media?._ref })
                .then((url: string) => {
                  setImageUrl(`${url}?w=400&h=200&fit=max`)
                })
                .catch((err) => console.error(err))
            }
          }, [props.media])

          return (
            <Wrapper>
              <Flex justify={'space-between'} align={'center'} paddingX={3}>
                {props.title && <>{props.title}</>}
                {!props.title && (
                  <Text muted size={0}>
                    No caption or title provided ...
                  </Text>
                )}
                <>{props.actions}</>
              </Flex>

              <Flex justify={'center'} align={'center'} padding={3}>
                <Card>
                  {imageUrl && <img src={imageUrl} alt={props.title as string} />}
                  {!imageUrl && (
                    <Card tone={'caution'} paddingX={8} paddingY={4}>
                      <Text>No image selected yet... </Text>
                    </Card>
                  )}
                </Card>
              </Flex>
            </Wrapper>
          )
        },
      },
    }),
  ],
})
