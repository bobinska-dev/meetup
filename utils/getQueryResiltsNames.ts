import { SanityClient, TitledListValue } from 'sanity'
import { ReferenceValueWithKey } from '../components/input/ArrayOfReferencesSelectInput'

/** ### fetch the query and return props as @type {TitledListValue}
 *
 * @param {SanityClient} client - the client to use
 * @param {string} query - the query to use
 * @param {any} params - the parameters to use
 * @returns {Promise<TitledListValue<ReferenceValueWithKey>[]>} - the results of the query
 *
 */
export const getQueryResultsNames = async ({
  client,
  query,
  params,
}: {
  client: SanityClient
  query: string
  params: any
}): Promise<TitledListValue<ReferenceValueWithKey>[]> => await client.fetch(query, params)
