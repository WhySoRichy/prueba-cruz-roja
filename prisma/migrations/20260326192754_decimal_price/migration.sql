-- AlterTable
ALTER TABLE `product` MODIFY `price` DECIMAL(10, 2) NOT NULL;

-- CreateIndex
CREATE INDEX `Product_name_idx` ON `Product`(`name`);
