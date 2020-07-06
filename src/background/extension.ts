import { StorageFields } from './interfaces/storage-fields.interface';

export namespace Extension {
  const idGenerator = id();

  export function getStorageValue(
    fields: keyof StorageFields | Array<keyof StorageFields>
  ): Promise<Record<keyof StorageFields, any>> {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        Array.isArray(fields) ? fields : [fields],
        resolve
      );
    });
  }

  export function setStorageValues(
    toSet: Partial<StorageFields>
  ): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(toSet, resolve);
    });
  }

  export function createNotification(
    url: string,
    type: string,
    options: chrome.notifications.NotificationOptions
  ) {
    return chrome.notifications.create(
      `${idGenerator.next().value}::${type}::${url}`,
      {
        type: 'basic',
        ...options,
        buttons: [
          {
            title: 'View',
          },
        ],
        iconUrl: './assets/icon.png',
      }
    );
  }

  function* id(): Generator<string, string, string> {
    let index = 0;
    while (true) {
      index++;
      yield index.toString();
    }
  }
}
