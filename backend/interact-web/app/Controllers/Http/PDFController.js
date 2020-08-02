'use strict'
const cli = use('App/Create-PDF/lib/cli')

class PDFController {
    initCertificate({ request, response }) {
        const { courseData } = request.all()
        cli.init(courseData)
        return response.ok({ message: "Creating certificate's data" })
    }

    createPDF({ request, response }) {
        cli.generate()
        return response.ok({ message: "Creating certificate's PDF" })
    }
}

module.exports = PDFController
