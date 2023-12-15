const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const imageKit = require("../utils/imageKit"); // Your ImageKit integration module
const path = require("path");
const utils = require("../utils");

const getAllHotels = async (req, res, next) => {
  let { page = 1, limit = 10 } = req.query; // menghasilkan string
  let skip = (page - 1) * limit;
  console.log(req.query);
  try {
    const allHotels = await prisma.hotel.findMany({
      take: parseInt(limit),
      skip: skip,
    });

    const resultCount = await prisma.hotel.count(); // integer jumlah total data wisata

    // generated total page
    const totalPage = Math.ceil(resultCount / limit);

    res.status(200).json({
      success: true,
      current_page: parseInt(page),
      total_page: totalPage,
      total_data: resultCount,
      data: allHotels,
    });
  } catch (error) {
    next(error);
  }
};

const getHotelById = async (req, res, next) => {
  const hotelId = parseInt(req.params.id);
  console.log(hotelId);
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

const createHotel = async (req, res, next) => {
  console.log(req.body);
  console.log("req.file");
  const {
    title,
    deskripsi,
    linkmap,
    alamat,
    nohp,
    hargaMin,
    hargaMax,
    isPopular,
    jarak,
    rating,
    checkIn,
    checkOut,
  } = req.body;

  const nameSlug = await utils.createSlug(title);
  console.log("req.file");

  try {
    // Upload image using Multer and ImageKit
    console.log("req.file");
    const image1 = req.file;
    const allowedMimes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const allowedSizeMb = 2;
    const nameSlug = await utils.createSlug(title);
    if (typeof image1 === "undefined")
      return res.status(400).json("Foto Kosong");
    if (!allowedMimes.includes(image1.mimetype))
      return res.status(400).json("cover kategori harus berupa gambar");
    if (image1.size / (1024 * 1024) > allowedSizeMb)
      return res.status(400).json("cover categori tidak boleh lebih dari 2mb");
    const stringFile1 = image1.buffer.toString("base64");
    const originalFileName1 = image1.originalname;
    const uploadFile1 = await imageKit.upload({
      fileName: originalFileName1,
      file: stringFile1,
    });
    const image2 = req.file;
    if (typeof image2 === "undefined")
      return res.status(400).json("Foto Kosong");
    if (!allowedMimes.includes(image2.mimetype))
      return res.status(400).json("cover kategori harus berupa gambar");
    if (image2.size / (1024 * 1024) > allowedSizeMb)
      return res.status(400).json("cover categori tidak boleh lebih dari 2mb");
    const stringFile2 = image2.buffer.toString("base64");
    const originalFileName2 = image2.originalname;
    const uploadFile2 = await imageKit.upload({
      fileName: originalFileName2,
      file: stringFile2,
    });
    const image3 = req.file;
    if (typeof image3 === "undefined")
      return res.status(400).json("Foto Kosong");
    if (!allowedMimes.includes(image3.mimetype))
      return res.status(400).json("cover kategori harus berupa gambar");
    if (image3.size / (1024 * 1024) > allowedSizeMb)
      return res.status(400).json("cover categori tidak boleh lebih dari 2mb");
    const stringFile3 = image3.buffer.toString("base64");
    const originalFileName3 = image3.originalname;
    const uploadFile3 = await imageKit.upload({
      fileName: originalFileName3,
      file: stringFile3,
    });

    // Create hotel with image URL and ImageKit fileId
    const newHotel = await prisma.hotel.create({
      data: {
        title: title,
        deskripsi: deskripsi,
        linkmap: linkmap,
        alamat: alamat,
        nohp: nohp,
        hargaMin: hargaMin,
        hargaMax: hargaMax,
        isPopular: Boolean(isPopular),
        jarak: parseInt(jarak),
        rating: parseFloat(rating),
        checkIn: checkIn,
        checkOut: checkOut,
        kecamatanId: parseInt(req.body.kecamatanId),
        slug: nameSlug,
        image1: uploadFile1.url,
        image2: uploadFile2.url,
        image3: uploadFile3.url,
      },
    });

    const responseData = {
      success: true,
      message: "Succesfully create data hotel",
      data: {
        id: newHotel.id,
        title: newHotel.title,
        deskripsi: newHotel.deskripsi,
        linkmap: newHotel.linkmap,
        alamat: newHotel.alamat,
        isPopular: newHotel.isPopular,
        jarak: newHotel.jarak,
        rating: parseFloat(newHotel.rating),
        checkIn: newHotel.checkIn,
        checkOut: newHotel.checkOut,
        nohp: String(newHotel.nohp),
        hargaMin: String(newHotel.hargaMin),
        hargaMax: String(newHotel.hargaMax),
        kecamatanId: String(newHotel.kecamatanId),
        slug: newHotel.nameSlug,
        image1: newHotel.image1.url,
        image2: newHotel.image2.url,
        image3: newHotel.image3.url,
      },
    };
    res.status(201).json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// const updateHotel = async (req, res, next) => {
//   const hotelId = parseInt(req.params.id);
//   const {
//     title,
//     deskripsi,
//     linkmap,
//     alamat,
//     nohp,
//     hargaMin,
//     hargaMax,
//     isPopular,
//     jarak,
//     rating,
//     checkIn,
//     checkOut,
//     kecamatanId,
//   } = req.body;

//   const nameSlug = await utils.createSlug(title);

//   try {
//     // Upload image using Multer and ImageKit
//     const image = req.file;
//     if (!image) {
//       return res.status(400).json({ message: "Image is required" });
//     }

//     const strFile = image.buffer.toString("base64");
//     const nameFile = uuidv4() + path.extname(image.originalname);
//     const { url, fileId } = await imageKit.upload({
//       fileName: nameFile,
//       file: strFile,
//     });

//     const updatedHotel = await prisma.hotel.update({
//       where: { id: hotelId },
//       data: {
//         title: title,
//         deskripsi: deskripsi,
//         linkmap: linkmap,
//         alamat: alamat,
//         isPopular: isPopular,
//         jarak: parseInt(jarak),
//         rating: parseFloat(rating),
//         checkIn: checkIn,
//         checkOut: checkOut,
//         nohp: String(nohp),
//         hargaMin: String(hargaMin),
//         hargaMax: String(hargaMax),
//         kecamatanId: parseInt(kecamatanId),
//         slug: nameSlug,
//       },
//     });

//     const createImage = await prisma.imageHotel.update({
//       where: { id: hotelId },
//       data: {
//         nama: nameFile,
//         hotelId: hotelId,
//         idImagekit: fileId,
//         url: url,
//       },
//     });

//     if (!updatedHotel) {
//       return res.status(404).json({ message: "Hotel not found" });
//     }

//     const responseData = {
//       success: true,
//       message: "Succesfully update data hotel",
//       data: {
//         title: title,
//         deskripsi: deskripsi,
//         linkmap: linkmap,
//         alamat: alamat,
//         isPopular: isPopular,
//         jarak: parseInt(jarak),
//         rating: parseFloat(rating),
//         checkIn: checkIn,
//         checkOut: checkOut,
//         nohp: String(nohp),
//         hargaMin: String(hargaMin),
//         hargaMax: String(hargaMax),
//         kecamatanId: parseInt(kecamatanId),
//         slug: nameSlug,
//       },
//     };
//     res.status(201).json(responseData);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteHotel = async (req, res, next) => {
//   const hotelId = parseInt(req.params.id);

//   try {
//     const findImage = await prisma.imageHotel.findUnique({
//       where: { id: hotelId },
//     });

//     // Delete image from ImageKit
//     const fileId = findImage.idImagekit;
//     await imageKit.deleteFile(fileId);

//     const deletedHotel = await prisma.hotel.delete({
//       where: { id: hotelId },
//     });

//     const deleteImage = await prisma.imageHotel.delete({
//       where: { id: hotelId },
//     });

//     if (!deletedHotel) {
//       return res.status(404).json({ message: "Hotel not found" });
//     }
//     res.status(202).json({
//       status: true,
//       message: "Deleted data hotel sucessfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  getAllHotels,
  getHotelById,
  createHotel, // Use Multer middleware for image upload
  // updateHotel,
  // deleteHotel,
};