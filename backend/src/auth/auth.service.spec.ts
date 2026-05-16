import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { argon2 } from 'crypto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const hashedPassword = await argon2.hash(dto.password);
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

function expect(service: AuthService) {
  throw new Error('Function not implemented.');
}
