-- Migration: add_enable_chat_phone_to_digital_ad
-- تاریخ: ۲۰۲۶-۰۸-۰۴

BEGIN;

ALTER TABLE "DigitalAd" ADD COLUMN "enableChat" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DigitalAd" ADD COLUMN "enablePhone" BOOLEAN NOT NULL DEFAULT false;

COMMIT;
