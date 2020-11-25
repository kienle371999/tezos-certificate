<template>
  <div v-if="dataReady">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">{{ "Blockchain Detail" }}</div>
            <div class="modal-body">
              <label>{{ "Network" }}</label>
              <input type="text" :value="network" :disabled="true" class="network"/>
              <label>{{ "Height" }}</label>
              <input type="text" :value="contractDetail.meta.height" :disabled="true" class="height"/>
              <label>{{ "Block Hash" }}</label>
              <input type="text" :value="contractDetail.meta.block" :disabled="true" class="block-hash"/>
              <label>{{ "Contract Hash" }}</label>
              <a :href="blockchainDirectory" target="_blank">
              <input type="text" :value="contractDetail.meta.contract" :disabled="true" class="contract-hash"/>
              </a>
            </div> 
            <div class="modal-footer">
              <button @click="close">{{ "Close" }}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import BlockchainRequest from '@/requests/BlockchainRequest'

export default {
  data() {
    return {
      network: 'Carthagenet',
      contractDetail: null,
      blockchainDirectory: null,
      dataReady: false
    }
  },
  props: {
    contractAddress: {
      type: String,
      required: true
    },
  },
  created() {
    const baseURL = process.env.VUE_APP_TEZOS_URL
    const url = baseURL.concat(this.contractAddress)
    this.blockchainDirectory = url
    console.log('1234567', this.contractAddress)
    BlockchainRequest.getContractDetail({ contractAddress: this.contractAddress })
    .then(res => {
      this.contractDetail = res
      this.dataReady = true
      console.log('hellloe1112')
    })
  },
  methods: {
    close() {
      this.$emit('close-modal')
    }
  },
}
</script>

<style scoped>
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
  padding: 30px;
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
.modal-body label {
  float: left;
  margin-top: 12px;
  font-size: 15px;
  color: #000000;
}
.modal-body input {
  display: block;
  font-size: 15px;
  color: #000000;
  border-radius: 3px;
  padding: 12px 15px;
  margin-left: 115px;
  margin-bottom: 10px;
  background-color: #f3f4f5;
  border: solid 1px rgba(3,21,50,0.13);
  background: #999999;
  box-sizing: border-box;
  width: 78%;
}
.modal-body .contract-hash {
  cursor: pointer;
  color: #ff0000;
}
.modal-body a {
  text-decoration: none;
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
  margin-right: auto;
  cursor: pointer; 
}
</style>