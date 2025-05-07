import { Module } from "@nestjs/common";
import { ReserveResolver } from "./reserve.resolver";
import { ReserveService } from "./reserve.service";
import { Reservation, ReservationSchema } from "../schemas/reservation.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    AuthModule,
  ],
  providers: [ReserveResolver, ReserveService, JwtService],
  exports: [ReserveService],
})
export class ReserveModule {}
