process.env.NODE_ENV = 'test';

import * as mongoose from 'mongoose';
import { default as Item } from '../models/Item';
import { default as app } from '../app';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;
chai.should();

describe('Items', () => {
  beforeEach((done) => {
    Item.remove({}, () => {
      done();
    });
  });

  describe('GET /items', () => {
    it('responds with empty JSON array', () => {
      return chai.request(app)
        .get('/items')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        });
    });

    it('responds with test entities', () => {
      Item.create({
        number: 'number test',
        stock: 123,
        online: true,
        image: 'image test',
        description: 'description test',
        supplier_id: mongoose.Types.ObjectId(),
      }, () => {});
      Item.create({
        number: 'number test 1',
        stock: 234,
        online: false,
        image: 'image test 1',
        description: 'description test 1',
        supplier_id: mongoose.Types.ObjectId(),
      }, () => {});

      return chai.request(app)
        .get('/items')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
        });
    });
  });

  describe('POST /items', () => {
    it('inserts test entity', () => {
      const expectedNumber = 'expected number';
      const expectedStock = 1234;
      const expectedOnline = true;
      const expectedImage = 'expected image';
      const expectedDescription = 'expected description';
      const expectedSupplierId = mongoose.Types.ObjectId();

      return chai.request(app)
        .post('/items')
        .send({
          number: expectedNumber,
          stock: expectedStock,
          online: expectedOnline,
          image: expectedImage,
          description: expectedDescription,
          supplier_id: expectedSupplierId,
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.deep.equal({message: 'Saved!'});

          Item.find((err, items) => {
            const item = items[0];
            expect(item.get('number')).to.equal(expectedNumber);
            expect(item.get('stock')).to.equal(expectedStock);
            expect(item.get('online')).to.equal(expectedOnline);
            expect(item.get('image')).to.equal(expectedImage);
            expect(item.get('description')).to.equal(expectedDescription);
            expect(item.get('supplier_id')).to.deep.equal(expectedSupplierId);
          });
        });
    });

    it('fails if no number specified', () => {
      return chai.request(app)
        .post('/items')
        .send({
          stock: 123,
          online: true,
          image: 'image test',
          description: 'description test',
          supplier_id: mongoose.Types.ObjectId(),
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });

    it('fails if no stock specified', () => {
      return chai.request(app)
        .post('/items')
        .send({
          number: 'number test',
          online: true,
          image: 'image test',
          description: 'description test',
          supplier_id: mongoose.Types.ObjectId(),
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });

    it('fails if no online specified', () => {
      return chai.request(app)
        .post('/items')
        .send({
          number: 'number test',
          stock: 123,
          image: 'image test',
          description: 'description test',
          supplier_id: mongoose.Types.ObjectId(),
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });

    it('fails if no image specified', () => {
      return chai.request(app)
        .post('/items')
        .send({
          number: 'number test',
          stock: 123,
          online: true,
          description: 'description test',
          supplier_id: mongoose.Types.ObjectId(),
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });

    it('fails if no description specified', () => {
      return chai.request(app)
        .post('/items')
        .send({
          number: 'number test',
          stock: 123,
          online: true,
          image: 'image test',
          supplier_id: mongoose.Types.ObjectId(),
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });

    it('fails if no supplier_id specified', () => {
      return chai.request(app)
        .post('/items')
        .send({
          number: 'number test',
          stock: 123,
          online: true,
          image: 'image test',
          description: 'description test',
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });
  });

  describe('GET /items/:id', () => {
    it('responds with test entity', () => {
      const expectedId = mongoose.Types.ObjectId();
      const expectedNumber = 'expected number';
      const expectedStock = 1234;
      const expectedOnline = true;
      const expectedImage = 'expected image';
      const expectedDescription = 'expected description';
      const expectedSupplierId = mongoose.Types.ObjectId();

      Item.create({
        _id: expectedId,
        number: expectedNumber,
        stock: expectedStock,
        online: expectedOnline,
        image: expectedImage,
        description: expectedDescription,
        supplier_id: expectedSupplierId,
      }, () => {});

      return chai.request(app)
        .get('/items/' + expectedId)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.deep.include({
            number: expectedNumber,
            stock: expectedStock,
            online: expectedOnline,
            image: expectedImage,
            description: expectedDescription,
            supplier_id: expectedSupplierId.toHexString(),
          });
        });
    });

    it('fails if entity does not exist', () => {
      return chai.request(app)
        .get('/items/1234')
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });
  });

  describe('PUT /items/:id', () => {
    it('modifies test entity', () => {
      const expectedId = mongoose.Types.ObjectId();
      const expectedNumber = 'expected number';
      const expectedStock = 1234;
      const expectedOnline = true;
      const expectedImage = 'expected image';
      const expectedDescription = 'expected description';
      const expectedSupplierId = mongoose.Types.ObjectId();

      Item.create({
        _id: expectedId,
        number: 'number test',
        stock: 1,
        online: true,
        image: 'image test',
        description: 'description test',
        supplier_id: mongoose.Types.ObjectId(),
      }, () => {});

      return chai.request(app)
        .put('/items/' + expectedId)
        .send({
          number: expectedNumber,
          stock: expectedStock,
          online: expectedOnline,
          image: expectedImage,
          description: expectedDescription,
          supplier_id: expectedSupplierId,
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.deep.equal({message: 'Saved!'});

          Item.findById(expectedId, (err, item) => {
            expect(item.get('number')).to.equal(expectedNumber);
            expect(item.get('stock')).to.equal(expectedStock);
            expect(item.get('online')).to.equal(expectedOnline);
            expect(item.get('image')).to.equal(expectedImage);
            expect(item.get('description')).to.equal(expectedDescription);
            expect(item.get('supplier_id')).to.deep.equal(expectedSupplierId);
          });
        });
    });

    it('fails if entity does not exist', () => {
      return chai.request(app)
        .put('/items/1234')
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });
  });

  describe('DELETE /items/:id', () => {
    it('deletes test entity', () => {
      const idToDelete = mongoose.Types.ObjectId();

      Item.create({
        _id: idToDelete,
        number: 'number test',
        stock: 1,
        online: true,
        image: 'image test',
        description: 'description test',
        supplier_id: mongoose.Types.ObjectId(),
      }, () => {});

      return chai.request(app)
        .del('/items/' + idToDelete)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.deep.equal({message: 'Deleted!'});

          Item.find((err, items) => {
            expect(items).to.have.length(0);
          });
        });
    });

    it('fails if entity does not exist', () => {
      return chai.request(app)
        .del('/items/1234')
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });
  });
});
