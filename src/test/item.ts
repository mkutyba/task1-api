import { models } from '../models';
import { default as app } from '../app';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as chaiShallowDeepEqual from 'chai-shallow-deep-equal';

chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);
const expect = chai.expect;
chai.should();

describe('Items', () => {
  beforeEach((done) => {
    models.Item.truncate().then(() => {
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
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.have.length(0);
        });
    });

    it('responds with test entities', (done) => {
      models.Item.bulkCreate([
        {
          number: 'number test',
          stock: 123,
          online: true,
          image: 'image test',
          description: 'description test',
        },
        {
          number: 'number test 1',
          stock: 234,
          online: false,
          image: 'image test 1',
          description: 'description test 1',
        }
      ]).then(() => {
        chai.request(app)
          .get('/items')
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.have.length(2);
            done();
          })
          .catch(done);
      }).catch(done);
    });
  });

  describe('POST /items', () => {
    it('inserts test entity', (done) => {
      const expectedNumber = 'expected number';
      const expectedStock = 1234;
      const expectedOnline = true;
      const expectedImage = 'expected image';
      const expectedDescription = 'expected description';

      chai.request(app)
        .post('/items')
        .send({
          number: expectedNumber,
          stock: expectedStock,
          online: expectedOnline,
          image: expectedImage,
          description: expectedDescription,
        })
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('object');
          expect(res.body).to.shallowDeepEqual({
            message: 'Saved!',
            data: {
              number: expectedNumber,
              stock: expectedStock,
              online: expectedOnline,
              image: expectedImage,
              description: expectedDescription,
            }
          });

          models.Item.findAll().then(items => {
            const item = items[0];
            expect(item.get('number')).to.equal(expectedNumber);
            expect(item.get('stock')).to.equal(expectedStock);
            expect(item.get('online')).to.equal(expectedOnline);
            expect(item.get('image')).to.equal(expectedImage);
            expect(item.get('description')).to.equal(expectedDescription);
            done();
          }).catch(done);
        }).catch(done);
    });

    it('fails if no number specified', () => {
      return chai.request(app)
        .post('/items')
        .send({
          stock: 123,
          online: true,
          image: 'image test',
          description: 'description test',
          supplier_id: 123,
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
          supplier_id: 123,
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
          supplier_id: 123,
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
          supplier_id: 123,
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
          supplier_id: 123,
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
    it('responds with test entity', (done) => {
      const expectedId = 123;
      const expectedNumber = 'expected number';
      const expectedStock = 1234;
      const expectedOnline = true;
      const expectedImage = 'expected image';
      const expectedDescription = 'expected description';

      models.Item.create({
        id: expectedId,
        number: expectedNumber,
        stock: expectedStock,
        online: expectedOnline,
        image: expectedImage,
        description: expectedDescription,
      }).then(() => {
        chai.request(app)
          .get('/items/' + expectedId)
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.deep.include({
              number: expectedNumber,
              stock: expectedStock,
              online: expectedOnline,
              image: expectedImage,
              description: expectedDescription,
            });
            done();
          })
          .catch(done);
      }).catch(done);
    });

    it('fails if entity does not exist', () => {
      return chai.request(app)
        .get('/items/1234')
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(404);
        });
    });
  });

  describe('PUT /items/:id', () => {
    const expectedNumber = 'expected number';
    const expectedStock = 1234;
    const expectedOnline = true;
    const expectedImage = 'expected image';
    const expectedDescription = 'expected description';

    it('modifies test entity', (done) => {
      const expectedId = 345;

      models.Item.create({
        id: expectedId,
        number: 'number test',
        stock: 1,
        online: true,
        image: 'image test',
        description: 'description test',
      }).then(() => {
        chai.request(app)
          .put('/items/' + expectedId)
          .send({
            number: expectedNumber,
            stock: expectedStock,
            online: expectedOnline,
            image: expectedImage,
            description: expectedDescription,
          })
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.deep.equal({message: 'Saved!'});

            models.Item.findById(expectedId).then(item => {
              expect(item.get('number')).to.equal(expectedNumber);
              expect(item.get('stock')).to.equal(expectedStock);
              expect(item.get('online')).to.equal(expectedOnline);
              expect(item.get('image')).to.equal(expectedImage);
              expect(item.get('description')).to.equal(expectedDescription);
              done();
            }).catch(done);
          })
          .catch(done);
      }).catch(done);
    });

    it('fails if entity does not exist', () => {
      return chai.request(app)
        .put('/items/1234')
        .send({
          number: expectedNumber,
          stock: expectedStock,
          online: expectedOnline,
          image: expectedImage,
          description: expectedDescription,
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(404);
        });
    });
  });

  describe('DELETE /items/:id', () => {
    it('deletes test entity', (done) => {
      const idToDelete = 123;

      models.Item.create({
        id: idToDelete,
        number: 'number test',
        stock: 1,
        online: true,
        image: 'image test',
        description: 'description test',
      }).then(() => {
        chai.request(app)
          .del('/items/' + idToDelete)
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.deep.equal({message: 'Deleted!'});

            models.Item.findAll().then(items => {
              expect(items).to.have.length(0);
              done();
            }).catch(done);
          })
          .catch(done);
      }).catch(done);
    });

    it('fails if entity does not exist', () => {
      return chai.request(app)
        .del('/items/1234')
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(404);
        });
    });
  });
});
