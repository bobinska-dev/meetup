import { defineCliConfig } from 'sanity/cli'
import { projectId } from './lib/api'

export default defineCliConfig({
  api: {
    projectId,
    dataset: 'structure-showroom',
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
