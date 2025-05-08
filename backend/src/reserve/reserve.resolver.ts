import { Mutation, Resolver, Args, Query } from "@nestjs/graphql";
import { ReserveService } from "./reserve.service";
import { CreateReservationInput } from "./dto/create-reservation.dto";
import { ParentReserveType } from "./type/parent-reserve-type";
import { CancelReserveType } from "./type/cancel-reserve-type";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { UpdateReservationInput } from "./dto/update-reservation.dto";

@Resolver(() => ParentReserveType)
export class ReserveResolver {
  constructor(private readonly reserveService: ReserveService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => ParentReserveType, { name: "createReservation" })
  async createReservation(
    @Args("createReservationInput") input: CreateReservationInput,
  ): Promise<ParentReserveType> {
    try {
      return await this.reserveService.createReservation(input);
    } catch (error) {
      throw new Error(`Fail to create reservation: ${error.message}`);
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => [ParentReserveType], { name: "getUserReservations" })
  async getUserReservations(
    @Args("userId") userId: string,
  ): Promise<ParentReserveType[]> {
    try {
      return await this.reserveService.getUserReservations(userId);
    } catch (error) {
      throw new Error(`Fail to get reservation: ${error.message}`);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CancelReserveType, { name: "cancelReservation" })
  async cancelReservation(@Args("id") id: string): Promise<CancelReserveType> {
    try {
      return await this.reserveService.cancelReservation({ id });
    } catch (error) {
      throw new Error(`Fail to cancel reservation: ${error.message}`);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ParentReserveType, { name: "updateReservation" })
  async updateReservation(
    @Args("id") id: string,
    @Args("updateReservationInput")
    updateReservationInput: UpdateReservationInput,
  ): Promise<ParentReserveType> {
    try {
      return await this.reserveService.updateReservation({
        id,
        updateReservationInput,
      });
    } catch (error) {
      throw new Error(`Failed to update reservation: ${error.message}`);
    }
  }
}
