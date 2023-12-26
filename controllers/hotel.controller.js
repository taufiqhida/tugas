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
    if(req.query.search){

      const allHotels = await prisma.hotel.findMany({
        take: parseInt(limit),
        skip: skip,
        where:{
          OR: [
            {
              title:{
                contains: req.query.search,
                mode: "insensitive",
              }
            }
          ]
        }
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

  }
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
    imageFileName1,
    imageFileName2,
    imageFileName3
  } = req.body;

  try {
    // Upload image using Multer and ImageKit
    const { image1, image2, image3 } = req.files;

    const allowedMimes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const allowedSizeMb = 2;
    const nameSlug = await utils.createSlug(title);

    if (typeof image1 === "undefined")
      return res.status(400).json("Foto Kosong 1");
    if (!allowedMimes.includes(image1[0].mimetype))
      return res.status(400).json("cover harus berupa gambar 1");
    if (image1[0].size / (1024 * 1024) > allowedSizeMb)
      return res.status(400).json("cover categori tidak boleh lebih dari 2mb");
    const stringFile1 = image1[0].buffer.toString("base64");
    const originalFileName1 = image1[0].originalname;
    const uploadFile1 = await imageKit.upload({
      fileName: originalFileName1,
      file: stringFile1,
    });

    console.log(image2, "Kosong 2");
    if (typeof image2 === "undefined")
      return res.status(400).json("Foto Kosong 2");
    if (!allowedMimes.includes(image2[0].mimetype))
      return res.status(400).json("cover kategori harus berupa gambar 2");
    if (image2[0].size / (1024 * 1024) > allowedSizeMb)
      return res.status(400).json("cover categori tidak boleh lebih dari 2mb");
    const stringFile2 = image2[0].buffer.toString("base64");
    const originalFileName2 = image2[0].originalname;
    const uploadFile2 = await imageKit.upload({
      fileName: originalFileName2,
      file: stringFile2,
    });
    if (typeof image3 === "undefined")
      return res.status(400).json("Foto Kosong");
    if (!allowedMimes.includes(image3[0].mimetype))
      return res.status(400).json("cover kategori harus berupa gambar 3");
    if (image3[0].size / (1024 * 1024) > allowedSizeMb)
      return res.status(400).json("cover categori tidak boleh lebih dari 2mb");
    const stringFile3 = image3[0].buffer.toString("base64");
    const originalFileName3 = image3[0].originalname;
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
        imageFileName1: uploadFile1.imageFileName1,
        imageFileName2: uploadFile2.imageFileName2,
        imageFileName3: uploadFile3.imageFileName3
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
        imageFileName1: newHotel.image1.imageFileName1,
        imageFileName2: newHotel.image2.imageFileName2,
        imageFileName3: newHotel.image3.imageFileName3,
      },
    };
    res.status(201).json(responseData);
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

const updateHotel = async (req, res, next) => {
  const hotelId = parseInt(req.params.id);

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
    imageFileName1,
    imageFileName2,
    imageFileName3
  } = req.body;

  try {
    // Upload image using Multer and ImageKit
    const { image1, image2, image3 } = req.files;

    const allowedMimes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const allowedSizeMb = 2;
    const nameSlug = await utils.createSlug(title);

    if (!allowedMimes.includes(image1[0].mimetype))
      return res.status(400).json("cover harus berupa gambar 1");
    if (image1[0].size / (1024 * 1024) > allowedSizeMb)
      return res.status(400).json("cover categori tidak boleh lebih dari 2mb");
    const stringFile1 = image1[0].buffer.toString("base64");
    const originalFileName1 = image1[0].originalname;
    const uploadFile1 = await imageKit.upload({
      fileName: originalFileName1,
      file: stringFile1,
    });

    console.log(image2, "Kosong 2");
    if (!allowedMimes.includes(image2[0].mimetype))
      return res.status(400).json("cover kategori harus berupa gambar 2");
    if (image2[0].size / (1024 * 1024) > allowedSizeMb)
      return res.status(400).json("cover categori tidak boleh lebih dari 2mb");
    const stringFile2 = image2[0].buffer.toString("base64");
    const originalFileName2 = image2[0].originalname;
    const uploadFile2 = await imageKit.upload({
      fileName: originalFileName2,
      file: stringFile2,
    });
    if (!allowedMimes.includes(image3[0].mimetype))
      return res.status(400).json("cover kategori harus berupa gambar 3");
    if (image3[0].size / (1024 * 1024) > allowedSizeMb)
      return res.status(400).json("cover categori tidak boleh lebih dari 2mb");
    const stringFile3 = image3[0].buffer.toString("base64");
    const originalFileName3 = image3[0].originalname;
    const uploadFile3 = await imageKit.upload({
      fileName: originalFileName3,
      file: stringFile3,
    });
    const updatedHotel = await prisma.hotel.update({
      where: { id: hotelId },
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
        imageFileName1: uploadFile1.imageFileName1,
        imageFileName2: uploadFile2.imageFileName2,
        imageFileName3: uploadFile3.imageFileName3
      },
    });

    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const responseData = {
      success: true,
      message: "Succesfully update data hotel",
      data: {
        title: updatedHotel.title,
        deskripsi: updatedHotel.deskripsi,
        linkmap: updatedHotel.linkmap,
        alamat: updatedHotel.alamat,
        isPopular: updatedHotel.isPopular,
        jarak: updatedHotel.jarak,
        rating: parseFloat(updatedHotel.rating),
        checkIn: updatedHotel.checkIn,
        checkOut: updatedHotel.checkOut,
        nohp: String(updatedHotel.nohp),
        hargaMin: String(updatedHotel.hargaMin),
        hargaMax: String(updatedHotel.hargaMax),
        kecamatanId: String(updatedHotel.kecamatanId),
        slug: updatedHotel.nameSlug,
        image1: updatedHotel.image1.url,
        image2: updatedHotel.image2.url,
        image3: updatedHotel.image3.url,
        imageFileName1: updatedHotel.imageFileName1,
        imageFileName2: updatedHotel.imageFileName2,
        imageFileName3: updatedHotel.imageFileName3,
      },
    };
    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
};

const deleteHotel = async (req, res, next) => {
  const hotelId = parseInt(req.params.id);

  try {
    const deletedHotel = await prisma.hotel.delete({
      where: { id: hotelId },
    });

    if (!deletedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(202).json({
      status: true,
      message: "Deleted data hotel sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

const fasilitasHotel = async(req, res, next)=>{
  const hotelId = parseInt(req.params.id);
  console.log(hotelId);
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        fasilitasHotel: true
      }
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
}
module.exports = {
  getAllHotels,
  getHotelById,
  createHotel, // Use Multer middleware for image upload
  updateHotel,
  deleteHotel,
  fasilitasHotel
};
