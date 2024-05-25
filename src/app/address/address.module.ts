import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { AddressService } from "./address.service";
import { UserService } from "../user/user.service";
import { AddressController } from "./address.controller";

@Module({
  controllers: [AddressController],
  providers: [PrismaService, UserService, AddressService],
  exports: [AddressService]
})
export class AddressModule {}
