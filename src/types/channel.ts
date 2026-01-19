export type MediaTypeKind =
  | 'youtube'
  | 'spotify'
  | 'pdf'
  | 'image'
  | 'webm'
  | 'docs'
  | 'unknown';

export interface MediaType {
  type: MediaTypeKind;
  icon: string;
  useIframe: boolean;
}
