<template>
  <div>
    <home :activeAccount="true"/>
    <div class="account">
      <button type="button" 
      v-on:click="getKey()" 
      :disabled="getDisabled"
      :class="{ disable: getDisabled }">{{ "Generate Key" }}</button>
      <button type="button" 
      v-on:click="downloadKey()" 
      :disabled="downloadDisabled"
      :class="{ disable: downloadDisabled }">{{ "Download" }}</button>
    </div>
  </div>
</template>

<script>
  import Home from '@/components/roots/Home.vue'
  import BlockchainRequest from '@/requests/BlockchainRequest'
  import { saveAs } from 'file-saver'

  export default {
    components: {
      Home
    },
    data() {
      return {
        neededKey: Object,
        getDisabled: false,
        downloadDisabled: false
      }
    },
    methods: {
      async getKey() {
        const validKey = await BlockchainRequest.generateKey()
        this.neededKey = Object.assign({ privateKey: validKey.privateKey,
                                        publicKey: validKey.publicKey,
                                        publicKeyHash: validKey.publicKeyHash })
        this.getDisabled = true
      },
      downloadKey() {
        console.log(this.neededKey)
        const fileTitle = 'generated_key.txt'
        const blob = new Blob([`privateKey: ${this.neededKey.privateKey}\n`,
                              `publicKey: ${this.neededKey.publicKey}\n`, 
                              `address: ${this.neededKey.publicKeyHash}\n`], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, fileTitle)
        this.downloadDisabled = true
      }
    }
  }
</script>

<style scoped>
  button {
    background: #000000;
    width: 100%;
    border: 0;
    padding: 15px;
    color: #FFFFFF;
    font-size: 17px;
    border-radius: 3px;
    width: 155px;
    margin-left: 15px;
  }
  button.disable {
    background: #625D5D;
  }
  .account {
    margin-top: 150px;
    text-align: center;
  }
</style>