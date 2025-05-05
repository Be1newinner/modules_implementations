// Dummy Counter API
export async function CounterAPI(num: number, isError: boolean = false) {
  const response = await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isError) {
        reject({
          message: "failed",
          data: null,
        });
      } else {
        resolve({
          message: "success",
          data: num + 1,
        });
      }
    }, 1000);
  });
  return response;
}
