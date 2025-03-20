/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */

export const dataset = assertValue(
  process.env.SANITY_STUDIO_DATASET,
  'Missing environment variable: SANITY_STUDIO_DATASET',
)

export const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID,
  'Missing environment variable: SANITY_STUDIO_PROJECT_ID',
)

// see https://www.sanity.io/docs/api-versioning for how versioning works
export const apiVersion = assertValue(
  process.env.SANITY_STUDIO_APIVERSION || '2025-03-01',
  'Missing environment variable: SANITY_STUDIO_PROJECT_ID',
)
export const apiReadToken = assertValue(
  process.env.SANITY_STUDIO_API_TOKEN,
  'Missing environment variable',
)
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
