<template>
  <div>
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">{{ "Sign Certificate" }}</div>
            <div class="modal-body">
              <input type="text" v-model="key" class="key" placeholder="Private Key"/>
              <textarea name="signature" 
              :value="signature" 
              cols="30" rows="5"
              :disabled="true"
              placeholder="Signature"></textarea>
            </div>
            <div class="modal-footer">
              <button @click="submit">{{ "Submit" }}</button>
              <button class="close" @click="close">{{ "Close" }}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ServerRequest from '@/requests/ServerRequest'
import BlockchainRequest from '@/requests/BlockchainRequest'

export default {
  data() {
    return {
      key: null,
      signature: null,
      currentCertificate: null
    }
  },
  props: {
    email: {
      type: String,
      required: true
    }
  },
  methods: {
    async submit() {
      const certificate = await ServerRequest.getCertificateToString({ email: this.email })
      console.log("submit -> certificate", certificate)
      const signature = await BlockchainRequest.signCertificate({ privateKey: this.key, data: JSON.stringify(certificate[0]) })
      const currentCertificate = await ServerRequest.createSignature({ email: this.email, signature: signature })
      this.currentCertificate = currentCertificate
      this.signature = signature
      window.EventBus.$emit('SUCCESS', 'Success')
    },
    close() {
      this.$emit('close-modal', this.key, this.currentCertificate)
      this.$emit('disable')
    }
  },
}
</script>

<style>
.modal-mask {
  font-family: Arial, Helvetica, sans-serif;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  width: 50%;
  margin: 0px auto;
  padding: 30px 57px 30px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header {
  font-size: 18px;
  font-weight: 600;
  text-align: left;
  color: #000000;
}
.modal-body {
  margin: 20px 0;
}
.modal-body input {
  font-size: 15px;
  color: #000000;
  border-radius: 3px;
  padding: 12px 15px;
  margin-bottom: 10px;
  background-color: #f3f4f5;
  border: solid 1px rgba(3,21,50,0.13);
  box-sizing: border-box;
  margin-left: 0px;
  width: 100%;
}
.modal-body textarea {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  color: #000000;
  border-radius: 3px;
  padding: 12px 15px;
  margin-bottom: 10px;
  background-color: #f3f4f5;
  border: solid 1px rgba(3,21,50,0.13);
  box-sizing: border-box;
  resize: none;
  width: 100%;
}
.modal-footer {
  display: flex;
}
.modal-footer button {
  background: #000000;
  width: 18%;
  border: 0;
  padding: 13px;
  color: #FFFFFF;
  font-size: 15px;
  border-radius: 3px;
  margin-left: auto;
  margin-right: 0;
  cursor: pointer; 
}
.modal-footer button.close {
  margin-left: 5px;
}
</style>