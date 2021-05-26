const awaitCallback = {
  forEach: async <T>(array: T[], callback: (i: T, index: number, arr: T[]) => any) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  },
};

export default awaitCallback;
