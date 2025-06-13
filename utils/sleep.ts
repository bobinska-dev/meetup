/** ### sleep – timeout
 *
 * Basic setTimeout function which we will use later to delay fetching our referenced data, so that we can listen for the data to be available.
 *
 * @param ms - number of milliseconds to wait
 * @returns Promise
 *
 * */
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
