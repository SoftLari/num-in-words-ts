export type NumWordPair = [string, number];
export type NumWordList = NumWordPair | Array<NumWordPair | NumWordList>;

export interface CurrencyOptions {
  currency?: string;
  cents?: boolean;
  separator?: string;
  showZeroCents?: boolean;
}
