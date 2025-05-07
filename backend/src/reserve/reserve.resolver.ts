import { Mutation, Resolver, Args } from "@nestjs/graphql";
import { ReserveService } from "./reserve.service";
import { CreateReservationInput } from "./dto/create-reservation.dto";
import { ParentReserveType } from "./type/parent-reserve-type";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";

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
}
