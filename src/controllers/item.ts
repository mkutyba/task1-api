import { Request, Response } from 'express';
import { models } from '../models';
import { ItemInstance } from '../models/interfaces/item';

/**
 * GET /items
 */
export let getItems = (req: Request, res: Response) => {
  models.Item.findAll()
    .then((items: ItemInstance[]) => {
      res.status(200).json({data: items});
    })
    .catch((error: Error) => {
      res.status(400).send(error);
    });
};

/**
 * POST /items
 */
export let postItems = (req: Request, res: Response) => {
  models.Item.create({
    number: req.body.number,
    stock: req.body.stock,
    online: req.body.online,
    image: req.body.image,
    description: req.body.description,
    supplier_id: req.body.supplier_id,
  })
    .then((item: ItemInstance) => {
      res.status(201).json({
        message: 'Saved!',
        data: item,
      });
    })
    .catch((error: Error) => {
      res.status(400).send(error);
    });
};

/**
 * GET /items/:id
 */
export let getItem = (req: Request, res: Response) => {
  models.Item.findById(req.params.id)
    .then((item: ItemInstance) => {
      if (!item) {
        return res.status(404).send();
      }
      res.status(200).json({data: item});
    })
    .catch((error: Error) => {
      res.status(400).send(error);
    });
};


/**
 * PUT /items/:id
 */
export let putItem = (req: Request, res: Response) => {
  models.Item.update({
      number: req.body.number,
      stock: req.body.stock,
      online: req.body.online,
      image: req.body.image,
      description: req.body.description,
      supplier_id: req.body.supplier_id,
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
 * DELETE /items/:id
 */
export let deleteItem = (req: Request, res: Response) => {
  models.Item.destroy({where: {id: req.params.id}})
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
