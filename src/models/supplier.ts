import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';
import { SupplierAttributes, SupplierInstance } from './interfaces/supplier';

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<SupplierInstance, SupplierAttributes> {
  const Supplier = sequelize.define<SupplierInstance, SupplierAttributes>('Supplier', {
    name: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  }, {
    indexes: [],
    classMethods: {},
    timestamps: false
  });

  return Supplier;
}
