const { kecamatan, hotel, wisata } = require("../models"),
  utils = require("../utils");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { nama } = req.body;
      const nameSlug = await utils.createSlug(nama);
      const data = await kecamatan.create({
        data: {
          nama: nama,
          slug: nameSlug,
        },
      });

      return res.status(201).json({
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  getKecamatan: async (req, res, next) => {
    try {
      const dataKecamatan = await kecamatan.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(201).json({
        data: dataKecamatan,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllKecamatan: async (req, res, next) => {
    try {
      const dataKecamatan = await kecamatan.findMany();

      return res.status(201).json({
        data: dataKecamatan,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const namaSlug = await utils.createSlug(req.body.nama);
      const data = await kecamatan.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          nama: req.body.nama,
          slug: namaSlug,
        },
      });

      return res.status(200).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const dataKecamatan = await kecamatan.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      return res.status(200).json("Data Berhasil di hps", dataKecamatan);
    } catch (error) {
      return next(error);
    }
  },
  getAllKecamatanAndCountHotelOrWisata : async (req, res, next) => {
    try {
      try {
        const dataKecamatan = await kecamatan.findMany({
          include:{
            _count:{
              select:{
                hotels:true,
                wisatas: true
              }
            }
          }
        });

  
        res.status(200).json({
          status: true,
          message: "OK!",
          err: null,
          data: dataKecamatan,
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: "Bad request!",
          err: err.message,
          data: null,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  getAllHotelByKecamatan : async(req, res, next)=>{
    try {
      const dataKecamatan = await kecamatan.findUnique({
        where: {
          id: parseInt(req.params.id),
        },include:{
          hotels: true
        },
      });
      return res.status(201).json({
        data: dataKecamatan,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllWisataByKecamatan : async(req, res, next)=>{
    try {
      const dataKecamatan = await kecamatan.findUnique({
        where: {
          id: parseInt(req.params.id),
        },include:{
          wisatas: true
        },
      });
      return res.status(201).json({
        data: dataKecamatan,
      });
    } catch (error) {
      next(error);
    }
  }
};
