const db = require('../lib/database')

function getQuery(query) {
    return new Promise((res, rej) => {
    db.query(query, (err, rows, fields) =>{
      if(!err)
      {
          res(rows);
      }
      else
      {
          console.log(err);
      }
  })
  })
  }

module.exports = {
	getQuery,
}
