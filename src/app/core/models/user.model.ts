export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'student';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  role: 'student';
}