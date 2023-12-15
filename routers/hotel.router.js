const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
// Import the controller for hotel routes
const controller = require("../controllers/hotel.controller");

// Define routes
router.get("/", controller.getAllHotels);
router.get("/:id", controller.getHotelById);
router.post(
  "/",
  upload.single("image1"),
  upload.single("image2"),
  upload.single("image3"),
  controller.createHotel
);
// router.put("/:id", upload.single("image"), controller.updateHotel);
// router.delete("/:id", controller.deleteHotel);

// const controller = require("../controllers/hotel.controller");

// router.post("/create",controller.upload.single('image'), controller.create)
// router.post("/update/:id", controller.updateHotel)
// router.get("/get/:id", controller.getHotel)
// router.delete("/:id", controller.destroyHotel)
// router.get("/", controller.getHotelAll)

module.exports = router;
