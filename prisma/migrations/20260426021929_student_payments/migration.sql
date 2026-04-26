-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "tuitionDiscountBrl" DECIMAL(12,2),
ADD COLUMN     "tuitionDueDay" INTEGER,
ADD COLUMN     "tuitionMonthlyAmountBrl" DECIMAL(12,2),
ADD COLUMN     "tuitionPaymentMethod" TEXT;
