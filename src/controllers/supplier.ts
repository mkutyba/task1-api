import { Request, Response } from 'express';
import { models } from '../models';
import { SupplierInstance } from '../models/interfaces/supplier';
import { ItemInstance } from '../models/interfaces/item';

/**
 * GET /suppliers
 */
export let getSuppliers = (req: Request, res: Response) => {
  models.Supplier.findAll()
    .then((suppliers: SupplierInstance[]) => {
      res.status(200).json({data: suppliers});
    })
    .catch((error: Error) => {
      res.status(400).send(error);
    });
};

/**
 * POST /suppliers
 */
export let postSuppliers = (req: Request, res: Response) => {
  models.Supplier.create({
    name: req.body.name,
    number: req.body.number,
    logo: req.body.logo,
  })
    .then((supplier: SupplierInstance) => {
      res.status(201).json({
        message: 'Saved!',
        data: supplier,
      });
    })
    .catch((error: Error) => {
      res.status(400).send(error);
    });
};

/**
 * GET /suppliers/:id
 */
export let getSupplier = (req: Request, res: Response) => {
  models.Supplier.findById(req.params.id)
    .then((supplier: SupplierInstance) => {
      if (!supplier) {
        return res.status(404).send();
      }
      res.status(200).json({data: supplier});
    })
    .catch((error: Error) => {
      res.status(400).send(error);
    });
};

/**
 * PUT /suppliers/:id
 */
export let putSupplier = (req: Request, res: Response) => {
  models.Supplier.update({
      name: req.body.name,
      number: req.body.number,
      logo: req.body.logo,
    },
    {where: {id: req.params.id}})
    .then((result) => {
      const [updated] = result;
      if (!updated) {
        return res.status(404).send();
      }
      res.json({message: 'Saved!'});
    })
    .catch((error: Error) => {
      res.status(400).send(error);
    });
};

/**
 * DELETE /suppliers/:id
 */
export let deleteSupplier = (req: Request, res: Response) => {
  models.Supplier.destroy({where: {id: req.params.id}})
    .then((deleted) => {
      if (!deleted) {
        return res.status(404).send();
      }
      res.json({message: 'Deleted!'});
    })
    .catch((error: Error) => {
      res.status(400).send(error);
    });
};

/**
 * GET /suppliers/:id/items
 */
export let getSupplierItems = (req: Request, res: Response) => {

  models.Supplier.findById(req.params.id)
    .then((supplier: SupplierInstance) => {
      if (!supplier) {
        return res.status(404).send();
      }

      models.Item.findAll({where: {supplier_id: supplier.get('id')}})
        .then((items: ItemInstance[]) => {
          res.json({
            data: items
          });
        })
        .catch((error: Error) => {
          res.status(400).send(error);
        });
    })
    .catch((error: Error) => {
      res.status(400).send(error);
    });
};
