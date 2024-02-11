export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserData = Omit<User, 'id'>;

export function validateUserData(data: unknown): data is UserData {
  return (
    !!data &&
    typeof data === 'object' &&
    'username' in data &&
    typeof data.username === 'string' &&
    'age' in data &&
    typeof data.age === 'number' &&
    'hobbies' in data &&
    Array.isArray(data.hobbies) &&
    data.hobbies.every((el) => typeof el === 'string')
  );
}
