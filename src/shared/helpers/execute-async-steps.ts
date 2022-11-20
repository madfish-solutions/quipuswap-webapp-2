export const executeAsyncSteps = async (steps: Array<() => Promise<void>>, condition: { value: boolean }) => {
  for (const step of steps) {
    if (!condition.value) {
      break;
    }

    await step();
  }
};
