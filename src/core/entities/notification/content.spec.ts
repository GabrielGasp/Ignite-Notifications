import { Content } from './content.entity';

describe('Notification content', () => {
  it('it should be able to create a notification content', () => {
    const content = new Content('content');
    expect(content.value).toBe('content');
  });

  it('it should not be able to create a notification content with less than 5 characters', () => {
    expect(() => new Content('less')).toThrowError(
      'Content length must be between 5 and 200 characters.',
    );
  });

  it('it should not be able to create a notification content with more than 200 characters', () => {
    expect(() => new Content('a'.repeat(201))).toThrowError(
      'Content length must be between 5 and 200 characters.',
    );
  });
});
