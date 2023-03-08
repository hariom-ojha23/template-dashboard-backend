const express = require('express')
const { registerUser, loginUser } = require('../controller/user')
const {
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
} = require('../controller/dashboard')
const {
  filteredTableData,
  filteredPestleCount,
  filteredCountryRelevance,
  filteredRegionLikelihood,
  filteredYearCount,
  filteredSectorCount,
  filteredPestleIntensity,
  filteredSectorIntensity,
} = require('../controller/filter')

const router = express.Router()

// User Authentication
router.post('/register', registerUser)
router.post('/login', loginUser)

// Dashboard
router.get('/dataTable', dataTableData)
router.get('/sectorCount', sectorCountData)
router.get('/pestleCount', pestleCountData)
router.get('/yearCount', yearCountData)
router.get('/countryRelevance', countryRelevanceData)
router.get('/sectorIntensity', sectorIntensityData)
router.get('/pestleIntensity', pestleIntensityData)
router.get('/regionLikelihood', regionLikelihoodData)
router.get('/filterData', filterData)
router.get('/infoBoxCount', getInfoBoxCount)

// Filter
router.post('/filter/dataTable', filteredTableData)
router.post('/filter/sectorCount', filteredSectorCount)
router.post('/filter/pestleCount', filteredPestleCount)
router.post('/filter/yearCount', filteredYearCount)
router.post('/filter/countryRelevance', filteredCountryRelevance)
router.post('/filter/sectorIntensity', filteredSectorIntensity)
router.post('/filter/pestleIntensity', filteredPestleIntensity)
router.post('/filter/regionLikelihood', filteredRegionLikelihood)

module.exports = router
