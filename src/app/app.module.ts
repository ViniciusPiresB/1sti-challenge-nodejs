import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AddressModule } from "./address/address.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./auth/roles/roles.guard";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [UserModule, AddressModule, AuthModule, JwtModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
