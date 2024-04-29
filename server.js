const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowsMs:10*60*1000,
    max: 100
});
const hpp = require('hpp');
const cors = require('cors');


const app = express();


dotenv.config({path:'./config/config.env'});
connectDB();



const restaurants = require('./routes/restaurants');
const auth = require('./routes/auth');
const reservations = require('./routes/reservations');
const reviews = require('./routes/reviews');
const restaurantPromos = require('./routes/restaurantPromos');
const menus = require('./routes/menus');
const menureview = require('./routes/menureviews');


app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());

app.use('/api/v1/restaurants', restaurants);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservations',reservations);
app.use('/api/v1/reviews',reviews);
app.use('/api/v1/promotions', restaurantPromos);
app.use('api/v1/menus', menus);
app.use('api/v1/menureviews', menureview);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'on '+ process.env.HOST + ":"+ PORT));

const swaggerOptions= {
swaggerDefinition:{
    openapi: '3.0.0',
    info: {
        title:'Library API',
        version: '1.0.0',
        description: 'Car Booking API'
    },
    servers: [
        {
            url: process.env.HOST + ': ' + PORT + '/api/v1'
        }
    ]
}
}

process.on('unhandleRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);

    server.close(()=>process.exit(1));
});
