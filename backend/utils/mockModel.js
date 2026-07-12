const bcrypt = require('bcryptjs');

// Simple query matcher for in-memory records
const matchQuery = (item, query) => {
  if (!query || Object.keys(query).length === 0) return true;

  for (const key in query) {
    if (key === '$or') {
      const orConditions = query[key];
      const matchAny = orConditions.some((cond) => matchQuery(item, cond));
      if (!matchAny) return false;
      continue;
    }

    const queryVal = query[key];
    const itemVal = item[key];

    if (queryVal && typeof queryVal === 'object') {
      if (queryVal.$regex !== undefined) {
        const regex = new RegExp(queryVal.$regex, queryVal.$options || '');
        if (!regex.test(String(itemVal || ''))) return false;
      }
      else if (queryVal.$ne !== undefined) {
        if (itemVal === queryVal.$ne) return false;
      }
      else if (queryVal.$gt !== undefined) {
        const itemDate = itemVal instanceof Date ? itemVal : new Date(itemVal);
        const queryDate = queryVal.$gt instanceof Date ? queryVal.$gt : new Date(queryVal.$gt);
        if (itemDate <= queryDate) return false;
      }
    } else {
      if (String(itemVal) !== String(queryVal)) return false;
    }
  }
  return true;
};

// Chain helper for simulating populate, sort, skip, limit
class QueryChain {
  constructor(data, collectionName, isSingle = false) {
    this.data = data; // array for find, single object or null for findOne
    this.collectionName = collectionName;
    this.isSingle = isSingle;
  }

  populate(path) {
    if (this.isSingle) {
      if (!this.data) return this;
      const refId = this.data[path];
      if (!refId) return this;

      let refCollection = '';
      if (path === 'assignedDriver' || path === 'driver') refCollection = 'drivers';
      else if (path === 'assignedVehicle' || path === 'vehicle') refCollection = 'vehicles';
      else if (path === 'uploadedBy' || path === 'generatedBy' || path === 'recipient') refCollection = 'users';

      if (refCollection && global.memoryDB[refCollection]) {
        const refItem = global.memoryDB[refCollection].find((r) => String(r._id) === String(refId));
        this.data[path] = refItem ? { ...refItem } : refId;
      }
    } else {
      if (!Array.isArray(this.data)) return this;
      this.data = this.data.map((item) => {
        const cloned = { ...item };
        const refId = cloned[path];
        if (!refId) return cloned;

        let refCollection = '';
        if (path === 'assignedDriver' || path === 'driver') refCollection = 'drivers';
        else if (path === 'assignedVehicle' || path === 'vehicle') refCollection = 'vehicles';
        else if (path === 'uploadedBy' || path === 'generatedBy' || path === 'recipient') refCollection = 'users';

        if (refCollection && global.memoryDB[refCollection]) {
          const refItem = global.memoryDB[refCollection].find((r) => String(r._id) === String(refId));
          cloned[path] = refItem ? { ...refItem } : refId;
        }
        return cloned;
      });
    }
    return this;
  }

  select(fields) {
    // select dummy simulation, returns query object
    return this;
  }

  sort(sortObj) {
    if (this.isSingle || !Array.isArray(this.data)) return this;
    const key = Object.keys(sortObj)[0];
    const order = sortObj[key]; // 1 or -1
    this.data.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;
      if (valA < valB) return order === -1 ? 1 : -1;
      if (valA > valB) return order === -1 ? -1 : 1;
      return 0;
    });
    return this;
  }

  skip(n) {
    if (this.isSingle || !Array.isArray(this.data)) return this;
    this.data = this.data.slice(n);
    return this;
  }

  limit(n) {
    if (this.isSingle || !Array.isArray(this.data)) return this;
    this.data = this.data.slice(0, n);
    return this;
  }

  // Allow direct awaiting
  then(resolve, reject) {
    if (this.isSingle) {
      if (!this.data) return resolve(null);
      const record = enrichRecord(this.data, this.collectionName);
      resolve(record);
    } else {
      if (!Array.isArray(this.data)) return resolve([]);
      const enriched = this.data.map((item) => enrichRecord(item, this.collectionName));
      resolve(enriched);
    }
  }
}

