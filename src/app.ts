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

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(process.env.MONGODB_TEST_URI, {useMongoClient: true});
} else {
  mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
}

mongoose.connection.on('error', () => {
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
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
