const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/kecamatan.controller");

router.post("/", controller.create);
router.put("/:id", controller.update);
router.get("/:id", controller.getKecamatan);
router.delete("/:id", controller.destroy);
router.get("/", controller.getAllKecamatanAndCountHotelOrWisata);
router.get("/hotel/:id", controller.getAllHotelByKecamatan);
router.get("/wisata/:id", controller.getAllWisataByKecamatan);

module.exports = router;
