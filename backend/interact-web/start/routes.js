'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//POST
Route.group(() => {
  Route.post('user/login', 'UserController.logIn')
  Route.post('user/register-user', 'UserController.registerUser')
  Route.post('user/logout', 'UserController.logOut').middleware(['auth'])
  Route.post('user/generate-information', 'CertificateController.generate').middleware(['auth'])
  Route.post('user/create-signature', 'CertificateController.createSignature').middleware(['auth'])
  Route.post('user/store-hash', 'CertificateController.storeBlockchainHash').middleware(['auth'])
  Route.post('init-certificate-data', 'PDFController.initCertificate').middleware(['auth'])
  Route.post('send-mail-certificate', 'PDFController.sendMailToRecipient').middleware(['auth'])
  Route.post('create-certificate-pdf', 'PDFController.createPDF').middleware(['auth'])
}).prefix('api')

//GET
Route.group(() => {
Route.get('user/get-information', 'CertificateController.getCertificate').middleware(['auth'])
Route.get('user/get-certificate-string', 'CertificateController.getCertificateToString').middleware(['auth'])
Route.get('user/get-certificate-credential', 'CertificateController.getCertificateByCredential').middleware(['auth'])
}).prefix('api')
