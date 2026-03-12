export class CommentContent {
  private readonly _value: string;

  constructor(value: string) {
    this._value = this.validateAndNormalize(value);
  }

  private validateAndNormalize(value: string): string {
    if (!value) {
      throw new Error('Comment content cannot be empty');
    }

    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new Error('Comment content cannot be just whitespace');
    }

    if (normalized.length > 500) {
      throw new Error('Comment content cannot be more than 500 characters');
    }

    return normalized;
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }
}
