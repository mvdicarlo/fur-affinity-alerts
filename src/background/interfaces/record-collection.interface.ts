export type RecordCollection = DataRecord[];

export type DataRecordType =
  | 'watch'
  | 'comment'
  | 'favorite'
  | 'note'
  | 'journal';

export interface DataRecord {
  value: string;
  bulkUrl: string;
  url?: string;
  fromUrl?: string;
  from: string;
  on?: string;
  onUrl?: string;
  type: DataRecordType;
  subtype?: 'journal comment' | 'shout' | 'reply';
}
