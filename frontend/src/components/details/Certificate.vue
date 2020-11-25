<template>
  <div>
    <home :activeCertificate="true"/>
    <div class="datatable">
      <table>
        <tr>
          <th>{{ "Name" }}</th>
          <th>{{ "Student ID" }}</th>
          <th>{{ "Email" }}</th>
          <th>{{ "Diploma Type" }}</th>
          <th>{{ "Credential Number" }}</th>
          <th class="action">{{ "Action" }}</th>
        </tr>
        <tr v-for="(certificate, index) in certificates" :key="index">
          <td>{{ certificate.name }}</td>
          <td>{{ certificate.identity }}</td>
          <td>{{ certificate.email }}</td>
          <td>{{ certificate.diploma_type }}</td>
          <td>{{ certificate.credential_number }}</td>
          <td class="action">
            <button @click="getDetail(index)">{{ "Detail" }}</button>
          </td>
        </tr>
      </table>
    </div>
    <certificate-modal v-if="certificateModal" :contractAddress="address" @close-modal="close"/>
  </div>
</template>

<script>
import Home from '@/components/roots/Home.vue' 
import CertificateModal from '@/components/modals/CertificateModal.vue'
import ServerRequest from '@/requests/ServerRequest'

export default {
  components: {
    Home,
    CertificateModal
  },
  data() {
    return {
      certificates: [],
      certificateModal: false,
      address: null
    }
  },
created () {
    ServerRequest.getCertificate().then(certificates => {
      certificates.forEach(certificate => {
        if(certificate.is_broadcasted) {
          this.certificates.push(certificate)
        }
      })
    })
  },
  methods: {
    getDetail(index) {
      console.log("getDetail -> index", index)
      this.address = this.certificates[index].blockchain_hash
      this.certificateModal = true
      console.log('iiiiiiiii', this.certificateModal)
    },
    close() {
      this.certificateModal = false
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.datatable {
  margin-top: 95px;
}
table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}

th {
  text-align: center;
  color: #D5DDE5;
  background: #333333;
  font-size: 15px;
  font-weight: 600;
  padding: 20px;
}
td {
  vertical-align: middle;
  font-size: 13px;
  text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.action {
  padding-right: 30px;
}
button {
  background: #000000;
  width: 100px;
  border: 0;
  padding: 13px;
  color: #FFFFFF;
  font-size: 13px;
  border-radius: 3px;
  height: 40px;
  position: relative;
  cursor: pointer;
}
</style>