// Add save() and matchPassword() helper methods onto in-memory records
const enrichRecord = (record, collectionName) => {
  if (!record) return record;

  const cloned = { ...record };

  // Define save method
  Object.defineProperty(cloned, 'save', {
    enumerable: false,
    value: async function () {
      const idx = global.memoryDB[collectionName].findIndex((r) => String(r._id) === String(this._id));
      if (idx !== -1) {
        // Encrypt password if updated/modified
        if (collectionName === 'users' && this.password && !this.password.startsWith('$2a$')) {
          const salt = bcrypt.genSaltSync(10);
          this.password = bcrypt.hashSync(this.password, salt);
        }
        global.memoryDB[collectionName][idx] = { ...this };
      }
      return this;
    },
  });

  // Define matchPassword method for user credentials
  if (collectionName === 'users') {
    Object.defineProperty(cloned, 'matchPassword', {
      enumerable: false,
      value: async function (enteredPassword) {
        let currentPassword = this.password;
        if (!currentPassword) {
          const original = global.memoryDB.users.find((u) => String(u._id) === String(this._id));
          currentPassword = original ? original.password : '';
        }
        return bcrypt.compareSync(enteredPassword, currentPassword);
      },
    });
  }

  return cloned;
};

class MockModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  get list() {
    return global.memoryDB[this.collectionName] || [];
  }

  set list(val) {
    global.memoryDB[this.collectionName] = val;
  }

  find(query = {}) {
    const matched = this.list.filter((item) => matchQuery(item, query));
    return new QueryChain(matched, this.collectionName, false);
  }

  findOne(query = {}) {
    const matched = this.list.find((item) => matchQuery(item, query));
    return new QueryChain(matched || null, this.collectionName, true);
  }

  findById(id) {
    const matched = this.list.find((item) => String(item._id) === String(id));
    return new QueryChain(matched || null, this.collectionName, true);
  }

  async create(body) {
    const record = {
      _id: 'mock_' + Math.random().toString(36).substr(2, 9),
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.collectionName === 'users' && record.password) {
      const salt = bcrypt.genSaltSync(10);
      record.password = bcrypt.hashSync(record.password, salt);
    }

    this.list = [...this.list, record];
    return enrichRecord(record, this.collectionName);
  }

  async findByIdAndUpdate(id, body, options = {}) {
    const idx = this.list.findIndex((item) => String(item._id) === String(id));
    if (idx === -1) return null;

    const updated = {
      ...this.list[idx],
      ...body,
      updatedAt: new Date(),
    };

    this.list[idx] = updated;
    return enrichRecord(updated, this.collectionName);
  }

  async findByIdAndDelete(id) {
    const record = this.list.find((item) => String(item._id) === String(id));
    if (!record) return null;

    this.list = this.list.filter((item) => String(item._id) !== String(id));
    return enrichRecord(record, this.collectionName);
  }

  async countDocuments(query = {}) {
    const matched = this.list.filter((item) => matchQuery(item, query));
    return matched.length;
  }

  async findOneAndDelete(query = {}) {
    const record = this.list.find((item) => matchQuery(item, query));
    if (!record) return null;

    this.list = this.list.filter((item) => String(item._id) !== String(record._id));
    return enrichRecord(record, this.collectionName);
  }

  async findOneAndUpdate(query = {}, body) {
    const idx = this.list.findIndex((item) => matchQuery(item, query));
    if (idx === -1) return null;

    const updated = {
      ...this.list[idx],
      ...body,
      updatedAt: new Date(),
    };

    this.list[idx] = updated;
    return enrichRecord(updated, this.collectionName);
  }
}

module.exports = MockModel;
