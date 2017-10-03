import { Instance } from 'sequelize';

export interface SupplierAttributes {
  id?: number;
  name: string;
  number: string;
  logo: string;
}

export interface SupplierInstance extends Instance<SupplierAttributes> {
  dataValues: SupplierAttributes;
}
