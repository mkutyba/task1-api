import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as path from 'path';
import * as cors from 'cors';

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
app.use(cors());

/**
 * API routes.
 */
app.get('/suppliers', supplierController.getSuppliers);
app.post('/suppliers', supplierController.postSuppliers);
app.get('/suppliers/:id', supplierController.getSupplier);
app.put('/suppliers/:id', supplierController.putSupplier);
app.delete('/suppliers/:id', supplierController.deleteSupplier);
app.get('/suppliers/:id/items', supplierController.getSupplierItems);
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
