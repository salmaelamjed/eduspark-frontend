export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at?:string;
  created_at: Date;
  updated_at: Date;
}
