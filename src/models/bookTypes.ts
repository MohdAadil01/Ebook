import { User } from "./userTypes";

export interface Book {
  _id: string;
  titile: string;
  author: User;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
