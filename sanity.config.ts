import { defineConfig } from 'sanity'
import documentActions from './documentActions'
import { projectId } from './lib/api'
import plugins from './plugins'
import { schemaTypes } from './schemaTypes'
import { templates } from './templates'

export default defineConfig({
  name: 'default',
  title: 'Demo',

  projectId,
  dataset: 'structure-showroom',

  plugins: plugins,

  schema: {
    types: schemaTypes,
    templates: templates,
  },

  document: {
    actions: (prev, context) => documentActions(prev, context),
  },

  search: {
    strategy: 'groq2024',
  },
})
