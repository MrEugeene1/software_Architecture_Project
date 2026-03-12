export class PostSlug {
  private readonly _value: string;

  constructor(value: string) {
    this._value = this.validateAndNormalize(value);
  }

  private validateAndNormalize(value: string): string {
    if (!value) {
      throw new Error('Slug cannot be empty');
    }

    let normalized = value.trim().toLowerCase();
    
    // Replace spaces and special characters with hyphens
    normalized = normalized.replace(/[^a-z0-9]+/g, '-');
    
    // Remove leading/trailing hyphens
    normalized = normalized.replace(/^-+|-+$/g, '');

    if (!normalized) {
      throw new Error('Slug must not be empty after removing invalid characters');
    }

    if (normalized.length < 3 || normalized.length > 100) {
      throw new Error('Slug must be between 3 and 100 characters');
    }

    return normalized;
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }

  public equals(other: PostSlug): boolean {
    return this._value === other._value;
  }

  public static generateFromTitle(title: string): string {
    let normalized = title.trim().toLowerCase();
    normalized = normalized.replace(/[^a-z0-9]+/g, '-');
    normalized = normalized.replace(/^-+|-+$/g, '');

    if (!normalized) {
      normalized = `post-${Math.floor(Math.random() * 1000000)}`;
    }

    if (normalized.length > 100) {
      normalized = normalized.substring(0, 100).replace(/-+$/, '');
    }
    
    return normalized;
  }
}
