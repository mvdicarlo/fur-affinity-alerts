import { FurAffinityRecordFields } from './fur-affinity-record-fields';

export type FurAffinityRecordCounts = Record<
  keyof FurAffinityRecordFields,
  number
>;
