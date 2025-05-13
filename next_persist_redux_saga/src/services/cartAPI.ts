const BACKEND = "http://localhost:5000";

interface cart {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export type getAllCartAPIResponse = cart[];

export async function getAllCartAPI(): Promise<getAllCartAPIResponse> {
  const data = await fetch(`${BACKEND}/cart`, {
    method: "POST",
  });
  const response = await data.json();
  console.log("response", response);
  return response?.cart || [];
}

export async function increaseCartAPI(id: string) {
  const data = await fetch(`${BACKEND}/cart/increase/${id}`, {
    method: "POST",
  });
  const response = await data.json();
  return response;
}

export async function decreaseCartAPI(id: string) {
  const data = await fetch(`${BACKEND}/cart/decrease/${id}`, {
    method: "POST",
  });
  const response = await data.json();
  return response;
}
