const getFormatedData = async (data) => {
  let arr = data.map((x) => {
    if (!Object.values(x).includes('') && !Object.values(x).includes(null)) {
      return Object.values(x)
    } else {
      return
    }
  })

  while (arr.includes(undefined)) {
    const index = arr.indexOf(undefined)
    if (index > -1) {
      arr.splice(index, 1)
    }
  }

  return arr
}

module.exports = getFormatedData
