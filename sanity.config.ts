import { assist } from '@sanity/assist'
import { documentInternationalization } from '@sanity/document-internationalization'
import { visionTool } from '@sanity/vision'
import groq from 'groq'
import { defineConfig } from 'sanity'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { structureTool } from 'sanity/structure'
import { apiVersion } from './lib/api'
import { singletonPlugin } from './plugins/singletons'
import { schemaTypes } from './schemaTypes'
import { newDocumentSettings } from './schemaTypes/newDocumentOptions'
import { allSingletonTypeNames } from './schemaTypes/singletons'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'Demo',

  projectId: 'xonzamf8',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: structure,
    }),
    visionTool(),
    singletonPlugin(allSingletonTypeNames),
    // I18n
    internationalizedArray({
      languages: (client) =>
        client.fetch(groq`*[_type == "language"]|order(title asc){ "id": code, title }`),
      fieldTypes: ['string'],
    }),
    documentInternationalization({
      supportedLanguages: (client) =>
        client.fetch(groq`*[_type == "language"]|order(title asc){ "id": code, title }`),
      schemaTypes: ['page'],
    }),

    // AI Assist
    assist({
      translate: {
        document: {
          // The name of the field that holds the current language
          // in the form of a language code e.g. 'en', 'fr', 'nb_NO'.
          // Required
          languageField: 'language',
          // Optional extra filter for document types.
          // If not set, translation is enabled for all documents
          // that has a field with the name defined above.
          documentTypes: ['page', 'listOption'],
        },
        field: {
          documentTypes: ['listOption'],
          languages: async (client) => {
            const response = await client.fetch(`*[_type == "language"]{ 'id': code, title }`)
            return response
          },
          apiVersion: apiVersion,
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => newDocumentSettings(prev, creationContext),
  },
})
