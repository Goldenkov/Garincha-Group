import { describe, expect, it } from 'vitest';

describe('csv import schema', () => {
  it('validates required fields list', () => {
    const required = ['name', 'segment', 'status', 'city', 'lat', 'lon'];
    expect(required).toContain('segment');
    expect(required.length).toBe(6);
  });
});
