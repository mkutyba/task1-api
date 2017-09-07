import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {type: String, required: true},
  number: {type: String, required: true},
  logo: {type: String, required: true},
});

let Supplier: Model<mongoose.Document>;
try {
  Supplier = mongoose.model('Supplier');
} catch (error) {
  Supplier = mongoose.model('Supplier', supplierSchema);
}
export default Supplier;
