import { FurAffinityRecordCounts } from './fur-affinity-record-counts.interface';
import { RecordCollection } from './record-collection.interface';

export interface StorageFields {
  isLoggedIn: boolean;
  recordCounts: FurAffinityRecordCounts;
  watchRecords: RecordCollection;
  favoriteRecords: RecordCollection;
  commentRecords: RecordCollection;
  journalRecords: RecordCollection;
  noteRecords: RecordCollection;
  enableWatchNotifications: boolean;
  enableFavoriteNotifications: boolean;
  enableCommentNotifications: boolean;
  enableJournalNotifications: boolean;
  enableNoteNotifications: boolean;
  silentNotifications: boolean;
}
