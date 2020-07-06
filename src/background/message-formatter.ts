import { DataRecord } from './interfaces/record-collection.interface';

export const MessageFormatter: Record<string, (data: DataRecord) => string> = {
  journal(data: DataRecord) {
    return `${data.from} has posted a new journal ${data.on}`;
  },
  note(data: DataRecord) {
    return `You have received a new note from ${data.from} - "${data.on}"`;
  },
};
