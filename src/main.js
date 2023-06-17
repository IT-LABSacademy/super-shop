import './assets/main.css'
import "vue-toastification/dist/index.css";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Toast, options } from './libs/toast';

const app = createApp(App)

app.use(router)
app.use(Toast, options)

app.mount('#app')
