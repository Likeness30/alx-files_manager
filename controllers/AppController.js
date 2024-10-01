/* eslint-disable import/no-named-as-default */
// eslint-disable-next-line import/no-unresolved, import/extensions
import dbClient from '../../utils/db';

describe('+ AppController', () => {
  // eslint-disable-next-line no-undef, func-names
  before(function (done) {
    this.timeout(10000);
    Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
      .then(([usersCollection, filesCollection]) => {
        Promise.all([usersCollection.deleteMany({}), filesCollection.deleteMany({})])
          .then(() => done())
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
  });

  describe('+ GET: /status', () => {
    it('+ Services are online', () => new Promise((done) => {
      // eslint-disable-next-line no-undef
      request.get('/status')
        .expect(200)
        // eslint-disable-next-line consistent-return
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          // eslint-disable-next-line jest/valid-expect
          expect(res.body).to.deep.eql({ redis: true, db: true });
          done();
        });
    }));
  });

  describe('+ GET: /stats', () => {
    it('+ Correct statistics about db collections', () => new Promise((done) => {
      // eslint-disable-next-line no-undef
      request.get('/stats')
        .expect(200)
        // eslint-disable-next-line consistent-return
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          // eslint-disable-next-line jest/valid-expect
          expect(res.body).to.deep.eql({ users: 0, files: 0 });
          done();
        });
    }));

    // eslint-disable-next-line jest/prefer-expect-assertions, func-names
    it('+ Correct statistics about db collections [alt]', function () {
      // eslint-disable-next-line jest/no-test-return-statement
      return new Promise((done) => {
        this.timeout(10000);
        Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
          .then(([usersCollection, filesCollection]) => {
            Promise.all([
              usersCollection.insertMany([{ email: 'john@mail.com' }]),
              filesCollection.insertMany([
                { name: 'foo.txt', type: 'file' },
                { name: 'pic.png', type: 'image' },
              ]),
            ])
              .then(() => {
                // eslint-disable-next-line no-undef
                request.get('/stats')
                  .expect(200)
                  // eslint-disable-next-line consistent-return
                  .end((err, res) => {
                    if (err) {
                      return done(err);
                    }
                    // eslint-disable-next-line jest/valid-expect
                    expect(res.body).to.deep.eql({ users: 1, files: 2 });
                    done();
                  });
              })
              .catch((deleteErr) => done(deleteErr));
          }).catch((connectErr) => done(connectErr));
      });
    });
  });
});
