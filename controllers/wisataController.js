const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const imageKit = require("../utils/imageKit"); // Your ImageKit integration module
const path = require("path");
const utils = require("../utils");

const getAllWisatas = async (req, res, next) => {
  let { page = 1, limit = 10 } = req.query; //menghasilkan string
  let skip = (page - 1) * limit;

  try {
    const allWisatas = await prisma.wisata.findMany({
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
      data: allWisatas,
    });
  } catch (error) {
    next(error);
  }
};

const getWisataById = async (req, res, next) => {
  const wisataId = parseInt(req.params.id);

  try {
    const wisata = await prisma.wisata.findUnique({
      where: { id: wisataId },
    });

    if (!wisata) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(wisata);
  } catch (error) {
    next(error);
  }
};

const createWisata = async (req, res, next) => {
  const { title, deskripsi, linkmap, alamat, nohp, harga_min, harga_max } =
    req.body;

  const nameSlug = await utils.createSlug(title);

  try {
    // Upload image using Multer and ImageKit
    const image = req.file;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const strFile = image.buffer.toString("base64");
    const nameFile = uuidv4() + path.extname(image.originalname);
    const { url, fileId } = await imageKit.upload({
      fileName: nameFile,
      file: strFile,
    });

    // Create wisata with image URL and ImageKit fileId
    const newWisata = await prisma.wisata.create({
      data: {
        title: title,
        deskripsi: deskripsi,
        linkmap: linkmap,
        alamat: alamat,
        nohp: nohp,
        harga_min: parseInt(harga_min),
        harga_max: parseInt(harga_max),
        kecamatanId: parseInt(req.body.kecamatanId),
        slug: nameSlug,
      },
    });

    const wisataId = newWisata.id;

    const createImage = await prisma.image.create({
      data: {
        nama: nameFile,
        hotelId: 0,
        idImagekit: fileId,
        wisataId: wisataId,
        url: url,
      },
    });

    const responseData = {
      success: true,
      message: "Succesfully create data wisata",
      data: {
        id: newWisata.id,
        title: newWisata.title,
        deskripsi: newWisata.deskripsi,
        linkmap: newWisata.linkmap,
        alamat: newWisata.alamat,
        nohp: String(newWisata.nohp),
        harga_min: String(newWisata.harga_min),
        harga_max: String(newWisata.harga_max),
        kecamatanId: String(newWisata.kecamatanId),
        slug: newWisata.nameSlug,
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
  const { title, deskripsi, linkmap, alamat, nohp, harga_min, harga_max } =
    req.body;

  const nameSlug = await utils.createSlug(title);

  try {
    // Upload image using Multer and ImageKit
    const image = req.file;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const strFile = image.buffer.toString("base64");
    const nameFile = uuidv4() + path.extname(image.originalname);
    const { url, fileId } = await imageKit.upload({
      fileName: nameFile,
      file: strFile,
    });

    const updatedWisata = await prisma.wisata.update({
      where: { id: wisataId },
      data: {
        title: title,
        deskripsi: deskripsi,
        linkmap: linkmap,
        alamat: alamat,
        nohp: nohp,
        harga_min: parseInt(harga_min),
        harga_max: parseInt(harga_max),
        kecamatanId: parseInt(req.body.kecamatanId),
        slug: nameSlug,
      },
    });

    const updateImage = await prisma.image.update({
      where: { id: wisataId },
      data: {
        nama: nameFile,
        hotelId: 0,
        idImagekit: fileId,
        wisataId: wisataId,
        url: url,
      },
    });

    if (!updatedWisata) {
      return res.status(404).json({ message: "Wisata not found" });
    }

    const responseData = {
      success: true,
      message: "Succesfully update data wisata",
      data: {
        title: updatedWisata.title,
        deskripsi: updatedWisata.deskripsi,
        linkmap: updatedWisata.linkmap,
        alamat: updatedWisata.alamat,
        nohp: String(updatedWisata.nohp),
        harga_min: String(updatedWisata.harga_min),
        harga_max: String(updatedWisata.harga_max),
        kecamatanId: String(updatedWisata.kecamatanId),
        slug: updatedWisata.nameSlug,
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
    const findImage = await prisma.image.findUnique({
      where: { id: wisataId },
    });

    // Delete image from ImageKit
    const fileId = findImage.idImagekit;
    await imageKit.deleteFile(fileId);

    const deletedWisata = await prisma.wisata.delete({
      where: { id: wisataId },
    });

    const deleteImage = await prisma.image.delete({
      where: { id: wisataId },
    });

    if (!deletedWisata) {
      return res.status(404).json({ message: "Wisata not found" });
    }
    res.status(202).json({
      status: true,
      message: "Deleted data wisata sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWisatas,
  getWisataById,
  createWisata,
  updateWisata,
  deleteWisata,
};
