import { AuthValidationPipe } from "@modules/auth/infra/http/controllers/validations/auth-validation.pipe";
import { AppValidationError } from "@shared/resources/errors/app-validation.error";


describe('AuthValidationPipe', () => {
  let authValidationPipe: AuthValidationPipe;

  beforeEach(async () => {
    authValidationPipe = new AuthValidationPipe();
  });

  it('should be defined', () => {
    expect(authValidationPipe).toBeDefined();
  });

  describe('transform', () => {
    const body = {
      email: 'fake_email@gmail.com',
      password: "fake_password",
    };

    it('should return body', async () => {
      const response = authValidationPipe.transform(body, {
        type: 'body',
      });

      expect(response).toEqual(body);
    });

    it('should throw AppValidationError upon body schema validation failure', () => {
      expect(() => {
        authValidationPipe.transform(
          { ...body, email: 0 },
          { type: 'body' },
        );
      }).toThrow(new AppValidationError());
    });

    it('should throw AppValidationError upon body schema validation failure', () => {
      expect(() => {
        authValidationPipe.transform(
          { ...body, password: 0 },
          { type: 'body' },
        );
      }).toThrow(new AppValidationError());
    });

    it('should return the default value', async () => {
      expect(()=>authValidationPipe.transform(
        {},
        { type: 'custom' },
      )).toThrow(new AppValidationError());
    });
  });
});
