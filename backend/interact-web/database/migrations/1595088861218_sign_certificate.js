'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SignCertificateSchema extends Schema {
  up () {
    this.create('sign_certificates', (table) => {
      table.increments()
      table.string('credential_number').notNullable().unique()
      table.string('signature').notNullable().unique()
      table.string('is_signed').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('sign_certificates')
  }
}

module.exports = SignCertificateSchema
