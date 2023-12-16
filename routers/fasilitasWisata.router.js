const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/fasilitasWisata.cintroller");

router.post("/", controller.createfasilitasWisata);
router.put("/:id", controller.updatefasilitasWisata);
router.get("/:id", controller.getfasilitasWisata);
router.delete("/:id", controller.destroyfasilitasWisa);
router.get("/", controller.getAllFasilitasWisata);

module.exports = router;
