import { models } from '../models';
import { default as app } from '../app';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as chaiShallowDeepEqual from 'chai-shallow-deep-equal';

chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);
const expect = chai.expect;
chai.should();

describe('Suppliers', () => {
  beforeEach((done) => {
    models.Supplier.destroy({truncate: true, cascade: true}).then(() => {
      done();
    });
  });

  describe('GET /suppliers', () => {
    it('responds with empty JSON array', () => {
      return chai.request(app)
        .get('/suppliers')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.have.length(0);
        });
    });

    it('responds with test entities', (done) => {
      models.Supplier.bulkCreate([
        {
          name: 'name-test',
          number: 'number-test',
          logo: 'logo-test',
        },
        {
          name: 'name-test1',
          number: 'number-test1',
          logo: 'logo-test1',
        }
      ]).then(() => {
        chai.request(app)
          .get('/suppliers')
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

  describe('POST /suppliers', () => {
    it('inserts test entity', (done) => {
      const expectedName = 'expected name';
      const expectedNumber = 'expected number';
      const expectedLogo = 'expected logo';

      chai.request(app)
        .post('/suppliers')
        .send({
          name: expectedName,
          number: expectedNumber,
          logo: expectedLogo,
        })
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('object');
          expect(res.body).to.shallowDeepEqual({
            message: 'Saved!',
            data: {
              name: expectedName,
              number: expectedNumber,
              logo: expectedLogo,
            }
          });

          models.Supplier.findAll().then(suppliers => {
            const supplier = suppliers[0];
            expect(supplier.get('name')).to.equal(expectedName);
            expect(supplier.get('number')).to.equal(expectedNumber);
            expect(supplier.get('logo')).to.equal(expectedLogo);
            done();
          }).catch(done);
        })
        .catch(done);
    });

    it('fails if no name specified', () => {
      return chai.request(app)
        .post('/suppliers')
        .send({
          'number': 'number1',
          'logo': 'logo1',
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });

    it('fails if no number specified', () => {
      return chai.request(app)
        .post('/suppliers')
        .send({
          'name': 'name1',
          'logo': 'logo1',
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });

    it('fails if no logo specified', () => {
      return chai.request(app)
        .post('/suppliers')
        .send({
          'name': 'name1',
          'number': 'number1',
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });
  });

  describe('GET /suppliers/:id', () => {
    it('responds with test entity', (done) => {
      const expectedId = 123;
      const expectedName = 'expected name';
      const expectedNumber = 'expected number';
      const expectedLogo = 'expected logo';

      models.Supplier.create({
        id: expectedId,
        name: expectedName,
        number: expectedNumber,
        logo: expectedLogo,
      }).then(() => {
        chai.request(app)
          .get('/suppliers/' + expectedId)
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.deep.include({
              name: expectedName,
              number: expectedNumber,
              logo: expectedLogo,
            });
            done();
          })
          .catch(done);
      }).catch(done);
    });

    it('fails if entity does not exist', () => {
      return chai.request(app)
        .get('/suppliers/1234')
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(404);
        });
    });
  });

  describe('PUT /suppliers/:id', () => {
    const expectedName = 'expected name';
    const expectedNumber = 'expected number';
    const expectedLogo = 'expected logo';

    it('modifies test entity', (done) => {
      const expectedId = 123;

      models.Supplier.create({
        id: expectedId,
        name: 'name-test',
        number: 'number-test',
        logo: 'logo-test',
      }).then(() => {
        chai.request(app)
          .put('/suppliers/' + expectedId)
          .send({
            name: expectedName,
            number: expectedNumber,
            logo: expectedLogo,
          })
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.deep.equal({message: 'Saved!'});

            models.Supplier.findById(expectedId).then(supplier => {
              expect(supplier.get('name')).to.equal(expectedName);
              expect(supplier.get('number')).to.equal(expectedNumber);
              expect(supplier.get('logo')).to.equal(expectedLogo);
              done();
            }).catch(done);
          })
          .catch(done);
      }).catch(done);
    });

    it('fails if entity does not exist', () => {
      return chai.request(app)
        .put('/suppliers/1234')
        .send({
          name: expectedName,
          number: expectedNumber,
          logo: expectedLogo,
        })
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(404);
        });
    });
  });

  describe('DELETE /suppliers/:id', () => {
    it('deletes test entity', (done) => {
      const idToDelete = 123;

      models.Supplier.create({
        id: idToDelete,
        name: 'name-test',
        number: 'number-test',
        logo: 'logo-test',
      }).then(() => {
        chai.request(app)
          .del('/suppliers/' + idToDelete)
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.deep.equal({message: 'Deleted!'});

            models.Supplier.findAll().then(suppliers => {
              expect(suppliers).to.have.length(0);
              done();
            }).catch(done);
          })
          .catch(done);
      }).catch(done);
    });

    it('fails if entity does not exist', () => {
      return chai.request(app)
        .del('/suppliers/1234')
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(404);
        });
    });
  });

  describe('GET /suppliers/:id/items', () => {
    const supplierId = 123;

    it('responds with empty JSON array', (done) => {
      models.Supplier.create({
        id: supplierId,
        name: 'name-test',
        number: 'number-test',
        logo: 'logo-test',
      }).then(() => {
        chai.request(app)
          .get(`/suppliers/${supplierId}/items`)
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.have.length(0);
            done();
          })
          .catch(done);
      }).catch(done);
    });

    it('responds with test entities', (done) => {
      models.Supplier.create({
        id: supplierId,
        name: 'name-test',
        number: 'number-test',
        logo: 'logo-test',
      }).then(() => {
        models.Item.bulkCreate([
          {
            number: 'number test',
            stock: 123,
            online: true,
            image: 'image test',
            description: 'description test',
            supplier_id: supplierId,
          },
          {
            number: 'number test 1',
            stock: 234,
            online: false,
            image: 'image test 1',
            description: 'description test 1',
            supplier_id: supplierId,
          }
        ]).then(() => {
          chai.request(app)
            .get(`/suppliers/${supplierId}/items`)
            .then(res => {
              expect(res.status).to.equal(200);
              expect(res).to.be.json;
              expect(res.body.data).to.be.an('array');
              expect(res.body.data).to.have.length(2);
              done();
            })
            .catch(done);
        }).catch(done);
      }).catch(done);
    });

    it('fails if entity does not exist', () => {
      return chai.request(app)
        .get('/suppliers/1234/items')
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(404);
        });
    });
  });
});
