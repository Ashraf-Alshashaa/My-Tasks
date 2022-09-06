import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const dbName = "crud_mongodb";
const url = "mongodb://127.0.0.1:27017";
const mongoOption = { useNewUrlParser: true };

const state = {
  db: null,
};

const connect = (cb) => {
  if (state.db) {
    cb();
  } else {
    MongoClient.connect(url, mongoOption, (err, client) => {
      if (err) {
        cb(err);
      } else {
        state.db = client.db(dbName);
        cb();
      }
    });
  }
};

const getPrimaryKey = (_id) => {
  return ObjectId(_id);
};

const getDB = () => {
  return state.db;
};
const db = { connect, getDB, getPrimaryKey };
export default db;
