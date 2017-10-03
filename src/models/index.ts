import * as fs from 'fs';
import * as path from 'path';
import * as SequelizeStatic from 'sequelize';
import { ItemAttributes, ItemInstance } from './interfaces/item';
import { SupplierAttributes, SupplierInstance } from './interfaces/supplier';
import { Sequelize } from 'sequelize';
import * as configJson from '../config/config.json';

export interface SequelizeModels {
  Supplier: SequelizeStatic.Model<SupplierInstance, SupplierAttributes>;
  Item: SequelizeStatic.Model<ItemInstance, ItemAttributes>;
}

class Database {
  private _basename: string;
  private _models: SequelizeModels;
  private _sequelize: Sequelize;

  constructor() {
    this._basename = path.basename(module.filename);
    const env = process.env.NODE_ENV || 'development';
    const config = (<any>configJson)[env];
    this._sequelize = new SequelizeStatic(config.database, config.username, config.password, config);
    this._models = ({} as any);

    fs.readdirSync(__dirname).filter((file: string) => {
      return (file !== this._basename) && (file !== 'interfaces') && (file.slice(-3) === '.js');
    }).forEach((file: string) => {
      const model = this._sequelize.import(path.join(__dirname, file));
      (this._models as any)[(model as any).name] = model;
    });

    Object.keys(this._models).forEach((modelName: string) => {
      if (typeof (this._models as any)[modelName].associate === 'function') {
        (this._models as any)[modelName].associate(this._models);
      }
    });
  }

  getModels() {
    return this._models;
  }

  getSequelize() {
    return this._sequelize;
  }
}

const database = new Database();
export const models = database.getModels();
export const sequelize = database.getSequelize();
