-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ulasan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tempat" TEXT NOT NULL,
    "ulasan" TEXT NOT NULL,

    CONSTRAINT "ulasan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kecamatan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "kecamatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fasilitas_hotel" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "hotelId" INTEGER,

    CONSTRAINT "fasilitas_hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fasilitas_wisata" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "wisataId" INTEGER,

    CONSTRAINT "fasilitas_wisata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "linkmap" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "nohp" TEXT NOT NULL,
    "hargaMin" TEXT NOT NULL,
    "hargaMax" TEXT NOT NULL,
    "isPopular" BOOLEAN NOT NULL,
    "jarak" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "checkIn" TEXT NOT NULL,
    "checkOut" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "kecamatanId" INTEGER NOT NULL,
    "image1" TEXT NOT NULL,
    "image2" TEXT NOT NULL,
    "image3" TEXT NOT NULL,

    CONSTRAINT "hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wisata" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "linkmap" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "nohp" TEXT NOT NULL,
    "hargaMin" TEXT NOT NULL,
    "hargaMax" TEXT NOT NULL,
    "jarak" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "jam_buka" TEXT NOT NULL,
    "jam_tutup" TEXT NOT NULL,
    "isPopular" BOOLEAN NOT NULL,
    "kecamatanId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "image1" TEXT NOT NULL,
    "image2" TEXT NOT NULL,
    "image3" TEXT NOT NULL,

    CONSTRAINT "wisata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WisataHasHotel" (
    "id" SERIAL NOT NULL,
    "hotelId" INTEGER,
    "wisataId" INTEGER,

    CONSTRAINT "WisataHasHotel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "kecamatan_slug_key" ON "kecamatan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_slug_key" ON "hotel"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "wisata_slug_key" ON "wisata"("slug");

-- AddForeignKey
ALTER TABLE "fasilitas_hotel" ADD CONSTRAINT "fasilitas_hotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fasilitas_wisata" ADD CONSTRAINT "fasilitas_wisata_wisataId_fkey" FOREIGN KEY ("wisataId") REFERENCES "wisata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel" ADD CONSTRAINT "hotel_kecamatanId_fkey" FOREIGN KEY ("kecamatanId") REFERENCES "kecamatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wisata" ADD CONSTRAINT "wisata_kecamatanId_fkey" FOREIGN KEY ("kecamatanId") REFERENCES "kecamatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WisataHasHotel" ADD CONSTRAINT "WisataHasHotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WisataHasHotel" ADD CONSTRAINT "WisataHasHotel_wisataId_fkey" FOREIGN KEY ("wisataId") REFERENCES "wisata"("id") ON DELETE SET NULL ON UPDATE CASCADE;
