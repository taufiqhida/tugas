const { fasilitasHotel } = require("../models"),
  utils = require("../utils");

module.exports = {
  createfasilitasHotel: async (req, res, next) => {
    try {
      const { nama, isActive, jumlah, hotelId } = req.body;
      const newFasilitasHotel = await fasilitasHotel.create({
        data: {
          nama: nama,
          isActive : isActive,
          jumlah : jumlah,
          hotelId : parseInt(hotelId)
        },
      });

      return res.status(201).json({
        data: newFasilitasHotel,
      });
    } catch (error) {
      next(error);
    }
  },
  getfasilitasHotel: async (req, res, next) => {
    try {
      const dataFasilitasHotel = await fasilitasHotel.findFirst({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(201).json({
        data: dataFasilitasHotel,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllFasilitasHotel: async (req, res, next) => {
    try {
      const dataFasilitasHotel = await fasilitasHotel.findMany();

      return res.status(201).json({
        data: dataFasilitasHotel,
      });
    } catch (error) {
      next(error);
    }
  },
  updatefasilitasHotel: async (req, res, next) => {
    try {
    const { nama, isActive, jumlah, hotelId } = req.body;
      const data = await fasilitasHotel.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          nama: nama,
          isActive: isActive,
          jumlah: jumlah,
          hotelId: parent( hotelId),
          
        },
      });

      return res.status(200).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  destroyfasilitasHotel: async (req, res, next) => {
    try {
      const dataFasilitas = await fasilitasHotel.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      return res.status(200).json("Data Berhasil di hps",dataFasilitas );
    } catch (error) {
      return next(error);
    }
  },
};
