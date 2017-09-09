process.env.NODE_ENV = 'test';

import * as mongoose from 'mongoose';
import { default as Supplier } from '../models/Supplier';
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
    Supplier.remove({}, () => {
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
      Supplier.create([
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
      ], () => {
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
          expect(res.status).to.equal(200);
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

          Supplier.find((err, suppliers) => {
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
      const expectedId = mongoose.Types.ObjectId();
      const expectedName = 'expected name';
      const expectedNumber = 'expected number';
      const expectedLogo = 'expected logo';

      Supplier.create({
        _id: expectedId,
        name: expectedName,
        number: expectedNumber,
        logo: expectedLogo,
      }, () => {
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
          expect(res.status).to.equal(400);
        });
    });
  });

  describe('PUT /suppliers/:id', () => {
    it('modifies test entity', (done) => {
      const expectedId = mongoose.Types.ObjectId();
      const expectedName = 'expected name';
      const expectedNumber = 'expected number';
      const expectedLogo = 'expected logo';

      Supplier.create({
        _id: expectedId,
        name: 'name-test',
        number: 'number-test',
        logo: 'logo-test',
      }, () => {
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

            Supplier.findById(expectedId, (err, supplier) => {
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
        .then(res => {
          expect(res.status).to.not.equal(200);
        })
        .catch(res => {
          expect(res.status).to.equal(400);
        });
    });
  });

  describe('DELETE /suppliers/:id', () => {
    it('deletes test entity', (done) => {
      const idToDelete = mongoose.Types.ObjectId();

      Supplier.create({
        _id: idToDelete,
        name: 'name-test',
        number: 'number-test',
        logo: 'logo-test',
      }, () => {
        chai.request(app)
          .del('/suppliers/' + idToDelete)
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.deep.equal({message: 'Deleted!'});

            Supplier.find((err, suppliers) => {
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
          expect(res.status).to.equal(400);
        });
    });
  });
});
