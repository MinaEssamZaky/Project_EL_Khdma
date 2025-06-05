import { DataBaseConnection}  from './DataBase/DbConnection.js'
import dotenv from 'dotenv'
import express  from 'express'
import userRouter from './src/modules/user/user.routes.js'
import { AppError } from './src/utils/AppError.js'
import { GlobalErrorHandler } from './src/middleware/HandleError.js';

dotenv.config()
const app = express()
app.use(express.json())

//userRouter
app.use("/api/v1/user",userRouter)


DataBaseConnection()

const port = process.env.PORT 
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// ------------------------------------------------------------------------------------------
// Handle undefined routes
app.use((req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    next(err);
});

app.use(GlobalErrorHandler);

