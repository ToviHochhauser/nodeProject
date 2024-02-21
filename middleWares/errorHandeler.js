export const errorHandeler = (err,req,res,next)=>{
let stat = err.statusCode || 400;
let message = err.message || "there had been an error";
res.status(statusCode).send(message);
}