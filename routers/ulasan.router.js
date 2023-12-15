const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/ulasan.controller");

router.post("/", controller.create);
router.put("/:id", controller.update);
router.get("/:id", controller.getUlasan);
router.get("/", controller.showAll);
router.delete("/:id", controller.destroy);

module.exports = router;
