<template>
  <div>
    <home :activeTransaction="true"/>
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
            <button 
            @click="showSignature(certificate.email, index)" 
            :disabled="signDisabled[index]"
            :class="{ disable: signDisabled[index] }">{{ "Sign" }}</button>
            <button class="right-button" 
            @click="broadcast()"
            :disabled="broadcastDisabled[index]"
            :class="{ disable: broadcastDisabled[index] }">{{ "Broadcast" }}</button>
          </td>
        </tr>
      </table>
    </div>
    <signature-modal v-if="signModal" :email="email" @close-modal="close" @disable="disable"/>
  </div>
</template>

<script>
import Home from '@/components/roots/Home.vue'
import ServerRequest from '@/requests/ServerRequest'
import SignatureModal from '@/components/modals/SignatureModal.vue'
import BlockchainRequest from '@/requests/BlockchainRequest'
import PDFRequest from '@/requests/PDFRequest' 

export default {
  components: {
    Home,
    SignatureModal
  },
  data() {
    return {
      certificates: [],
      signModal: false,
      email: null,
      index: 0,
      privateKey: null,
      signDisabled: [],
      broadcastDisabled: [],
      currentCertificate: null
    }
  },
  created () {
    ServerRequest.getCertificate().then(certificates => {
      certificates.forEach(certificate => {
        if(!certificate.is_broadcasted) {
          this.certificates.push(certificate)
        }
      })
    })
  },
  methods: {
    showSignature(email, index) {
      this.signModal = true
      this.email = email
      this.index = index
    },
    close(key, currentCertificate) {
      this.privateKey = key
      this.signModal = false
      this.currentCertificate = currentCertificate
    },
    disable() {
      this.$set(this.signDisabled, this.index, true)
    },
    async broadcast() {
      const blockchainHash = await BlockchainRequest.broadcastCertificate({ privateKey: this.privateKey, certificate: this.currentCertificate })
      await PDFRequest.createCertificatePDF({ data: this.currentCertificate })
      await ServerRequest.sendCertificateByMail({ name: this.currentCertificate.name, email: "dongky6776@gmail.com" })
      await ServerRequest.storeHash({ email: this.email, blockchain_hash: blockchainHash.contractHash })
      this.$set(this.broadcastDisabled, this.index, true)
      window.EventBus.$emit('SUCCESS', 'Success')
    }
  },
  mouted() {
    this.broadcastDisabled[0] = true;
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
button.disable {
  background: #625D5D;
}
.right-button {
  margin-left: 5px;
}
.right-button.disable {
  background: #625D5D;
}
</style>
