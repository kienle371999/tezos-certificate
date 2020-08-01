'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterCertificateSchema extends Schema {
  up () {
    this.alter('certificates', (table) => {
      table.dropColumn('is_signed')
      table.string('blockchain_hash').after('signature').unique()
      table.boolean('is_broadcasted').after('blockchain_hash').defaultTo(false)      
    })
  }

  down () {
    this.drop('alter_certificates')
  }
}

module.exports = AlterCertificateSchema
