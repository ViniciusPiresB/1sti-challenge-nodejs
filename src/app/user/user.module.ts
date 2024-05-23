import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Module({
    controllers: [],
    providers: [PrismaService],
    exports: []
})
export class UserModule {}