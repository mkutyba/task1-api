import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';
import { ItemAttributes, ItemInstance } from './interfaces/item';

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<ItemInstance, ItemAttributes> {
  const Item = sequelize.define<ItemInstance, ItemAttributes>('Item', {
    number: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    online: {
      type: dataTypes.BOOLEAN,
      allowNull: false,
    },
    image: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  }, {
    indexes: [],
    classMethods: {},
    timestamps: false
  });

  const supplierModel = sequelize.import('supplier');
  Item.belongsTo(supplierModel, {foreignKey: 'supplier_id'});

  return Item;
}
