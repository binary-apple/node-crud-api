export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserData = Omit<User, 'id'>;

export const validateUserData: (data: unknown) => boolean = (data) => {
  return (
    !!data &&
    typeof data === 'object' &&
    'username' in data &&
    'age' in data &&
    'hobbies' in data
  );
};
