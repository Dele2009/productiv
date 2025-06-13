
export const catchAsync = <T>(
  fn: (req: Request) => Promise<T> | T
): ((req: Request) => Promise<T>) => {
  return async (req: Request): Promise<T> => {
    try {
      return await fn(req);
    } catch (error) {
      console.error("Async function error:", error);
      throw new Error("Internal server error");
    }
  };
}