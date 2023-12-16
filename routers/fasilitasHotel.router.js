const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/fasilitasHotel.controller");

router.post("/", controller.createfasilitasHotel);
router.put("/:id", controller.updatefasilitasHotel);
router.get("/:id", controller.getfasilitasHotel);
router.delete("/:id", controller.destroyfasilitasHotel);
router.get("/", controller.getAllFasilitasHotel);

module.exports = router;
