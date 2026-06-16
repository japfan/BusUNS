import {
  initialAnnouncements,
  initialOperationalStatus,
  initialSchedules,
  initialStops,
} from "@/data/dummyData";

const storageKey = "busuns-mock-supabase-data";
const sessionKey = "busuns-mock-supabase-session";
const authListeners = new Set();

function toDbStop(stop, index) {
  return {
    id: stop.id,
    name: stop.name,
    area: stop.area,
    location_description: stop.area,
    stop_order: stop.order,
    lat: stop.lat,
    lng: stop.lng,
    next_stop_id: initialStops[index + 1]?.id ?? initialStops[0]?.id ?? null,
    status: stop.status,
  };
}

function toDbSchedule(schedule) {
  return {
    id: schedule.id,
    stop_id: schedule.stopId,
    departure_time: `${schedule.time.replace(".", ":")}:00`,
    days: schedule.days,
    note: schedule.note,
    status: schedule.status,
  };
}

function defaultData() {
  return {
    stops: initialStops.map(toDbStop),
    schedules: initialSchedules.map(toDbSchedule),
    announcements: initialAnnouncements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      status: announcement.status,
      created_at: announcement.createdAt,
    })),
    operational_status: [
      {
        id: 1,
        is_operating: initialOperationalStatus.isOperating,
        message: initialOperationalStatus.message,
      },
    ],
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function readData() {
  if (!canUseStorage()) return defaultData();

  const stored = window.localStorage.getItem(storageKey);
  if (!stored) {
    const data = defaultData();
    window.localStorage.setItem(storageKey, JSON.stringify(data));
    return data;
  }

  try {
    return JSON.parse(stored);
  } catch {
    const data = defaultData();
    window.localStorage.setItem(storageKey, JSON.stringify(data));
    return data;
  }
}

function writeData(data) {
  if (canUseStorage()) {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }
}

function makeId(table) {
  return `${table}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function matches(row, filters) {
  return filters.every((filter) => row[filter.column] === filter.value);
}

class MockQuery {
  constructor(table, operations = []) {
    this.table = table;
    this.operations = operations;
  }

  select(...args) {
    return new MockQuery(this.table, [...this.operations, { type: "select", args }]);
  }

  insert(payload) {
    return new MockQuery(this.table, [...this.operations, { type: "insert", payload }]);
  }

  update(payload) {
    return new MockQuery(this.table, [...this.operations, { type: "update", payload }]);
  }

  upsert(payload) {
    return new MockQuery(this.table, [...this.operations, { type: "upsert", payload }]);
  }

  delete() {
    return new MockQuery(this.table, [...this.operations, { type: "delete" }]);
  }

  eq(column, value) {
    return new MockQuery(this.table, [...this.operations, { type: "eq", column, value }]);
  }

  limit(count) {
    return new MockQuery(this.table, [...this.operations, { type: "limit", count }]);
  }

  single() {
    return new MockQuery(this.table, [...this.operations, { type: "single" }]);
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  async execute() {
    const data = readData();
    const rows = data[this.table] ?? [];
    const filters = this.operations.filter((operation) => operation.type === "eq");
    const limit = this.operations.find((operation) => operation.type === "limit")?.count;
    const single = this.operations.some((operation) => operation.type === "single");
    const insert = this.operations.find((operation) => operation.type === "insert");
    const update = this.operations.find((operation) => operation.type === "update");
    const upsert = this.operations.find((operation) => operation.type === "upsert");
    const remove = this.operations.some((operation) => operation.type === "delete");

    if (insert) {
      const payloads = Array.isArray(insert.payload) ? insert.payload : [insert.payload];
      const created = payloads.map((payload) => ({
        id: payload.id ?? makeId(this.table),
        ...payload,
      }));
      data[this.table] = [...created, ...rows];
      writeData(data);
      return { data: single ? created[0] : created, error: null };
    }

    if (update) {
      data[this.table] = rows.map((row) =>
        matches(row, filters) ? { ...row, ...update.payload } : row,
      );
      writeData(data);
      return { data: null, error: null };
    }

    if (upsert) {
      const payloads = Array.isArray(upsert.payload) ? upsert.payload : [upsert.payload];
      const nextRows = rows.slice();
      payloads.forEach((payload) => {
        const id = payload.id ?? makeId(this.table);
        const index = nextRows.findIndex((row) => row.id === id);
        if (index >= 0) nextRows[index] = { ...nextRows[index], ...payload, id };
        else nextRows.unshift({ ...payload, id });
      });
      data[this.table] = nextRows;
      writeData(data);
      return { data: single ? nextRows[0] : nextRows, error: null };
    }

    if (remove) {
      data[this.table] = rows.filter((row) => !matches(row, filters));
      writeData(data);
      return { data: null, error: null };
    }

    let result = rows.filter((row) => matches(row, filters));
    if (typeof limit === "number") result = result.slice(0, limit);
    return { data: single ? result[0] ?? null : result, error: null };
  }
}

export const supabase = {
  auth: {
    async getSession() {
      const session = canUseStorage()
        ? JSON.parse(window.localStorage.getItem(sessionKey) || "null")
        : null;
      return { data: { session }, error: null };
    },
    onAuthStateChange(callback) {
      authListeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => authListeners.delete(callback),
          },
        },
      };
    },
    async signInWithPassword({ email }) {
      const session = {
        user: { email: email || "admin@busuns.local" },
        access_token: "mock-token",
      };
      if (canUseStorage()) {
        window.localStorage.setItem(sessionKey, JSON.stringify(session));
      }
      authListeners.forEach((listener) => listener("SIGNED_IN", session));
      return { data: { session }, error: null };
    },
    async signOut() {
      if (canUseStorage()) {
        window.localStorage.removeItem(sessionKey);
      }
      authListeners.forEach((listener) => listener("SIGNED_OUT", null));
      return { error: null };
    },
  },
  from(table) {
    return new MockQuery(table);
  },
};
