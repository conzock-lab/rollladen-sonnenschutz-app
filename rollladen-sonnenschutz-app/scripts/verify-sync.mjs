import assert from "node:assert/strict";
import {
  enqueueSyncItem,
  getAutoSyncState,
  getQueueSummary,
  markQueueFailed,
  markQueueSyncing,
  markQueueSynced,
  queueLocalChange,
  restoreSyncQueue,
  retryFailedQueue,
  SYNC_STATUS,
} from "../src/lib/syncQueue.js";
import { saveCompanySnapshot } from "../src/services/supabaseSync.js";

function createSupabaseMock({ failTable = "" } = {}) {
  const calls = [];
  return {
    calls,
    auth: {
      getUser: async () => ({ data: { user: { id: "user-1" } }, error: null }),
    },
    from(table) {
      return {
        async upsert(data) {
          calls.push({ operation: "upsert", table, data });
          return { error: table === failTable ? new Error(`${table} nicht erreichbar`) : null };
        },
        delete() {
          return {
            eq() {
              return {
                async in(_column, ids) {
                  calls.push({ operation: "delete", table, ids });
                  return { error: table === failTable ? new Error(`${table} nicht erreichbar`) : null };
                },
              };
            },
          };
        },
      };
    },
  };
}

let queue = enqueueSyncItem([], "Auftrag angelegt", { orderId: "A-42" }, true);
const queueId = queue[0].id;
assert.equal(queue[0].type, "order");
assert.equal(queue[0].recordId, "A-42");
assert.equal(queue[0].status, SYNC_STATUS.PENDING);
assert.equal(queue[0].queuedOffline, true);
assert.ok(queue[0].createdAt);

queue = markQueueSyncing(queue, [queueId]);
assert.equal(queue[0].status, SYNC_STATUS.SYNCING);
assert.equal(getQueueSummary(queue).syncing, 1);

queue = markQueueFailed(queue, [queueId], "Netzwerkfehler", { now: 1000 });
assert.equal(queue[0].status, SYNC_STATUS.PENDING);
assert.equal(queue[0].retryCount, 1);
assert.ok(queue[0].nextRetryAt);

queue = markQueueFailed(queue, [queueId], "Netzwerkfehler", { now: 10000 });
queue = markQueueFailed(queue, [queueId], "Netzwerkfehler", { now: 20000 });
assert.equal(queue[0].status, SYNC_STATUS.FAILED);
assert.equal(queue[0].retryCount, 3);
assert.equal(getAutoSyncState(queue).hasPending, false);

queue = retryFailedQueue(queue);
assert.equal(queue[0].status, SYNC_STATUS.PENDING);
assert.equal(queue[0].retryCount, 0);
assert.equal(queue[0].nextRetryAt, null);

queue = markQueueSynced(queue, [queueId]);
assert.equal(queue[0].status, SYNC_STATUS.SYNCED);
assert.ok(queue[0].syncedAt);

let debouncedQueue = queueLocalChange([], false, { ownerId: "user-1" });
debouncedQueue = queueLocalChange(debouncedQueue, false, { changedAgain: true });
assert.equal(getQueueSummary(debouncedQueue).pending, 1);
assert.equal(debouncedQueue[0].data.changedAgain, true);

const restored = restoreSyncQueue([{ ...debouncedQueue[0], status: SYNC_STATUS.SYNCING }]);
assert.equal(restored[0].status, SYNC_STATUS.PENDING);

const okClient = createSupabaseMock();
await saveCompanySnapshot({
  client: okClient,
  companyRow: { id: "company-1", name: "Testbetrieb" },
  peopleRows: [{ id: "person-1", company_id: "company-1" }],
  orderRows: [{ id: "A-42", company_id: "company-1", data: {} }],
  deletedOrderIds: ["A-OLD"],
  snapshotRow: { company_id: "company-1", snapshot: {} },
  timeoutMs: 100,
});
assert.deepEqual(okClient.calls.map((call) => `${call.operation}:${call.table}`), [
  "upsert:companies",
  "upsert:company_people",
  "upsert:orders",
  "delete:orders",
  "upsert:app_snapshots",
]);

const localState = { orders: [{ id: "A-42", status: "offline geändert" }] };
const failingClient = createSupabaseMock({ failTable: "orders" });
let failingQueue = markQueueSyncing(enqueueSyncItem([], "Auftrag geändert", { orderId: "A-42" }, true), []);
const failingId = failingQueue[0].id;
failingQueue = markQueueSyncing(failingQueue, [failingId]);
await assert.rejects(() => saveCompanySnapshot({
  client: failingClient,
  companyRow: { id: "company-1", name: "Testbetrieb" },
  peopleRows: [],
  orderRows: [{ id: "A-42", company_id: "company-1", data: localState.orders[0] }],
  snapshotRow: { company_id: "company-1", snapshot: localState },
  timeoutMs: 100,
}), /orders nicht erreichbar/);
failingQueue = markQueueFailed(failingQueue, [failingId], "orders nicht erreichbar", { now: 1000 });
assert.equal(failingQueue[0].status, SYNC_STATUS.PENDING);
assert.equal(localState.orders[0].status, "offline geändert");

const slowClient = {
  auth: { getUser: () => new Promise(() => {}) },
  from: () => { throw new Error("Darf bei Timeout nicht erreicht werden"); },
};
await assert.rejects(() => saveCompanySnapshot({
  client: slowClient,
  companyRow: { id: "company-1" },
  peopleRows: [],
  orderRows: [],
  snapshotRow: { company_id: "company-1", snapshot: {} },
  timeoutMs: 25,
}), /zu lange gedauert/);

console.log("Sync-Prüfung erfolgreich: Queue, Retry, Offline-Erhalt, Fehler und Timeout.");
