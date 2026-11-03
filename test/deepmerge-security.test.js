const merge = require('../vendor/deepmerge');

test('deepmerge drops nested __proto__ keys without changing ordinary values', () => {
  const input = JSON.parse(
    '{"session":{"__proto__":{"admin":true},"name":"reader"}}'
  );
  const result = merge({ session: null }, input);

  expect(Object.getPrototypeOf(result.session)).toBe(Object.prototype);
  expect(result.session.admin).toBeUndefined();
  expect(result.session).toEqual({ name: 'reader' });
});

test('deepmerge retains recursive object and array merging behavior', () => {
  const result = merge(
    { settings: { enabled: true }, values: [1] },
    { settings: { label: 'meter' }, values: [2] }
  );

  expect(result).toEqual({
    settings: { enabled: true, label: 'meter' },
    values: [1, 2],
  });
});
