import { DataBaseConnection } from './DataBase/DbConnection.js'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import userRouter from './src/modules/user/user.routes.js'
import { AppError } from './src/utils/AppError.js'
import { GlobalErrorHandler } from './src/middleware/HandleError.js'
import { servedRouter } from './src/modules/served/served.routes.js'
import { contactRouter } from './src/modules/contact/contact.routes.js'
import  eventsRouter  from './src/modules/events/events.routes.js'
import memoryRouter from './src/modules/memory/memory.routes.js'
import bookingRouter from './src/modules/booking/booking.routes.js'

dotenv.config()
const app = express()
app.use(express.json())

app.use(cors({
  origin: ['http://localhost:3000', 'https://ugm-family.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/served", servedRouter)
app.use("/api/v1/contact", contactRouter)
app.use("/api/v1/event", eventsRouter)
app.use("/api/v1/memory", memoryRouter);
app.use("/api/v1/booking", bookingRouter);


app.get("/", (req, res) => {
  res.send("API is running successfully 🎉");
});

// Handle undefined routes
app.use((req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});
app.use(GlobalErrorHandler);

// ✅ Start the server after DB connection
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await DataBaseConnection(); // الاتصال بقاعدة البيانات أولًا
    app.listen(port, () => {
      console.log(`🚀 Server is running on ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start the server due to DB error:", err);
    process.exit(1); // خروج آمن لو فشل الاتصال
  }
};

startServer();
