// Dummy Counter API
export async function CounterAPI(num: number, isError: boolean = false) {
  console.log("API IS CALLED");

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
    }, 500);
  });
  return response;
}
