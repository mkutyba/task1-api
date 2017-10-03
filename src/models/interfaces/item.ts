import { Instance } from 'sequelize';

export interface ItemAttributes {
  id?: number;
  number: string;
  stock: number;
  online: boolean;
  image: string;
  description: string;
  supplier_id?: number;
}

export interface ItemInstance extends Instance<ItemAttributes> {
  dataValues: ItemAttributes;
}
