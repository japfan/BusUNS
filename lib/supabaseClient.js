import {
  initialAnnouncements,
  initialOperationalStatus,
  initialSchedules,
  initialStops,
} from "@/data/dummyData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const storageKey = "busuns-ui-mock-data";
const sessionKey = "busuns-ui-mock-session";
const authListeners = new Set();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function defaultMockData() {
  return {
    stops: initialStops.map((stop, index) => ({
      id: stop.id,
      name: stop.name,
      area: stop.area,
      location_description: stop.area,
      stop_order: stop.order,
      lat: stop.lat,
      lng: stop.lng,
      next_stop_id: initialStops[index + 1]?.id ?? initialStops[0]?.id ?? null,
      status: stop.status,
    })),
    schedules: initialSchedules.map((schedule) => ({
      id: schedule.id,
      stop_id: schedule.stopId,
      departure_time: `${schedule.time.replace(".", ":")}:00`,
      days: schedule.days,
      note: schedule.note,
      status: schedule.status,
    })),
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
  if (!canUseStorage()) return defaultMockData();
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) {
    const data = defaultMockData();
    window.localStorage.setItem(storageKey, JSON.stringify(data));
    return data;
  }

  try {
    return JSON.parse(stored);
  } catch {
    const data = defaultMockData();
    window.localStorage.setItem(storageKey, JSON.stringify(data));
    return data;
  }
}

function writeData(data) {
  if (canUseStorage()) {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }
}

function matches(row, filters) {
  return filters.every((filter) => row[filter.column] === filter.value);
}

function makeId(table) {
  return `${table}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

class MockQuery {
  constructor(table, operations = []) {
    this.table = table;
    this.operations = operations;
  }

  select(...args) {
    return new MockQuery(this.table, [...this.operations, { type: "select", args }]);
  }

  update(payload) {
    return new MockQuery(this.table, [...this.operations, { type: "update", payload }]);
  }

  insert(payload) {
    return new MockQuery(this.table, [...this.operations, { type: "insert", payload }]);
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
    const update = this.operations.find((operation) => operation.type === "update");
    const insert = this.operations.find((operation) => operation.type === "insert");
    const upsert = this.operations.find((operation) => operation.type === "upsert");
    const remove = this.operations.some((operation) => operation.type === "delete");

    if (update) {
      data[this.table] = rows.map((row) =>
        matches(row, filters) ? { ...row, ...update.payload } : row,
      );
      writeData(data);
      return { data: null, error: null };
    }

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

function createMockSupabase() {
  return {
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
            subscription: { unsubscribe: () => authListeners.delete(callback) },
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
        if (canUseStorage()) window.localStorage.removeItem(sessionKey);
        authListeners.forEach((listener) => listener("SIGNED_OUT", null));
        return { error: null };
      },
    },
    from(table) {
      return new MockQuery(table);
    },
  };
}

class RealQuery {
  constructor(clientPromise, table, operations = []) {
    this.clientPromise = clientPromise;
    this.table = table;
    this.operations = operations;
  }

  select(...args) {
    return new RealQuery(this.clientPromise, this.table, [...this.operations, { type: "select", args }]);
  }

  update(payload) {
    return new RealQuery(this.clientPromise, this.table, [...this.operations, { type: "update", args: [payload] }]);
  }

  insert(payload) {
    return new RealQuery(this.clientPromise, this.table, [...this.operations, { type: "insert", args: [payload] }]);
  }

  upsert(payload) {
    return new RealQuery(this.clientPromise, this.table, [...this.operations, { type: "upsert", args: [payload] }]);
  }

  delete(...args) {
    return new RealQuery(this.clientPromise, this.table, [...this.operations, { type: "delete", args }]);
  }

  eq(column, value) {
    return new RealQuery(this.clientPromise, this.table, [...this.operations, { type: "eq", args: [column, value] }]);
  }

  limit(count) {
    return new RealQuery(this.clientPromise, this.table, [...this.operations, { type: "limit", args: [count] }]);
  }

  single() {
    return new RealQuery(this.clientPromise, this.table, [...this.operations, { type: "single", args: [] }]);
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  async execute() {
    const client = await this.clientPromise;
    let query = client.from(this.table);
    this.operations.forEach((operation) => {
      query = query[operation.type](...operation.args);
    });
    return query;
  }
}

function createRealSupabase() {
  const clientPromise = Function("specifier", "return import(specifier)")("@supabase/supabase-js")
    .then(({ createClient }) => createClient(supabaseUrl, supabaseAnonKey))
    .catch(() => createMockSupabase());

  return {
    auth: {
      getSession: (...args) => clientPromise.then((client) => client.auth.getSession(...args)),
      onAuthStateChange: (...args) => {
        let unsubscribe = () => {};
        clientPromise.then((client) => {
          unsubscribe = client.auth.onAuthStateChange(...args).data.subscription.unsubscribe;
        });
        return { data: { subscription: { unsubscribe: () => unsubscribe() } } };
      },
      signInWithPassword: (...args) =>
        clientPromise.then((client) => client.auth.signInWithPassword(...args)),
      signOut: (...args) => clientPromise.then((client) => client.auth.signOut(...args)),
    },
    from(table) {
      return new RealQuery(clientPromise, table);
    },
  };
}

export const supabase = isSupabaseConfigured ? createRealSupabase() : createMockSupabase();
