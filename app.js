//IMPORT PACKAGE
const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/authRouter')
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController')
const userRoute = require('./Routes/userRoutes')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')

let app = express();

app.use(helmet())

let limiter = rateLimit({
    max: 1000,
    windowsMs: 60 * 60 * 1000,
    message: 'We have recived many requests from this IP, Please try after one hour'
});
app.use('/api'. limiter)

app.use(express.json({limit: '10kb'}));

app.use(sanitize());
app.use(xss());
app.use(hpp({whitelist: ['duration', 
    'ratings', 
    'releaseDate', 
    'genres',
    'actors',
    'price'
]}))

app.use(express.static('./public'))

//USING ROUTES


app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/users', authRouter);
app.use('/api/v1/user', userRoute);
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server!`
    // });
    // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;
