import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xonzamf8',
    dataset: 'production',
  },

  deployment: { autoUpdates: true, appId: 'rich-table' },
  reactStrictMode: true,
  reactCompiler: { target: '19' },
})
