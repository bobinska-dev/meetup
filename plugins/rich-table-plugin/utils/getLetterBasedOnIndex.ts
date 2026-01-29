export const getLetterBasedOnIndex = (index: number): string => {
  let letter = ''
  let currentIndex = index

  while (currentIndex >= 0) {
    letter = String.fromCharCode((currentIndex % 26) + 65) + letter
    currentIndex = Math.floor(currentIndex / 26) - 1
  }

  return letter
}
