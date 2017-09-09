import { default as Supplier } from '../models/Supplier';
import { Request, Response } from 'express';

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
    res.json({
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
  }, (err) => {
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
  Supplier.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.json({message: 'Deleted!'});
  });
};
