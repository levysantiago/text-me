import { UpdateUserValidationPipe } from "@modules/user/infra/http/controllers/validations/update-user-validation.pipe";
import { AppValidationError } from "@shared/resources/errors/app-validation.error";


describe('UpdateUserValidationPipe', () => {
  let updateUserValidationPipe: UpdateUserValidationPipe;

  beforeEach(async () => {
    updateUserValidationPipe = new UpdateUserValidationPipe();
  });

  it('should be defined', () => {
    expect(updateUserValidationPipe).toBeDefined();
  });

  describe('transform', () => {
    const body = {
      name: "fake_name",
      password: "fake_password",
    };

    it('should return body', async () => {
      const response = updateUserValidationPipe.transform(body, {
        type: 'body',
      });

      expect(response).toEqual(body);
    });

    it('should throw AppValidationError upon body schema validation failure', () => {
      expect(() => {
        updateUserValidationPipe.transform(
          { ...body, password: 0 },
          { type: 'body' },
        );
      }).toThrow(new AppValidationError());
    });

    it('should throw AppValidationError upon body schema validation failure', () => {
      expect(() => {
        updateUserValidationPipe.transform(
          { ...body, name: 0 },
          { type: 'body' },
        );
      }).toThrow(new AppValidationError());
    });

    it('should return the default value', async () => {
      expect(()=> updateUserValidationPipe.transform(
        {},
        { type: 'custom' },
      )).toThrow(new AppValidationError());
    });
  });
});
