const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  admin: prisma.admin,
  ulasan: prisma.ulasan,
  kecamatan: prisma.kecamatan,
  fasilitasHotel: prisma.fasilitasHotel,
  fasilitasWisata: prisma.fasilitasWisata,
  hotel: prisma.hotel,
  wisata: prisma.wisata,
  wisataHasHotel: prisma.wisataHasHotel,
};
