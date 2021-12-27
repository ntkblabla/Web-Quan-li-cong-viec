export type Register = {
  email: string;
  name: string;
  password: string;
};

export type Login = {
  email: string;
  password: string;
};

export type User = {
  id?: number;
  email: string;
  name: string;
  password: string;
  avatar?: null | string;
};
