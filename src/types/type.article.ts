export type ArticleType = {
  id: number;
  title: string;
  description: string;
  avatar: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  userId: number;
};

export type ArticleCreateParamsType = {
  title: string;
  description?: string;
  avatar?: string;
  content: string;
  userId: number;
};

export type ArticleUpdateParamsType = {
  title?: string;
  description?: string;
  avatar?: string;
  content?: string;
  isDeleted?: boolean;
};
