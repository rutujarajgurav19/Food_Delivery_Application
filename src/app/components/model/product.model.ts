export interface Product {
    description: string;
    image: string;
    mrpPrice: number;
    productId: number;
    productname: string;
    quantity: number;
    category: number;  // Changed to number to match the integer category from backend
    measurment?: string;  // Optional if you decide to keep it
}
