import { Module } from "@nestjs/common";
import { ReserveResolver } from "./reserve.resolver";
import { ReserveService } from "./reserve.service";
import { Reservation, ReservationSchema } from "../schemas/reservation.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { User, UserSchema } from "../schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  providers: [ReserveResolver, ReserveService, JwtService],
  exports: [ReserveService],
})
export class ReserveModule {}
