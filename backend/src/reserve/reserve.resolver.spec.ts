import { Test, TestingModule } from '@nestjs/testing';
import { ReserveResolver } from './reserve.resolver';
import { ReserveService } from './reserve.service';
import { AuthGuard } from '../auth/auth.guard';
import { ParentReserveType } from './type/parent-reserve-type';
import { CancelReserveType } from './type/cancel-reserve-type';
import { showReserveType } from './type/show-reserve-type';

describe('ReserveResolver', () => {
  let resolver: ReserveResolver;
  const mockService = {
    createReservation: jest.fn(),
    getUserReservations: jest.fn(),
    cancelReservation: jest.fn(),
    updateReservation: jest.fn(),
    getAdminReservationsByFilter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReserveResolver,
        { provide: ReserveService, useValue: mockService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true }) // Bypass auth guard
      .compile();

    resolver = module.get<ReserveResolver>(ReserveResolver);
    jest.clearAllMocks();
  });

  describe('createReservation', () => {
    it('should call service to create reservation with valid input', async () => {
      const mockInput = {
        name: 'John Doe',
        phone: '13800138000',
        email: 'test@example.com',
        tableSize: 4,
        arrivalTime: new Date(),
        createdUser: 'user123'
      };
      
      mockService.createReservation.mockResolvedValue(mockInput);
      
      const result = await resolver.createReservation(mockInput);
      expect(mockService.createReservation).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockInput);
    });

    it('should throw error when service fails to create reservation', async () => {
      const mockError = new Error('Database error');
      mockService.createReservation.mockRejectedValue(mockError);
      
      await expect(resolver.createReservation({} as any))
        .rejects.toThrow('Fail to create reservation: Database error');
    });
  });

  describe('getUserReservations', () => {
    it('should return user reservations with valid userId', async () => {
      const mockUserId = 'user123';
      const mockReservations = [{ _id: '1' }, { _id: '2' }] as ParentReserveType[];
      
      mockService.getUserReservations.mockResolvedValue(mockReservations);
      
      const result = await resolver.getUserReservations(mockUserId);
      expect(mockService.getUserReservations).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockReservations);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel reservation with valid ID', async () => {
      const mockId = 'reservation123';
      const mockResult = { _id: mockId, status: 'Cancelled' } as CancelReserveType;
      
      mockService.cancelReservation.mockResolvedValue(mockResult);
      
      const result = await resolver.cancelReservation(mockId);
      expect(mockService.cancelReservation).toHaveBeenCalledWith({ id: mockId });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAdminReservationsByFilter', () => {
    it('should return filtered reservations with valid parameters', async () => {
      const mockResults = [{ _id: '1' }, { _id: '2' }] as showReserveType[];
      mockService.getAdminReservationsByFilter.mockResolvedValue(mockResults);
      
      const result = await resolver.getAdminReservationsByFilter(
        '2023-01-01',
        '2023-12-31',
        ['Confirmed']
      );
      expect(mockService.getAdminReservationsByFilter).toHaveBeenCalledWith(
        '2023-01-01',
        '2023-12-31',
        ['Confirmed']
      );
      expect(result).toEqual(mockResults);
    });
  });
});
