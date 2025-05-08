import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Reservation } from "../schemas/reservation.schema";
import { User } from "../schemas/user.schema";
import { Model, Types } from "mongoose";
import { ParentReserveType } from "./type/parent-reserve-type";
import { CreateReservationInput } from "./dto/create-reservation.dto";
import { CancelReserveType } from "./type/cancel-reserve-type";
import { UpdateReservationInput } from "./dto/update-reservation.dto";
import { showReserveType } from "./type/show-reserve-type";

@Injectable()
export class ReserveService {
  constructor(
    @InjectModel(Reservation.name) private reserveModel: Model<Reservation>,
    @InjectModel(User.name) private userModel: Model<User>,
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
      updated_date: new Date(),
      updated_user: input.createdUser,
      status: "Requested",
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
    user_id: string;
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
      {
        ...updateData,
        updated_date: new Date(),
        updated_user: input.user_id || "",
      },
      { new: true },
    );

    return {
      ...(updatedReservation?.toObject() ?? {}),
    } as ParentReserveType;
  }

  async getAdminReservationsByFilter(
    startDate?: string,
    endDate?: string,
    status?: string[],
  ): Promise<showReserveType[]> {
    const filterBuilder: Record<string, any> = {};

    if (startDate || endDate) {
      const dateCondition: Record<string, Date> = {};
      if (startDate) dateCondition.$gte = new Date(startDate);
      if (endDate) dateCondition.$lte = new Date(endDate);
      filterBuilder.expected_arrive_time = dateCondition;
    }

    if (status?.length) {
      filterBuilder.status = { $in: status };
    }

    const reservations = await this.reserveModel.aggregate([
      { $match: filterBuilder },
      {
        $sort: { expected_arrive_time: -1 },
      },
      {
        $addFields: {
          created_user_obj_id: { $toObjectId: "$created_user" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_user_obj_id",
          foreignField: "_id",
          as: "user_info",
        },
      },
      {
        $addFields: {
          created_user_name: {
            $cond: {
              if: { $gt: [{ $size: "$user_info" }, 0] },
              then: { $arrayElemAt: ["$user_info.name", 0] },
              else: "Unknown User",
            },
          },
          updated_user: {
            $ifNull: ["$updated_user", "Unknown User"],
          },
          updated_date: {
            $ifNull: ["$updated_date", new Date("1970-01-01T00:00:00.000Z")],
          },
          status: {
            $ifNull: ["$status", "Requested"],
          },
        },
      },
      {
        $project: {
          user_info: 0,
        },
      },
    ]);

    return reservations as showReserveType[];
  }
}
