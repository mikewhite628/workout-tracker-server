const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3001;
require("dotenv").config();
//load body-parser
const bodyParser = require("body-parser");
const cors = require("cors");
const date = require("date-and-time");

date.format(now, "ddd, MMM DD YYYY");
const now = new Date();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//connect to mongoose
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const workoutSchema = new mongoose.Schema({
  name: String,
  reps: Number,
  weight: Number,
  date: String,
  user: String,
});

const Workout = mongoose.model("Workout", workoutSchema);

//get all workouts from database and send to client log error
app.get("/api/workouts", (req, res) => {
  Workout.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

//verify token and get workouts from database and send to client in json
app.get("/api/workouts/:userId", (req, res) => {
  Workout.find({ user: req.params.userId })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

//create new workout
app.post("/api/add", (req, res) => {
  const workout = new Workout({
    name: req.body.name,
    reps: req.body.reps,
    weight: req.body.weight,
    date: now,
    user: req.body.user,
  });
  workout.save().then((result) => {
    res.send(result);
  });
});

//update workout
app.put("/api/update/:id", (req, res) => {
  Workout.updateOne(
    { _id: req.params.id },
    {
      name: req.body.name,
      reps: req.body.reps,
      weight: req.body.weight,
      date: req.body.date,
      user: req.body.user,
    }
  ).then((result) => {
    res.send(result);
  });
});

//delete workout
app.delete("/api/delete/:id", (req, res) => {
  Workout.deleteOne({ _id: req.params.id }).then((result) => {
    res.send(result);
  });
});

//user authentication
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  date: Date,
  token: String,
});

const User = mongoose.model("User", userSchema);

app.listen(3001, () => console.log(`Server is running on ${port}`));
