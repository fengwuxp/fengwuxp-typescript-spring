
export enum Sex {

  MAN,
  WOMAN
}

export interface DemoItem {

  id: number;

  name: string;

  age: number;

  birthday: Date | number;

  avatar: string;

  sex: Sex;
}
