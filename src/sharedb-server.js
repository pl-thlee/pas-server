const ShareDB = require('sharedb');

/** @see https://share.github.io/sharedb/types/#server */
ShareDB.types.register(require('rich-text').type);

/** @see https://share.github.io/sharedb/adapters/database#available-adapters */
module.exports = new ShareDB({
  db: require('sharedb-mongo')(
    process.env.MONGODB_URI || 'mongodb://localhost/quill-test'
  ),
});
