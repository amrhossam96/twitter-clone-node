const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const database = require("mongoose");
const app = require("../app");
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_URI = DATABASE_URL.replace("<password>", DATABASE_PASSWORD);
database
  .connect(DATABASE_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection to database is successful");
    app.listen(PORT, () => {
      console.log(`Server started running on PORT ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
