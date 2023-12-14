import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const dbName = "crud_mongodb";
const url = process.env.MONGODB_URL;
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
