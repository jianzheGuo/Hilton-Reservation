import { Test, TestingModule } from "@nestjs/testing";
import { ReserveService } from "./reserve.service";
import { getModelToken } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Reservation } from "../schemas/reservation.schema";
import { User } from "../schemas/user.schema";
import { CreateReservationInput } from "./dto/create-reservation.dto";
import { UpdateReservationInput } from "./dto/update-reservation.dto";

describe("ReserveService", () => {
  let service: ReserveService;
  let reserveModel: Model<Reservation>;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReserveService,
        {
          provide: getModelToken(Reservation.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReserveService>(ReserveService);
    reserveModel = module.get<Model<Reservation>>(
      getModelToken(Reservation.name),
    );
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe("createReservation", () => {
    it("should create a new reservation", async () => {
      const mockInput: CreateReservationInput = {
        name: "John Doe",
        phone: "13800138000",
        email: "john@test.com",
        tableSize: 4,
        arrivalTime: new Date(),
        createdUser: new Types.ObjectId().toString(),
      };

      const mockReservation = {
        _id: new Types.ObjectId(),
        toObject: jest.fn().mockReturnValue({
          guest_name: mockInput.name,
          guest_phone: mockInput.phone,
          guest_email: mockInput.email,
          table_size: mockInput.tableSize,
          expected_arrive_time: mockInput.arrivalTime,
          status: "Requested",
        }),
      };

      jest
        .spyOn(reserveModel, "create")
        .mockResolvedValue(mockReservation as any);

      const result = await service.createReservation(mockInput);

      expect(mockReservation.toObject).toHaveBeenCalled();
      expect(result).toHaveProperty("guest_name", mockInput.name);
    });
  });

  // describe("getUserReservations", () => {
  //   it("should return user reservations sorted by date", async () => {
  //     const userId = new Types.ObjectId().toString();
  //     const mockReservations = [
  //       {
  //         _id: new Types.ObjectId(),
  //         guest_name: "Reservation 1",
  //       },
  //       {
  //         _id: new Types.ObjectId(),
  //         guest_name: "Reservation 2",
  //       },
  //     ];

  //     const mockQuery = {
  //       sort: jest.fn().mockReturnValue({
  //         exec: jest.fn().mockResolvedValue(mockReservations)
  //       })
  //     };

  //     jest.spyOn(reserveModel, "find").mockReturnValue(mockQuery as any);

  //     const result = await service.getUserReservations(userId);

  //     expect(reserveModel.find).toHaveBeenCalledWith({ created_user: userId });
  //     // expect(result.length).toBe(2);
  //     // expect(result[0].guest_name).toBe("Reservation 1");
  //   });
  // });

  describe("cancelReservation", () => {
    it("should cancel a reservation", async () => {
      const reservationId = new Types.ObjectId().toString();
      const mockReservation = {
        toObject: jest.fn().mockReturnValue({
          _id: new Types.ObjectId(reservationId),
          status: "Cancelled",
        }),
      };

      jest
        .spyOn(reserveModel, "findByIdAndUpdate")
        .mockResolvedValue(mockReservation);

      const result = await service.cancelReservation({ id: reservationId });

      expect(reserveModel.findByIdAndUpdate).toHaveBeenCalledWith(
        new Types.ObjectId(reservationId),
        { status: "Cancelled" },
        { new: true },
      );
      expect(mockReservation.toObject).toHaveBeenCalled();
      expect(result.status).toBe("Cancelled");
    });
  });

  describe("updateReservation", () => {
    it("should update reservation fields", async () => {
      const updateInput = {
        id: new Types.ObjectId().toString(),
        updateReservationInput: {
          name: "Updated Name",
          phone: "13900139000",
          tableSize: 6,
        } as UpdateReservationInput,
        user_id: new Types.ObjectId().toString(),
      };

      const mockUpdated = {
        _id: updateInput.id,
        toObject: jest.fn().mockReturnValue({
          guest_name: "Updated Name",
          guest_phone: "13900139000",
          table_size: 6,
        }),
      };

      jest
        .spyOn(reserveModel, "findByIdAndUpdate")
        .mockResolvedValue(mockUpdated);

      const result = await service.updateReservation(updateInput);

      expect(mockUpdated.toObject).toHaveBeenCalled();
      expect(result.guest_name).toBe("Updated Name");
    });
  });

  describe("getAdminReservationsByFilter", () => {
    it("should filter reservations with date range and status", async () => {
      const mockAggregateResult = [
        {
          _id: new Types.ObjectId(),
          guest_name: "Admin Reservation",
          created_user_name: "Admin User",
        },
      ];

      jest
        .spyOn(reserveModel, "aggregate")
        .mockResolvedValue(mockAggregateResult);

      const result = await service.getAdminReservationsByFilter(
        "2024-01-01",
        "2024-12-31",
        ["Confirmed", "Completed"],
      );

      expect(reserveModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: {
              expected_arrive_time: {
                $gte: expect.any(Date),
                $lte: expect.any(Date),
              },
              status: { $in: ["Confirmed", "Completed"] },
            },
          }),
        ]),
      );
      expect(result[0].created_user_name).toBe("Admin User");
    });
  });
});
