export const useAsyncAction = <Args extends any[], R>(
    actionFn: (...args: Args) => Promise<R>
  ) => {
    const isLoading = ref(false);
    const run = async (...args: Args): Promise<R | undefined> => {
      if (isLoading.value) return;
  
      isLoading.value = true;
      try {
        return await actionFn(...args);
      } catch (err) {
        throw err;
      } finally {
        isLoading.value = false;
      }
    };
  
    return { run, isLoading };
  };