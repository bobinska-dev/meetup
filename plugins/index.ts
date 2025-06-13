import { assist } from '@sanity/assist'
import { documentInternationalization } from '@sanity/document-internationalization'
import { visionTool } from '@sanity/vision'
import groq from 'groq'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { structureTool } from 'sanity/structure'
import { apiVersion } from '../lib/api'
import { customStructure } from '../structure'

export default [
  structureTool({ structure: customStructure }),
  visionTool({ defaultApiVersion: apiVersion }),
  /*
   * INTERNATIONALISATION
   */
  internationalizedArray({
    languages: (client) =>
      client.fetch(groq`*[_type == "language"]|order(title asc){ "id": code, title }`),
    fieldTypes: ['string'],
  }),
  documentInternationalization({
    supportedLanguages: (client) =>
      client.fetch(groq`*[_type == "language"]|order(title asc){ "id": code, title }`),
    schemaTypes: ['page'],
    languageField: 'language',
  }),

  /*
   * AI ASSISTANT
   */
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
          const response = await client.fetch(`*[_type == "language"]{ "id": code, title }`)
          return response
        },
      },
    },
  }),
]
