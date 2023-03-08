const asyncHandler = require('express-async-handler')
const Data = require('../models/dataModel')
const getFormatedData = require('../utils/getFormatedData')

const filteredTableData = asyncHandler(async (req, res) => {
  try {
    const { match } = req.body
    const data = await Data.find(match, {
      _id: 1,
      topic: 1,
      insight: 1,
      url: 1,
      added: 1,
      published: 1,
      title: 1,
      source: 1,
      country: 1,
    })

    res.status(200).send(data)
  } catch (error) {
    res.status(400)
    res.json({ error: `${error.message}` })
  }
})

const filteredSectorCount = asyncHandler(async (req, res) => {
  try {
    const { match } = req.body
    const data = await Data.aggregate([
      {
        $match: match,
      },
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

const filteredPestleCount = asyncHandler(async (req, res) => {
  try {
    const { match } = req.body
    const data = await Data.aggregate([
      {
        $match: match,
      },
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

const filteredYearCount = asyncHandler(async (req, res) => {
  try {
    const { match } = req.body
    const startData = await Data.aggregate([
      {
        $match: match,
      },
      { $group: { _id: { start_year: '$start_year' }, total: { $count: {} } } },
      { $project: { start_year: '$_id.start_year', total: '$total', _id: 0 } },
      { $sort: { start_year: 1 } },
    ])

    const endData = await Data.aggregate([
      {
        $match: match,
      },
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

const filteredCountryRelevance = asyncHandler(async (req, res) => {
  try {
    const { match } = req.body
    const data = await Data.aggregate([
      {
        $match: match,
      },
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

const filteredSectorIntensity = asyncHandler(async (req, res) => {
  try {
    const { match } = req.body
    const data = await Data.aggregate([
      {
        $match: match,
      },
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

const filteredPestleIntensity = asyncHandler(async (req, res) => {
  try {
    const { match } = req.body
    const data = await Data.aggregate([
      {
        $match: match,
      },
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

const filteredRegionLikelihood = asyncHandler(async (req, res) => {
  try {
    const { match } = req.body
    const data = await Data.aggregate([
      {
        $match: match,
      },
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

module.exports = {
  filteredTableData,
  filteredSectorCount,
  filteredPestleCount,
  filteredYearCount,
  filteredCountryRelevance,
  filteredSectorIntensity,
  filteredPestleIntensity,
  filteredRegionLikelihood,
}
