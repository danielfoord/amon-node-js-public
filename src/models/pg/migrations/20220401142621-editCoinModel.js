'use strict';

module.exports = {
  async up(query, transaction) {
    const sql = ` 
    
    ALTER TABLE "Coin"
    ADD  COLUMN "price"  VARCHAR(255)
    `;

    await transaction.sequelize.query(sql, { raw: true, transaction });
  },

  down: async function (query, transaction) {
    const sql = 'DROP TABLE "Coin"';
    await transaction.sequelize.query(sql, { raw: true, transaction });
  },
};
