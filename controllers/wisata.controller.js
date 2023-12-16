const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const imageKit = require("../utils/imageKit"); // Your ImageKit integration module
const path = require("path");
const utils = require("../utils");

const getWisataAll = async (req, res, next) => {
  let { page = 1, limit = 10 } = req.query; //menghasilkan string
  let skip = (page - 1) * limit;
  try {
    const allWisata = await prisma.wisata.findMany({
      take: parseInt(limit),
      skip: skip,
    });

    const resultCount = await prisma.wisata.count(); //integer jumlah total data wisata

    //generated total page
    const totalPage = Math.ceil(resultCount / limit);

    res.status(200).json({
      success: true,
      current_page: page - 0, //ini -0 merubah menjadi integer
      total_page: totalPage,
      total_data: resultCount,
      data: allWisata,
    });
  } catch (error) {
    next(error);
  }
};

const getWisataById = async (req, res, next) => {
  const wisataId = parseInt(req.params.id);
  try {
    const hotel = await prisma.wisata.findUnique({
      where: { id: wisataId },
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

const createWisata = async (req, res, next) => {
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
    jamBuka,
    jamTutup,
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
    const newWisata = await prisma.wisata.create({
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
        jamBuka: jamBuka,
        jamTutup: jamTutup,
        kecamatanId: parseInt(req.body.kecamatanId),
        slug: nameSlug,
        image1: uploadFile1.url,
        image2: uploadFile2.url,
        image3: uploadFile3.url,
      },
    });

    const responseData = {
      success: true,
      message: "Succesfully create data Wisata",
      data: {
        id: newWisata.id,
        title: newWisata.title,
        deskripsi: newWisata.deskripsi,
        linkmap: newWisata.linkmap,
        alamat: newWisata.alamat,
        isPopular: newWisata.isPopular,
        jarak: newWisata.jarak,
        rating: parseFloat(newWisata.rating),
        jamBuka: newWisata.jamBuka,
        jamTutup: newWisata.jamTutup,
        nohp: String(newWisata.nohp),
        hargaMin: String(newWisata.hargaMin),
        hargaMax: String(newWisata.hargaMax),
        kecamatanId: String(newWisata.kecamatanId),
        slug: newWisata.nameSlug,
        image1: newWisata.image1.url,
        image2: newWisata.image2.url,
        image3: newWisata.image3.url,
      },
    };
    res.status(201).json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const updateWisata = async (req, res, next) => {
  const wisataId = parseInt(req.params.id);
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
    jamBuka,
    jamTutup,
    kecamatanId,
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

    const updatedWisata = await prisma.wisata.update({
      where: { id: wisataId },
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
        jamBuka: jamBuka,
        jamTutup: jamTutup,
        kecamatanId: parseInt(kecamatanId),
        slug: nameSlug,
        image1: uploadFile1.url,
        image2: uploadFile2.url,
        image3: uploadFile3.url,
      },
    });

    if (!updatedWisata) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const responseData = {
      success: true,
      message: "Succesfully update data hotel",
      data: {
        title: updatedWisata.title,
        deskripsi: updatedWisata.deskripsi,
        linkmap: updatedWisata.linkmap,
        alamat: updatedWisata.alamat,
        isPopular: updatedWisata.isPopular,
        jarak: parseInt(updatedWisata.jarak),
        rating: parseFloat(updatedWisata.rating),
        jamBuka: updatedWisata.jamBuka,
        jamTutup: updatedWisata.jamTutup,
        nohp: String(updatedWisata.nohp),
        hargaMin: String(updatedWisata.hargaMin),
        hargaMax: String(updatedWisata.hargaMax),
        kecamatanId: parseInt(updatedWisata.kecamatanId),
        slug: updatedWisata.nameSlug,
        image1: updatedWisata.image1.url,
        image2: updatedWisata.image2.url,
        image3: updatedWisata.image3.url,
      },
    };
    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
};

const deleteWisata = async (req, res, next) => {
  const wisataId = parseInt(req.params.id);

  try {
    const deletedHotel = await prisma.wisata.delete({
      where: { id: wisataId },
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

module.exports = {
  getWisataAll,
  getWisataById,
  createWisata, // Use Multer middleware for image upload
  updateWisata,
  deleteWisata,
};
