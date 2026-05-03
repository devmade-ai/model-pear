import { describe, it, expect } from 'vitest';
import { safeStringify } from '../../src/lib/utils/safeStringify';

describe('safeStringify', () => {
  it('returns empty string for undefined and null', () => {
    expect(safeStringify(undefined)).toBe('');
    expect(safeStringify(null)).toBe('');
  });

  it('serialises plain objects, arrays, and primitives', () => {
    expect(safeStringify({ a: 1 })).toBe('{"a":1}');
    expect(safeStringify([1, 'two', true])).toBe('[1,"two",true]');
    expect(safeStringify('plain')).toBe('"plain"');
    expect(safeStringify(42)).toBe('42');
    expect(safeStringify(true)).toBe('true');
  });

  it('returns sentinel for circular references instead of throwing', () => {
    interface Cycle { self?: Cycle }
    const cyclic: Cycle = {};
    cyclic.self = cyclic;

    // Without the wrapper, JSON.stringify(cyclic) throws TypeError.
    // The wrapper must catch and return the sentinel — this is the
    // freeze-prevention guarantee that the DebugPill renders rely on.
    expect(safeStringify(cyclic)).toBe('[unserialisable]');
  });

  it('returns sentinel for BigInt values instead of throwing', () => {
    // BigInt has no default JSON representation; stringify throws TypeError.
    expect(safeStringify({ count: 10n })).toBe('[unserialisable]');
  });

  it('returns sentinel when toJSON throws', () => {
    const hostile = {
      toJSON() {
        throw new Error('boom');
      },
    };
    expect(safeStringify(hostile)).toBe('[unserialisable]');
  });

  it('does not return the sentinel for legitimate values that look weird', () => {
    // Empty objects and arrays serialise normally — they're not throws.
    expect(safeStringify({})).toBe('{}');
    expect(safeStringify([])).toBe('[]');
    // Empty strings serialise to a JSON string literal, not the empty sentinel.
    expect(safeStringify('')).toBe('""');
    // Zero, false serialise normally.
    expect(safeStringify(0)).toBe('0');
    expect(safeStringify(false)).toBe('false');
  });
});
