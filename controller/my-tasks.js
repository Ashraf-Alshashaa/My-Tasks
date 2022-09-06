import db from "../db.js";
import path from "path";

const collection = "tasks";
const __dirname = path.resolve();

const get = (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
};

const editOneTask = (req, res) => {
  const taskID = req.params.id;
  const userInput = req.body;

  if (userInput.task.trim() !== "") {
    db.getDB()
      .collection(collection)
      .findOneAndUpdate(
        { _id: db.getPrimaryKey(taskID) },
        { $set: { task: userInput.task } },
        { returnOriginal: false },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ result: result, userInput: userInput });
          }
        }
      );
  }
};

const gitTasks = (req, res) => {
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, documents) => {
      if (err) {
        console.log(err);
      } else {
        res.json(documents);
      }
    });
};

const addTask = (req, res) => {
  const userInput = req.body;

  if (userInput.task.trim() !== "") {
    db.getDB()
      .collection(collection)
      .insertOne(userInput, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json({ result: result, document: userInput });
        }
      });
  }
};

const deleteTask = (req, res) => {
  const taskID = req.params.id;
  db.getDB()
    .collection(collection)
    .findOneAndDelete({ _id: db.getPrimaryKey(taskID) }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
};

const controller = { get, editOneTask, gitTasks, addTask, deleteTask };

export default controller;
