const express = require('express');
const router = express.Router();

const adminRouter = require('./admin.router');
const ulasanRouter = require('./ulasan.router');
const kecamatanRouter = require('./kecamatan.router');
const hotelRouter = require('./hotel.router');
const wisataRouter = require('./wisata.router');

router.use("/admin", adminRouter)
router.use("/ulasan", ulasanRouter)
router.use("/kecamatan", kecamatanRouter)
router.use("/hotel", hotelRouter)
router.use("/wisata", wisataRouter)




module.exports=router