-- CreateEnum
CREATE TYPE "service_type" AS ENUM ('permit_acquisition', 'monitoring');

-- CreateEnum
CREATE TYPE "quotation_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "client" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "service_type" "service_type" NOT NULL,
    "description" TEXT,
    "status" "quotation_status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" INTEGER NOT NULL,
    "quickbooks_estimate_id" TEXT,
    "is_synced" BOOLEAN NOT NULL DEFAULT false,
    "synced_at" TIMESTAMP(3),

    CONSTRAINT "quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permit_request" (
    "id" SERIAL NOT NULL,
    "quotation_id" INTEGER NOT NULL,
    "permit_type_id" INTEGER,
    "custom_name" TEXT,

    CONSTRAINT "permit_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permit_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "agency_id" INTEGER NOT NULL,
    "quickbooks_item_id" TEXT,
    "price" DOUBLE PRECISION,
    "description" TEXT,

    CONSTRAINT "permit_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "agency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "quotation_quickbooks_estimate_id_key" ON "quotation"("quickbooks_estimate_id");

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permit_request" ADD CONSTRAINT "permit_request_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permit_request" ADD CONSTRAINT "permit_request_permit_type_id_fkey" FOREIGN KEY ("permit_type_id") REFERENCES "permit_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permit_type" ADD CONSTRAINT "permit_type_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
