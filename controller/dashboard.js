const asyncHandler = require('express-async-handler')
const Data = require('../models/dataModel')
const getFormatedData = require('../utils/getFormatedData')

const dataTableData = asyncHandler(async (req, res) => {
  try {
    const data = await Data.find(
      {},
      {
        _id: 1,
        topic: 1,
        insight: 1,
        url: 1,
        added: 1,
        published: 1,
        title: 1,
        source: 1,
      }
    )

    res.status(200).send(data)
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

const sectorCountData = asyncHandler(async (req, res) => {
  try {
    const data = await Data.aggregate([
      { $group: { _id: { sector: '$sector' }, total: { $count: {} } } },
      { $project: { sector: '$_id.sector', total: '$total', _id: 0 } },
    ])

    const arr = await getFormatedData(data)

    res.status(200).send(arr)
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

const pestleCountData = asyncHandler(async (req, res) => {
  try {
    const data = await Data.aggregate([
      { $group: { _id: { pestle: '$pestle' }, total: { $count: {} } } },
      { $project: { pestle: '$_id.pestle', total: '$total', _id: 0 } },
    ])

    const arr = await getFormatedData(data)

    res.status(200).send(arr)
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

const yearCountData = asyncHandler(async (req, res) => {
  try {
    const startData = await Data.aggregate([
      { $group: { _id: { start_year: '$start_year' }, total: { $count: {} } } },
      { $project: { start_year: '$_id.start_year', total: '$total', _id: 0 } },
      { $sort: { start_year: 1 } },
    ])

    const endData = await Data.aggregate([
      { $group: { _id: { end_year: '$end_year' }, total: { $count: {} } } },
      { $project: { end_year: '$_id.end_year', total: '$total', _id: 0 } },
      { $sort: { end_year: 1 } },
    ])

    const startArr = await getFormatedData(startData)
    const endArr = await getFormatedData(endData)

    res.status(200).json({ startYear: startArr, endYear: endArr })
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

const countryRelevanceData = asyncHandler(async (req, res) => {
  try {
    const data = await Data.aggregate([
      {
        $group: { _id: { country: '$country' }, total: { $sum: '$relevance' } },
      },
      { $project: { country: '$_id.country', total: '$total', _id: 0 } },
      { $sort: { total: -1 } },
    ])

    const chartData = await getFormatedData(data)

    if (data[0].country === '') {
      data.splice(0, 1)
    }

    res.status(200).send({ chartData, tableData: data })
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

const sectorIntensityData = asyncHandler(async (req, res) => {
  try {
    const data = await Data.aggregate([
      { $group: { _id: { sector: '$sector' }, total: { $sum: '$intensity' } } },
      { $project: { sector: '$_id.sector', total: '$total', _id: 0 } },
    ])

    const arr = await getFormatedData(data)

    res.status(200).send(arr)
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

const pestleIntensityData = asyncHandler(async (req, res) => {
  try {
    const data = await Data.aggregate([
      { $group: { _id: { pestle: '$pestle' }, total: { $sum: '$intensity' } } },
      { $project: { pestle: '$_id.pestle', total: '$total', _id: 0 } },
    ])

    const arr = await getFormatedData(data)

    res.status(200).send(arr)
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

const regionLikelihoodData = asyncHandler(async (req, res) => {
  try {
    const data = await Data.aggregate([
      {
        $group: { _id: { region: '$region' }, total: { $sum: '$likelihood' } },
      },
      { $project: { region: '$_id.region', total: '$total', _id: 0 } },
      {
        $sort: { region: 1 },
      },
    ])

    const arr = await getFormatedData(data)

    res.status(200).send(arr)
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

const fetchData = (filter) => {
  return new Promise(async (resolve) => {
    const data = await Data.aggregate([
      { $group: { _id: { key: `$${filter}` } } },
      {
        $project: { _id: 0, key: '$_id.key' },
      },
      {
        $sort: { key: 1 },
      },
    ])
    let arr = await getFormatedData(data)
    arr = arr.map((x) => x[0])
    resolve(arr)
  })
}

const filterData = asyncHandler(async (req, res) => {
  try {
    const filters = [
      'country',
      'sector',
      'region',
      'topic',
      'source',
      'end_year',
    ]
    const finalData = {}

    for (let filter of filters) {
      finalData[filter] = await fetchData(filter)
    }

    res.status(200).send(finalData)
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

const fetchInfo = (info) => {
  return new Promise(async (resolve) => {
    const data = await Data.aggregate([
      { $group: { _id: { key: `$${info}` } } },
      {
        $project: { _id: 0, key: '$_id.key' },
      },
      {
        $sort: { key: 1 },
      },
    ])
    let arr = await getFormatedData(data)

    resolve(arr.length)
  })
}

const getInfoBoxCount = asyncHandler(async (req, res) => {
  try {
    const infos = ['country', 'region', 'topic', 'source']
    const finalData = []
    for (let info of infos) {
      const data = await fetchInfo(info)
      finalData.push(data)
    }

    res.status(200).send(finalData)
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

module.exports = {
  dataTableData,
  sectorCountData,
  pestleCountData,
  yearCountData,
  countryRelevanceData,
  sectorIntensityData,
  pestleIntensityData,
  regionLikelihoodData,
  filterData,
  getInfoBoxCount,
}
