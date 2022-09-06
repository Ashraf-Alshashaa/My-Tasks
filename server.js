import app from "./app.js";
import db from "./db.js";

const port = 3000;

db.connect((err) => {
  if (err) {
    console.log("unable to connect to database");
    process.exit(1);
  } else {
    app.listen(port, () =>
      console.log(`connected to database, app listen on port: ${port}`)
    );
  }
});
