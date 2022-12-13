export class Content {
  private readonly content: string;

  constructor(content: string) {
    const isValidContentLength = this.validateContentLength(content);

    if (!isValidContentLength) {
      throw new Error('Content length must be between 5 and 200 characters.');
    }

    this.content = content;
  }

  public get value(): string {
    return this.content;
  }

  private validateContentLength(content: string): boolean {
    return content.length >= 5 && content.length <= 200;
  }
}
