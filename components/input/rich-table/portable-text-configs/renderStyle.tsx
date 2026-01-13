/* * * * * * RENDER FUNCTIONS */
import {RenderStyleFunction} from '@portabletext/editor'
import {Box, Card, Heading, Text} from '@sanity/ui'

const renderStyle: RenderStyleFunction = (props) => {
  if (props.schemaType.value === 'normal') {
    return (
      <Box paddingBottom={3}>
        <Text size={1}>{props.children}</Text>
      </Box>
    )
  }
  if (props.schemaType.value === 'h1') {
    return (
      <Heading as={'h1'} size={2} weight={'bold'} style={{margin: '1rem 0'}}>
        {props.children}
      </Heading>
    )
  }
  if (props.schemaType.value === 'h2') {
    return (
      <Heading as={'h2'} size={2} weight={'bold'} style={{margin: '1rem 0'}}>
        {props.children}
      </Heading>
    )
  }
  if (props.schemaType.value === 'h3') {
    return (
      <Heading as={'h3'} size={1} weight={'bold'} style={{margin: '1rem 0'}}>
        {props.children}
      </Heading>
    )
  }
  if (props.schemaType.value === 'h4') {
    return (
      <Heading as={'h4'} size={1} weight={'semibold'} style={{margin: '1rem 0'}}>
        {props.children}
      </Heading>
    )
  }
  if (props.schemaType.value === 'h5') {
    return (
      <Heading as={'h5'} size={1} weight={'semibold'} style={{margin: '1rem 0'}}>
        {props.children}
      </Heading>
    )
  }
  if (props.schemaType.value === 'h6') {
    return (
      <Heading as={'h6'} size={1} weight={'semibold'} style={{margin: '1rem 0'}}>
        {props.children}
      </Heading>
    )
  }
  if (props.schemaType.value === 'blockquote') {
    return (
      <blockquote>
        <Card borderLeft>
          <Text size={1} muted>
            {props.children}
          </Text>
        </Card>
      </blockquote>
    )
  }
  return <>{props.children}</>
}

export default renderStyle
