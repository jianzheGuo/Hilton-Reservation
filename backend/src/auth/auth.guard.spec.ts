import { Test } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn()
          }
        }
      ]
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('HTTP Context', () => {
    it('should allow authenticated requests', async () => {
      const mockContext = {
        getType: jest.fn().mockReturnValue('http'),
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer valid.token' }
          })
        })
      } as unknown as ExecutionContext;

      jwtService.verifyAsync = jest.fn().mockResolvedValue({ sub: 'user123' });

      await expect(guard.canActivate(mockContext)).resolves.toBe(true);
    });
  });

  describe('GraphQL Context', () => {
    it('should allow authenticated requests', async () => {
      const mockReq = { headers: { authorization: 'Bearer valid.token' } };
      const mockContext = {
        getType: jest.fn().mockReturnValue('graphql'),
        getClass: jest.fn(),
        getHandler: jest.fn()
      } as unknown as ExecutionContext;

      jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
        getContext: () => ({ req: mockReq })
      } as any);

      jwtService.verifyAsync = jest.fn().mockResolvedValue({ sub: 'user123' });

      await expect(guard.canActivate(mockContext)).resolves.toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should throw for missing authorization header', async () => {
      const mockContext = {
        getType: jest.fn().mockReturnValue('http'),
        switchToHttp: () => ({
          getRequest: () => ({ headers: {} })
        })
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw for invalid token format', async () => {
      const mockContext = {
        getType: jest.fn().mockReturnValue('http'),
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Invalid token' }
          })
        })
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw for invalid JWT', async () => {
      const mockContext = {
        getType: jest.fn().mockReturnValue('http'),
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer invalid.token' }
          })
        })
      } as unknown as ExecutionContext;

      jwtService.verifyAsync = jest.fn().mockRejectedValue(new Error());

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('Token Extraction', () => {
    it('should correctly extract token from header', () => {
      const mockRequest = {
        headers: { authorization: 'Bearer test.token' }
      };
      const result = guard['extractTokenFromHeader'](mockRequest as any);
      expect(result).toBe('test.token');
    });

    it('should return undefined for invalid header format', () => {
      const mockRequest = {
        headers: { authorization: 'InvalidFormat' }
      };
      const result = guard['extractTokenFromHeader'](mockRequest as any);
      expect(result).toBeUndefined();
    });
  });
});