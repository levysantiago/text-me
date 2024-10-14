import { AddFriendValidationPipe } from "@modules/friendship/infra/http/controllers/validations/add-friend-validation.pipe";
import { AppValidationError } from "@shared/resources/errors/app-validation.error";


describe('AddFriendValidationPipe', () => {
  let addFriendValidationPipe: AddFriendValidationPipe;

  beforeEach(async () => {
    addFriendValidationPipe = new AddFriendValidationPipe();
  });

  it('should be defined', () => {
    expect(addFriendValidationPipe).toBeDefined();
  });

  describe('transform', () => {
    const body = {
      friendEmail: 'fake_email@gmail.com',
    };

    it('should return body', async () => {
      const response = addFriendValidationPipe.transform(body, {
        type: 'body',
      });

      expect(response).toEqual(body);
    });

    it('should throw AppValidationError upon body schema validation failure', () => {
      expect(() => {
        addFriendValidationPipe.transform(
          { ...body, friendEmail: 0 },
          { type: 'body' },
        );
      }).toThrow(new AppValidationError());
    });

    it('should return the default value', async () => {
      expect(()=>addFriendValidationPipe.transform(
        {},
        { type: 'custom' },
      )).toThrow(new AppValidationError());
    });
  });
});
