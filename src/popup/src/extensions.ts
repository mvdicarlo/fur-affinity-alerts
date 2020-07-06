import { StorageFields } from '../../background/interfaces/storage-fields.interface';

export class Extensions {
  static getStorageValue(): Promise<Record<keyof StorageFields, any>> {
    return new Promise((resolve) => {
      chrome.storage.local.get((data: any) => resolve(data));
    });
  }

  static setStorageValues(toSet: Partial<StorageFields>): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(toSet, resolve);
    });
  }
}
