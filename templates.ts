import { Template, TemplateResolver } from 'sanity'

const parentPageTemplate: Template = {
  id: 'parentPageTemplate',
  title: 'Parent Page Template',
  schemaType: 'page',
  parameters: [
    {
      name: 'parentId',
      type: 'string',
    },
  ],
  value: (params: { parentId: string }) => ({
    parent: {
      _type: 'reference',
      _ref: params.parentId,
    },
  }),
}
const internationalisedPageTemplate: Template = {
  id: 'internationalised-page',
  title: 'Internationalised Page',
  schemaType: 'page',
  parameters: [
    {
      name: 'language',
      type: 'string',
    },
  ],
  value: (params: { language: string }) => {
    return {
      language: params.language,
    }
  },
}
const internationalisedParentPageTemplate: Template = {
  id: 'internationalised-parent-page',
  title: 'Internationalised Parent Page',
  schemaType: 'page',
  parameters: [
    {
      name: 'parentId',
      type: 'string',
    },
    { name: 'language', type: 'string' },
  ],
  value: (params: { language: string; parentId: string }) => {
    return {
      language: params.language,
      parent: {
        _type: 'reference',
        _ref: params.parentId,
      },
    }
  },
}
export const templates: TemplateResolver = (prev, context) => {
  const { currentUser } = context

  return [
    ...prev,
    parentPageTemplate,
    internationalisedPageTemplate,
    internationalisedParentPageTemplate,
  ]
}
