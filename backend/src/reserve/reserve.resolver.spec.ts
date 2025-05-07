import { Test, TestingModule } from "@nestjs/testing";
import { ReserveResolver } from "./reserve.resolver";

describe("ReserveResolver", () => {
  let resolver: ReserveResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReserveResolver],
    }).compile();

    resolver = module.get<ReserveResolver>(ReserveResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
