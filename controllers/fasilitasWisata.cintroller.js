const { fasilitasWisata } = require("../models"),
  utils = require("../utils");

module.exports = {
  createfasilitasWisata: async (req, res, next) => {
    try {
      console.log(req.body, "Shay")
      const { nama, isActive, jumlah, wisataId } = req.body;
      const newFasilitasWisata = await fasilitasWisata.create({
        data: {
          nama: nama,
          isActive : Boolean(isActive),
          jumlah: parseInt(jumlah),
          wisataId : parseInt(wisataId)
        },
      });
      if (!newFasilitasWisata) {
        return res.status(500).json({
          error: "Gagal membuat fasilitas wisata.",
        });
      }

      return res.status(201).json({
        data: newFasilitasWisata,
      });
    } catch (error) {
      next(error);
    }
  
  },
  getfasilitasWisata: async (req, res, next) => {
    try {
      const dataFasilitasWisata = await fasilitasWisata.findFirst({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(201).json({
        data: dataFasilitasWisata,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllFasilitasWisata: async (req, res, next) => {
    try {
      const dataFasilitasWisata = await fasilitasWisata.findMany();

      return res.status(201).json({
        data: dataFasilitasWisata,
      });
    } catch (error) {
      next(error);
    }
  },
  updatefasilitasWisata: async (req, res, next) => {
    try {
    const { nama, isActive, jumlah, wisataId } = req.body;
      const data = await fasilitasWisata.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          nama: nama,
          isActive : Boolean(isActive),
          jumlah: parseInt(jumlah),
          wisataId : parseInt(wisataId)
          
        },
      });

      return res.status(200).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  destroyfasilitasWisa: async (req, res, next) => {
    try {
      const dataFasilitas = await fasilitasWisata.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      return res.status(200).json(dataFasilitas );
    } catch (error) {
      return next(error);
    }
  },
};
