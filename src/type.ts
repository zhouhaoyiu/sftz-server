export type resultType<T = unknown> = {
  success?: boolean;
  message: string;
  data?: T;
  code?: number;
};
