import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import bodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler';
import authMiddleware from './middlewares/auth';
import asyncMiddleware from './middlewares/async';
import cors from 'cors';
import views from './views';
import path from 'path';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname + '/../public/views/'));
app.locals.baseUrl = `http://localhost:${PORT}`;

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* authenticated */
app.use(asyncMiddleware(authMiddleware));

/* views */
app.use('/', views);

/* routes */
routes(app).then(() => {
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`⚡️[]: Server is running at http://localhost:${PORT}`);
  });
});
