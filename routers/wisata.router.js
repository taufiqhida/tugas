const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
// Import the controller for hotel routes
const controller = require("../controllers/wisata.controller");

// Define your routes using the controller methods
router.get("/", controller.getWisataAll);
router.get("/:id", controller.getWisataById);
router.post("/", upload.single("image"), controller.createWisata);
router.put("/:id", upload.single("image"), controller.updateWisata);
router.delete("/:id", controller.deleteWisata);

module.exports = router;
