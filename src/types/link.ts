export interface SharedLink {
  id: string;
  channel: string;
  secret: boolean;
  link: string;
  createdAt: Date;
}

export interface CreateLinkInput {
  channel: string;
  secret: boolean;
  link: string;
}
