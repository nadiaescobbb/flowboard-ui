import { describe, it, expect } from 'vitest';
import { ok, err, isOk, isErr } from './result';

describe('Result monad pattern', () => {
  it('creates an Ok result', () => {
    const res = ok(42);
    expect(res.isOk).toBe(true);
    expect(res.isErr).toBe(false);
    expect(isOk(res)).toBe(true);
    expect(isErr(res)).toBe(false);
    if (isOk(res)) {
      expect(res.value).toBe(42);
    }
  });

  it('creates an Err result', () => {
    const error = new Error('Test error');
    const res = err(error);
    expect(res.isOk).toBe(false);
    expect(res.isErr).toBe(true);
    expect(isOk(res)).toBe(false);
    expect(isErr(res)).toBe(true);
    if (isErr(res)) {
      expect(res.error.message).toBe('Test error');
    }
  });
});
