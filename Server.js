import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGODB_URI;

const app = express();
app.use(cors());
app.use(express.json());
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "quizDB1",  // ✅ set DB name here
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
}

connectDB();


/*mongoose.connect("mongodb://127.0.0.1:27017/quizDB1",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("DB connected")).catch((err)=>console.log(err));*/

const resultSchema = new mongoose.Schema({
    name: String,
    rollno:String,
    subject: String,
    answers:Array,
    score:Number
});
const Result= mongoose.model("Result",resultSchema);

app.post("/submit", async (req, res) => {
  try {
    const { name, rollno, subject, answers ,score } = req.body;
    console.log(req.body);
    if (!name || !rollno || !subject || !answers || score==null) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const newResult = new Result({ name, rollno, subject, answers,score});
    await newResult.save();
    res.json({ message: "Result submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/result", async (req, res) => {
  try {
    const results = await Result.find();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(process.env.PORT||5001,()=>console.log("server is running on port 5000"));


