/** ### Function`isVersionDocument`
 *
 * A utility function to check if a document ID is a version or draft document.
 *
 * @param _id - The document ID
 * @returns boolean - true if the document is a version or draft document, false otherwise
 */
export const isVersionDocument = (_id: string) => {
  // * Check if the document is a version document
  const isVersion = _id.includes('versions.') || _id.includes('drafts.')

  return isVersion
}

export const getVersionTitle = (_id: string) => {
  // * Check if document is version or draft and get _id prefix as title if true

  const title = isVersionDocument(_id) ? _id.split('.')[0] : ''
  return title.substring(0, title.length - 1)
}
