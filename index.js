import express from "express";
import mongoose from "mongoose";
import  cors from 'cors';
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";


dotenv.config();

const connectDB = async () => {
  try {
      await mongoose.connect('mongodb+srv://vinoth19rfc:Linux-199219@cluster0.frymi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
      console.log('MongoDB connected');
  } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
  }
};

connectDB();


const app = express();

const allowedOrigins = [
  'https://stunning-eclair-e2ddce.netlify.app',
  'http://localhost:3000', // For local development
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log('CORS Request from origin:', origin); // Log CORS requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());
//allow JSON data

app.use(cookieParser());
let PORT='3000';
app.listen( PORT, () => {
  console.log(`localhost ${PORT}!`);
});

app.use("/api/user", userRouter); //api/user
app.use("/api/auth", authRouter); //api/auth
app.use("/api/listing", listingRouter); //api/listing

userRouter.get('/', (req, res) => {
  console.log('User route hit');
  res.json({ message: 'User data' });
});

//Errors Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
