import { default as Item } from '../models/Item';
import { Request, Response } from 'express';

/**
 * GET /items
 */
export let getItems = (req: Request, res: Response) => {
  Item.find((err, items) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.json({
      data: items
    });
  });
};

/**
 * POST /items
 */
export let postItems = (req: Request, res: Response) => {
  Item.create({
    number: req.body.number,
    stock: req.body.stock,
    online: req.body.online,
    image: req.body.image,
    description: req.body.description,
    supplier_id: req.body.supplier_id,
  }, (err: any, item: Document) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(201).json({
      message: 'Saved!',
      data: item,
    });
  });
};

/**
 * GET /items/:id
 */
export let getItem = (req: Request, res: Response) => {
  Item.findById(req.params.id, (err, item) => {
    if (!item) {
      return res.status(404).send();
    }
    if (err) {
      return res.status(400).send(err);
    }
    res.json({
      data: item
    });
  });
};


/**
 * PUT /items/:id
 */
export let putItem = (req: Request, res: Response) => {
  Item.findByIdAndUpdate(req.params.id, {
    $set: {
      number: req.body.number,
      stock: req.body.stock,
      online: req.body.online,
      image: req.body.image,
      description: req.body.description,
      supplier_id: req.body.supplier_id,
    }
  }, (err, item) => {
    if (!item) {
      return res.status(404).send();
    }
    if (err) {
      return res.status(400).send(err);
    }
    res.json({message: 'Saved!'});
  });
};

/**
 * DELETE /items/:id
 */
export let deleteItem = (req: Request, res: Response) => {
  Item.findByIdAndRemove(req.params.id, (err, item) => {
    if (!item) {
      return res.status(404).send();
    }
    if (err) {
      return res.status(400).send(err);
    }
    res.json({message: 'Deleted!'});
  });
};
