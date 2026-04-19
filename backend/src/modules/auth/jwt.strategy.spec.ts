import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  describe('validate', () => {
    it('should return an object with userId, email, and role from the payload', async () => {
      const payload = {
        sub: 1,
        email: 'test@example.com',
        role: 'admin',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 1,
        email: 'test@example.com',
        role: 'admin',
      });
    });
  });
});