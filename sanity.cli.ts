import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xonzamf8',
    dataset: 'production',
  },

  deployment: { autoUpdates: true, appId: 'ht6614qoqyekhpzqpywph959' },
  studioHost: 'rich-table',
  reactStrictMode: true,
  reactCompiler: { target: '19' },
})
