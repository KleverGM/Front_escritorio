export type AuthTokens = {
  access: string;
  refresh: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  tipo_usuario?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};
