import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { AddressService } from "./address.service";

@Module({
  controllers: [],
  providers: [PrismaService],
  exports: [AddressService]
})
export class AddressModule {}
