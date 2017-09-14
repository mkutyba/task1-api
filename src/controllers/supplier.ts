import { default as Supplier } from '../models/Supplier';
import { Request, Response } from 'express';
import Item from '../models/Item';

/**
 * GET /suppliers
 */
export let getSuppliers = (req: Request, res: Response) => {
  Supplier.find((err, suppliers) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.json({
      data: suppliers
    });
  });
};

/**
 * POST /suppliers
 */
export let postSuppliers = (req: Request, res: Response) => {
  Supplier.create({
    name: req.body.name,
    number: req.body.number,
    logo: req.body.logo,
  }, (err: any, supplier: Document) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(201).json({
      message: 'Saved!',
      data: supplier,
    });
  });
};

/**
 * GET /suppliers/:id
 */
export let getSupplier = (req: Request, res: Response) => {
  Supplier.findById(req.params.id, (err, supplier) => {
    if (!supplier) {
      return res.status(404).send();
    }
    if (err) {
      return res.status(400).send(err);
    }
    res.json({
      data: supplier
    });
  });
};

/**
 * PUT /suppliers/:id
 */
export let putSupplier = (req: Request, res: Response) => {
  Supplier.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name,
      number: req.body.number,
      logo: req.body.logo,
    }
  }, (err, supplier) => {
    if (!supplier) {
      return res.status(404).send();
    }
    if (err) {
      return res.status(400).send(err);
    }
    res.json({message: 'Saved!'});
  });
};

/**
 * DELETE /suppliers/:id
 */
export let deleteSupplier = (req: Request, res: Response) => {
  Supplier.findByIdAndRemove(req.params.id, (err, supplier) => {
    if (!supplier) {
      return res.status(404).send();
    }
    if (err) {
      return res.status(400).send(err);
    }
    res.json({message: 'Deleted!'});
  });
};

/**
 * GET /suppliers/:id/items
 */
export let getSupplierItems = (req: Request, res: Response) => {
  Supplier.findById(req.params.id, (err, supplier) => {
    if (!supplier) {
      return res.status(404).send();
    }
    if (err) {
      return res.status(400).send(err);
    }

    Item.find({'supplier_id': supplier._id}, (err, items) => {
      if (err) {
        return res.status(400).send(err);
      }
      res.json({
        data: items
      });
    });
  });
};
