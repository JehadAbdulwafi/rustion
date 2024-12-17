declare module 'react-native-mmkv' {
  export class MMKV {
    constructor(config?: { id?: string; path?: string; encryptionKey?: string });
    
    // Storage methods
    set(key: string, value: string | number | boolean): void;
    getString(key: string): string | undefined;
    getNumber(key: string): number | undefined;
    getBoolean(key: string): boolean | undefined;
    contains(key: string): boolean;
    delete(key: string): void;
    clearAll(): void;
    getAllKeys(): string[];
  }

  export default MMKV;
}
