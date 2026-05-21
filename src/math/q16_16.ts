/**
 * Q16_16 — 16.16 signed fixed-point number
 *
 * Provides deterministic arithmetic for particle physics.
 * 1.0 is represented as 0x00010000 (65536).
 *
 * This is a TypeScript port/adaptation of the Q16_16 implementation
 * from Geneflux-Colony-Sandbox, tailored for Subatomic Pop.
 */
export class Q16_16 {
  private readonly rawValue: number;

  private constructor(raw: number) {
    this.rawValue = Math.trunc(raw);
  }

  // ==================== Constants ====================

  static readonly ZERO = new Q16_16(0);
  static readonly ONE = new Q16_16(0x00010000);
  static readonly MIN = new Q16_16(Number.MIN_SAFE_INTEGER);
  static readonly MAX = new Q16_16(Number.MAX_SAFE_INTEGER);

  // ==================== Construction ====================

  /** Create directly from a raw integer value (no scaling). */
  static fromRaw(raw: number): Q16_16 {
    return new Q16_16(raw);
  }

  /** Create from a whole number (e.g. 5 → 5.0). */
  static fromInteger(value: number): Q16_16 {
    return new Q16_16(value * 0x00010000);
  }

  /**
   * Create from a floating point number.
   * Use only for initialization or debugging — not deterministic.
   */
  static fromFloat(value: number): Q16_16 {
    return new Q16_16(value * 0x00010000);
  }

  // ==================== Conversion ====================

  /** Get the raw integer representation. */
  get raw(): number {
    return this.rawValue;
  }

  /** Truncate toward zero and return the integer part. */
  toInteger(): number {
    return Math.trunc(this.rawValue / 0x00010000);
  }

  /**
   * Approximate conversion to float.
   * Use only for rendering/debugging.
   */
  toFloat(): number {
    return this.rawValue / 0x00010000;
  }

  // ==================== Arithmetic ====================

  add(other: Q16_16): Q16_16 {
    return new Q16_16(this.rawValue + other.rawValue);
  }

  sub(other: Q16_16): Q16_16 {
    return new Q16_16(this.rawValue - other.rawValue);
  }

  mul(other: Q16_16): Q16_16 {
    // Use 64-bit intermediate to avoid precision loss
    const wide = BigInt(this.rawValue) * BigInt(other.rawValue);
    const result = Number(wide / BigInt(0x00010000));
    return new Q16_16(result);
  }

  div(other: Q16_16): Q16_16 {
    if (other.rawValue === 0) {
      throw new Error("Division by zero in Q16_16");
    }
    const wide = BigInt(this.rawValue) * BigInt(0x00010000);
    const result = Number(wide / BigInt(other.rawValue));
    return new Q16_16(result);
  }

  neg(): Q16_16 {
    return new Q16_16(-this.rawValue);
  }

  // ==================== Comparison ====================

  equals(other: Q16_16): boolean {
    return this.rawValue === other.rawValue;
  }

  lessThan(other: Q16_16): boolean {
    return this.rawValue < other.rawValue;
  }

  greaterThan(other: Q16_16): boolean {
    return this.rawValue > other.rawValue;
  }

  // ==================== Debugging ====================

  toString(): string {
    const integer = this.toInteger();
    const frac = Math.abs(this.rawValue) & 0xffff;
    const sign = this.rawValue < 0 ? "-" : "";
    return `Q16_16(${sign}${Math.abs(integer)}.${(frac * 100000 / 65536).toFixed(0).padStart(5, "0")})`;
  }
}