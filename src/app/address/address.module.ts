import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { AddressService } from "./address.service";
import { UserService } from "../user/user.service";

@Module({
  controllers: [],
  providers: [PrismaService, UserService],
  exports: [AddressService]
})
export class AddressModule {}
