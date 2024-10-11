// import {defineConfig} from 'vite'
// import vue from '@vitejs/plugin-vue'

// export default defineConfig({
//    plugins:[vue()]
// })


const vue = require('./plugins/plugin-vue')


module.exports = {
   plugins:[vue()]
}