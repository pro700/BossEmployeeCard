export interface IProps {}

export interface IState {
  isLoading: boolean;
  title?: string;
  lists?: IList[];
  users?: IUser[];
}

export interface IList {
  id: string;
  title: string;
}

export interface IUser {
  email: string;
  title: string;
}
