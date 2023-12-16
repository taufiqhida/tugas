const express = require('express');
const router = express.Router();

const adminRouter = require('./admin.router');
const ulasanRouter = require('./ulasan.router');
const kecamatanRouter = require('./kecamatan.router');
const hotelRouter = require('./hotel.router');
const wisataRouter = require('./wisata.router');
const fasilitasHotel = require('./fasilitasHotel.router')
const fasilitasWisata = require('./fasilitasWisata.router')

router.use("/admin", adminRouter)
router.use("/ulasan", ulasanRouter)
router.use("/kecamatan", kecamatanRouter)
router.use("/hotel", hotelRouter)
router.use("/wisata", wisataRouter)
router.use("/fasilitasHotel", fasilitasHotel)
router.use("/fasilitasWisata", fasilitasWisata)




module.exports=router