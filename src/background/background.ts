import { FurAffinityRequest } from './fur-affinity-request';
import { Parser } from './parsers';
import { Extension } from './extension';
import { StorageFields } from './interfaces/storage-fields.interface';
import { RecordCollection } from './interfaces/record-collection.interface';
import { emit } from 'process';
import { RecordPlural } from './enums/record-plural.enum';
import { MessageFormatter } from './message-formatter';

let timer = null;
let tab: chrome.tabs.Tab = null;
const INTERVAL = 60000 * 2; // TWO MINUTES

const data: StorageFields = {
  commentRecords: [],
  enableCommentNotifications: true,
  enableFavoriteNotifications: true,
  enableJournalNotifications: true,
  enableNoteNotifications: true,
  enableWatchNotifications: true,
  favoriteRecords: [],
  isLoggedIn: false,
  journalRecords: [],
  noteRecords: [],
  recordCounts: {
    comments: 0,
    favorites: 0,
    journals: 0,
    notes: 0,
    submissions: 0,
    watches: 0,
  },
  silentNotifications: false,
  watchRecords: [],
};

async function main() {
  // Update all settings that may have been affected by UI
  Object.assign(
    data,
    await Extension.getStorageValue(
      <Array<keyof StorageFields>>Object.keys(data)
    )
  );

  const page = await FurAffinityRequest.getMainPage();
  data.isLoggedIn = Parser.isLoggedIn(page);
  if (data.isLoggedIn) {
    const parser = new DOMParser();
    const mainDoc = parser.parseFromString(page, 'text/html');

    const noteDoc = parser.parseFromString(
      await FurAffinityRequest.getNotesPage(),
      'text/html'
    );

    const recordCounts = Parser.getRecordCounts(mainDoc);
    data.recordCounts = recordCounts;

    const pendingNotifications: RecordCollection = [];
    if (recordCounts.comments) {
      const records = Parser.getCommentRecords(mainDoc);
      if (data.enableCommentNotifications) {
        pendingNotifications.push(
          ...getUniqueRecords(data.commentRecords, records)
        );
      }
      data.commentRecords = records;
    }

    if (recordCounts.favorites) {
      const records = Parser.getFavoriteRecords(mainDoc);
      if (data.enableFavoriteNotifications) {
        pendingNotifications.push(
          ...getUniqueRecords(data.favoriteRecords, records)
        );
      }
      data.favoriteRecords = records;
    }

    if (recordCounts.journals) {
      const records = Parser.getJournalRecords(mainDoc);
      if (data.enableJournalNotifications) {
        pendingNotifications.push(
          ...getUniqueRecords(data.journalRecords, records)
        );
      }
      data.journalRecords = records;
    }

    if (recordCounts.notes) {
      const records = Parser.getNoteRecords(noteDoc);
      if (data.enableNoteNotifications) {
        pendingNotifications.push(
          ...getUniqueRecords(data.noteRecords, records)
        );
      }
      data.noteRecords = records;
    }

    if (recordCounts.submissions) {
      // Nothing to do since no alerts need to happen
    }

    if (recordCounts.watches) {
      const records = Parser.getWatchRecords(mainDoc);
      if (data.enableWatchNotifications) {
        pendingNotifications.push(
          ...getUniqueRecords(data.watchRecords, records)
        );
      }
      data.watchRecords = records;
    }

    emitNotifications(pendingNotifications);
  }

  await Extension.setStorageValues(data);
}

function getUniqueRecords(
  oldRecords: RecordCollection,
  newRecords: RecordCollection
): RecordCollection {
  const uniqueRecords: RecordCollection = [];
  newRecords.forEach((record) => {
    if (!oldRecords.find((r) => r.from === record.from && r.on === record.on)) {
      uniqueRecords.push(record);
    }
  });
  return uniqueRecords;
}

function emitNotifications(notifications: RecordCollection): void {
  const groups: Record<string, RecordCollection> = {};
  notifications.forEach((notification) => {
    if (!groups[notification.type]) {
      groups[notification.type] = [];
    }

    groups[notification.type].push(notification);
  });

  Object.entries(groups).forEach(([key, values]) => {
    const type = values.length > 1 ? 'list' : 'basic';
    if (type === 'list') {
      // Multi
      const title = `New ${key}${RecordPlural[key]}`;
      Extension.createNotification(values[0].bulkUrl, key, {
        title,
        message: `You have ${values.length} new ${key}${RecordPlural[key]}`,
      });
    } else {
      // Single
      const record = values[0];
      let message = '';
      if (MessageFormatter[record.type]) {
        message = MessageFormatter[record.type](record);
      } else {
        message = `You have received a new ${
          record.subtype || record.type
        } from ${record.from}`;

        if (record.on) {
          message += ` on ${record.on}`;
        }
      }

      Extension.createNotification(
        record.url || record.onUrl || record.fromUrl || record.bulkUrl,
        record.type,
        {
          title: `New ${record.subtype || record.type}`,
          message,
          silent: data.silentNotifications,
        }
      );
    }
  });
}

chrome.tabs.onRemoved.addListener((tabId: number) => {
  if (tab && tab.id === tabId) {
    tab = null;
  }
});

chrome.notifications.onButtonClicked.addListener(
  (notificationId: string, buttonIndex: number) => {
    const [id, type, url] = notificationId.split('::');
    if (tab) {
      chrome.tabs.update(tab.id, { url });
    } else {
      chrome.tabs.create({ url }, (newTab) => {
        tab = newTab;
      });
    }
  }
);

timer = setInterval(main, INTERVAL);
main();
