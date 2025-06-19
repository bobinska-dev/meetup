import type { SanityDocument } from '@sanity/client'
import { uuid } from '@sanity/uuid'
import { TbPlus } from 'react-icons/tb'
import type { MenuItemBuilder, StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { apiVersion } from '../../../lib/api'

export const createChildDraftMenuItem = ({
  S,
  context,
  parent,
  type,
}: {
  S: StructureBuilder
  context: StructureResolverContext
  parent: SanityDocument
  type: string // the schema type name for both parent and children
}): MenuItemBuilder =>
  S.menuItem()
    .title('Create new child draft')
    .icon(TbPlus)
    .showAsAction()
    .action(() => {
      const client = context.getClient({ apiVersion })

      const id = uuid()

      client
        .action({
          actionType: 'sanity.action.document.create',
          publishedId: id,
          attributes: {
            title: '★ New Child Draft',
            _id: 'drafts.' + id,
            _type: type,
            parent: { _ref: parent._id, _type: 'reference' },
            language: parent.language || 'en', // default to 'en' if no language is set
          },
          ifExists: 'fail',
        })
        .then(() => {
          console.log('Child draft created')
        })
        .catch((error) => console.error('Create draft failed: ', error.message))
    })
