// lib/offlineDB.ts
class OfflineDB {
  private dbPromise: Promise<IDBDatabase>;
  private DB_NAME = "TaskManagerDB";
  private DB_VERSION = 2; // Incremented version number
  constructor() {
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        console.error("Database error:", error);
        reject(error);
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target as IDBRequest;
        const result = db.result;

        if (!result.objectStoreNames.contains("metadata")) {
          result.createObjectStore("metadata", { keyPath: "id" });
        }

        if (!result.objectStoreNames.contains("tasks")) {
          const store = result.createObjectStore("tasks", { keyPath: "id" });
          store.createIndex("listId", "listId", { unique: false });
        }

        if (!result.objectStoreNames.contains("operations")) {
          result.createObjectStore("operations", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };
    });
  }

  async updateTask(task: any) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["tasks"], "readwrite");
      const store = transaction.objectStore("tasks");
      const request = store.put(task);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async getAllTasks(): Promise<any[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["tasks"], "readonly");
      const store = transaction.objectStore("tasks");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async addPendingOperation(operation: any) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["operations"], "readwrite");
      const store = transaction.objectStore("operations");
      const request = store.add(operation);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async getPendingOperations(): Promise<any[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["operations"], "readonly");
      const store = transaction.objectStore("operations");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async clearOperation(id: number) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["operations"], "readwrite");
      const store = transaction.objectStore("operations");
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async saveColumnOrder(columnIds: number[]) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["metadata"], "readwrite");
      const store = transaction.objectStore("metadata");
      const request = store.put({ id: "columnOrder", value: columnIds });

      request.onsuccess = () => resolve(true);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async getColumnOrder(): Promise<number[] | null> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["metadata"], "readonly");
      const store = transaction.objectStore("metadata");
      const request = store.get("columnOrder");

      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }
}

export const offlineDB = new OfflineDB();
