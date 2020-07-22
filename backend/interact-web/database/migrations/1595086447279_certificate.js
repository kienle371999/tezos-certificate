'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CertificateSchema extends Schema {
  up () {
    this.create('certificates', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.string('name').notNullable()
      table.string('identity').notNullable().unique()
      table.string('email').notNullable().unique()
      table.string('diploma_type').notNullable()
      table.string('credential_number').notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('certificates')
  }
}

module.exports = CertificateSchema
