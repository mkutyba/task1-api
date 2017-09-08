import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as mongoose from 'mongoose';

/**
 * Load environment variables from .env file.
 */
dotenv.config({path: '.env'});

/**
 * Controllers (route handlers).
 */
import * as supplierController from './controllers/supplier';
import * as itemController from './controllers/item';

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(process.env.MONGODB_TEST_URI);
} else {
  mongoose.connect(process.env.MONGODB_URI);
}

mongoose.connection.on('error', () => {
  console.error('MongoDB connection error. Please make sure MongoDB is running.');
  if (process.env.NODE_ENV === 'test') {
    console.error(process.env.MONGODB_TEST_URI);
  } else {
    console.error(process.env.MONGODB_URI);
  }
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(compression());
// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));

/**
 * API routes.
 */
app.get('/suppliers', supplierController.getSuppliers);
app.post('/suppliers', supplierController.postSuppliers);
app.get('/suppliers/:id', supplierController.getSupplier);
app.put('/suppliers/:id', supplierController.putSupplier);
app.delete('/suppliers/:id', supplierController.deleteSupplier);
app.get('/items', itemController.getItems);
app.post('/items', itemController.postItems);
app.get('/items/:id', itemController.getItem);
app.put('/items/:id', itemController.putItem);
app.delete('/items/:id', itemController.deleteItem);

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

export default app;
