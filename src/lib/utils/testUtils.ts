export const expectThrownErrors = (func: () => any, expectedErrors: string[] | string[][]) => {
  try {
    func();
    const shouldNotHitThis = 'expected error not thrown';
    (shouldNotHitThis.length as any).should.equal(0, 'Expected error not thrown');
  } catch (e) {
    for (let i = 0; i < expectedErrors.length; i += 1) {
      expect(e.errors).toContain(expectedErrors[i]);
    }
    expect(e.errors).toHaveLength(expectedErrors.length);
  }
};

export const expectErrors = (errors: string[] | undefined, expectedErrors: string[]) => {
  if (!errors) {
    throw new Error('Actual error list is empty');
  }

  for (let i = 0; i < expectedErrors.length; i += 1) {
    expect(errors).toContain(expectedErrors[i]);
  }
  expect(errors).toHaveLength(expectedErrors.length);
};
