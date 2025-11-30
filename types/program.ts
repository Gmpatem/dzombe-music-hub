export interface Program {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  category: string;
  level: string;
  isActive: boolean;
  createdAt: Date;
}