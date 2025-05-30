import { AppError } from "../utils/AppError.js"


export const validation = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate({...req.params,...req.body,...req.query}, { abortEarly: false })
        if (!error) {
            next()
        } else {
            let errMsg = []
            error.details.forEach((val)=>{
                errMsg.push(val.message)
            })
            next(new AppError(errMsg,401))
            // res.json(errMsg)
        }
    }
}
