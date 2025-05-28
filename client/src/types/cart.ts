export interface CartItem {
  _id?: string; // Optional for local items
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  addedAt?: Date;
}

export interface AddToCartPayload {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}
