const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
// Import the controller for hotel routes
const controller = require("../controllers/wisata.controller");

// Define your routes using the controller methods
router.get("/", controller.getWisataAll);
router.get("/:id", controller.getWisataById);
router.post("/", upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),  controller.createWisata);
router.put("/:id",upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),  controller.updateWisata);
router.delete("/:id", controller.deleteWisata);
router.get("/:id/fasilitas", controller.fasilitasWisata)

module.exports = router;
