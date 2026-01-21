export interface ServerToClientEvents {
  linkshared: (
    channel: string,
    secret: boolean,
    link: string,
    date: Date,
  ) => void;
  linkchanged: (channel: string, secret: boolean, link: string) => void;
  playvideo: (channel: string, time: number) => void;
  pausevideo: (channel: string, time: number) => void;
}

export interface ClientToServerEvents {
  linkshared: (channel: string, secret: boolean, link: string) => void;
  linkchanged: (channel: string, secret: boolean, link: string) => void;
  playvideo: (channel: string, time: number) => void;
  pausevideo: (channel: string, time: number) => void;
}
