import { CreateUserValidationPipe } from "@modules/user/infra/http/controllers/validations/create-user-validation.pipe";
import { AppValidationError } from "@shared/resources/errors/app-validation.error";


describe('CreateUserValidationPipe', () => {
  let createUserValidationPipe: CreateUserValidationPipe;

  beforeEach(async () => {
    createUserValidationPipe = new CreateUserValidationPipe();
  });

  it('should be defined', () => {
    expect(createUserValidationPipe).toBeDefined();
  });

  describe('transform', () => {
    const body = {
      email: 'fake_email@gmail.com',
      name: "fake_name",
      password: "fake_password",
    };

    it('should return body', async () => {
      const response = createUserValidationPipe.transform(body, {
        type: 'body',
      });

      expect(response).toEqual(body);
    });

    it('should throw AppValidationError upon body schema validation failure', () => {
      expect(() => {
        createUserValidationPipe.transform(
          { ...body, email: 0 },
          { type: 'body' },
        );
      }).toThrow(new AppValidationError());
    });

    it('should throw AppValidationError upon body schema validation failure', () => {
      expect(() => {
        createUserValidationPipe.transform(
          { ...body, password: 0 },
          { type: 'body' },
        );
      }).toThrow(new AppValidationError());
    });

    it('should throw AppValidationError upon body schema validation failure', () => {
      expect(() => {
        createUserValidationPipe.transform(
          { ...body, name: 0 },
          { type: 'body' },
        );
      }).toThrow(new AppValidationError());
    });

    it('should return the default value', async () => {
      expect(()=> createUserValidationPipe.transform(
        {},
        { type: 'custom' },
      )).toThrow(new AppValidationError());
    });
  });
});
