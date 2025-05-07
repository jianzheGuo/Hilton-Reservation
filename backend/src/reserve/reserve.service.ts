import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Reservation } from "../schemas/reservation.schema";
import { Model, Types } from "mongoose";
import { ParentReserveType } from "./type/parent-reserve-type";
import { CreateReservationInput } from "./dto/create-reservation.dto";

@Injectable()
export class ReserveService {
  constructor(
    @InjectModel(Reservation.name) private reserveModel: Model<Reservation>,
  ) {}
  async createReservation(
    input: CreateReservationInput,
  ): Promise<ParentReserveType> {
    const saved = await this.reserveModel.create({
      _id: new Types.ObjectId(),
      guest_name: input.name,
      guest_phone: input.phone,
      guest_email: input.email,
      expected_arrive_time: input.arrivalTime,
      table_size: input.tableSize,
      created_user: input.createdUser,
    });
    return {
      ...saved.toObject(),
    } as ParentReserveType;
  }
}
