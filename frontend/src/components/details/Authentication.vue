<template>
  <div>
    <home :activeAuthen="true"/>
    <div class="authenticate">
      <form class="authen-form">
        <h1>{{ "Authentication" }}</h1>
        <input type="text" v-model="credential_number" placeholder="Credential Number"/>
        <button type="button" @click="submit()" :disable="getDisabled">{{ "Verify" }}</button>
      </form>
    </div>
    <authentication-modal v-if="authenModal" 
    :credentialNumber="credential_number" 
    :certificate="certificate"
    @change-modal="change"
    @close-modal="close"/>
    <authen-signature-modal v-if="authenSign" 
    :signature="signature" 
    :email="email"
    @close-sign-modal="closeSign"/>
  </div>
</template>

<script>
  import Home from '@/components/roots/Home.vue' 
  import AuthenticationModal from '@/components/modals/AuthenticationModal.vue'
  import AuthenSignatureModal from '@/components/modals/AuthenSignatureModal.vue'
  import ServerRequest from '@/requests/ServerRequest'

  export default {
    data() {
      return {
        credential_number: null,
        getDisabled: false,
        authenModal: false,
        authenSign: false,
        signature: null,
        email: null,
        certificate: null
      }
    },
    components: {
      Home,
      AuthenticationModal,
      AuthenSignatureModal
    },
    methods: {
      async submit() {
        const certificate = await ServerRequest.getCertificateByCredential({ credential_number: this.credential_number }) 
        if(!certificate.length) {
          window.EventBus.$emit('ERROR', 'Invalid Credential Number')
        }
        else if(!certificate[0].is_broadcasted) {
          window.EventBus.$emit('ERROR', 'Invalid Credential Number')
        }
        else {
          this.authenModal = true
          this.certificate = certificate
        }
      },
      change(signature, email) {
        this.signature = signature
        this.email = email
        this.authenModal = false
        this.authenSign = true
      },
      close() {
        this.authenModal = false
      },
      closeSign() {
        this.authenSign = false
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  h1 {
    color: #000000;
    margin-top: 10%;
    margin-bottom: 20px;
  }
  .authen-form input {
    font-size: 15px;
    color: #031532;
    border-radius: 3px;
    padding: 15px;
    background-color: #f3f4f5;
    border: solid 1px rgba(3,21,50,0.13);
    box-sizing: border-box;
    width: 50%;
  }
  .authen-form button {
    background: #000000;
    width: 10%;
    border: 0;
    padding: 15px;
    color: #FFFFFF;
    font-size: 17px;
    border-radius: 3px;
    position: relative;
    cursor: pointer;
  }
</style>