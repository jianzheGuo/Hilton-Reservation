import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Reservation } from "../schemas/reservation.schema";
import { Model, Types } from "mongoose";
import { ParentReserveType } from "./type/parent-reserve-type";
import { CreateReservationInput } from "./dto/create-reservation.dto";
import { CancelReserveType } from "./type/cancel-reserve-type";
import { UpdateReservationInput } from "./dto/update-reservation.dto";

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

  async getUserReservations(userId: string): Promise<ParentReserveType[]> {
    const reservations = await this.reserveModel
      .find({
        created_user: userId,
      })
      .sort({ expected_arrive_time: "desc" });
    return reservations.map((reservation) => {
      return {
        ...reservation.toObject(),
      } as ParentReserveType;
    });
  }

  async cancelReservation(input: { id: string }): Promise<CancelReserveType> {
    const reservations = await this.reserveModel.findByIdAndUpdate(
      new Types.ObjectId(input.id),
      {
        status: "Cancelled",
      },
      { new: true },
    );
    return {
      ...(reservations?.toObject() ?? {}),
    } as CancelReserveType;
  }

  async updateReservation(input: {
    id: string;
    updateReservationInput: UpdateReservationInput;
  }): Promise<ParentReserveType> {
    const updateData = {};

    if (input.updateReservationInput.name) {
      updateData["guest_name"] = input.updateReservationInput.name;
    }

    if (input.updateReservationInput.phone) {
      updateData["guest_phone"] = input.updateReservationInput.phone;
    }

    if (input.updateReservationInput.email) {
      updateData["guest_email"] = input.updateReservationInput.email;
    }

    if (input.updateReservationInput.tableSize) {
      updateData["table_size"] = input.updateReservationInput.tableSize;
    }

    if (input.updateReservationInput.arrivalTime) {
      updateData["expected_arrive_time"] =
        input.updateReservationInput.arrivalTime;
    }

    if (input.updateReservationInput.status) {
      updateData["status"] = input.updateReservationInput.status;
    }

    const updatedReservation = await this.reserveModel.findByIdAndUpdate(
      new Types.ObjectId(input.id),
      updateData,
      { new: true },
    );

    return {
      ...(updatedReservation?.toObject() ?? {}),
    } as ParentReserveType;
  }
}
