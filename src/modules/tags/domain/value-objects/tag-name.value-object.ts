export class TagName {
  private readonly _value: string;

  constructor(value: string) {
    this._value = this.validateAndNormalize(value);
  }

  private validateAndNormalize(value: string): string {
    if (!value) {
      throw new Error('Tag name cannot be empty');
    }

    const normalized = value.trim().toLowerCase();

    if (normalized.length < 2 || normalized.length > 50) {
      throw new Error('Tag name must be between 2 and 50 characters');
    }

    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(normalized)) {
      throw new Error(
        'Tag name must be alphanumeric and may contain hyphens',
      );
    }

    return normalized;
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: TagName): boolean {
    return this._value === other._value;
  }
}
