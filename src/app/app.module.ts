import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AddressModule } from "./address/address.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [UserModule, AddressModule, AuthModule],
  controllers: [],
  providers: []
})
export class AppModule {}
