import { FurAffinityRecordCounts } from './fur-affinity-record-counts.interface';
import { RecordCollection } from './record-collection.interface';

export interface StorageFields {
  commentRecords: RecordCollection;
  enableCommentNotifications: boolean;
  enableFavoriteNotifications: boolean;
  enableJournalNotifications: boolean;
  enableNoteNotifications: boolean;
  enableWatchNotifications: boolean;
  favoriteRecords: RecordCollection;
  isLoggedIn: boolean;
  journalRecords: RecordCollection;
  noteRecords: RecordCollection;
  recordCounts: FurAffinityRecordCounts;
  silentNotifications: boolean;
  watchRecords: RecordCollection;
  route?: string;
  username?: string;
}
