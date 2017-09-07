import * as mongoose from 'mongoose';
import { Model, Schema } from 'mongoose';

const itemSchema = new mongoose.Schema({
  number: {type: String, required: true},
  stock: {type: Number, required: true},
  online: {type: Boolean, required: true},
  image: {type: String, required: true},
  description: {type: String, required: true},
  supplier_id: {type: Schema.Types.ObjectId, ref: 'Suppliers', required: true},
});

let Item: Model<mongoose.Document>;
try {
  Item = mongoose.model('Item');
} catch (error) {
  Item = mongoose.model('Item', itemSchema);
}
export default Item;
