import { createApp } from 'vue'
import './assets/css/style.scss'
import router from './router/index.js'
import store from './store/index.js'
import App from './App.vue'

const app = createApp(App)

app.use(router).use(store)

router.isReady().then(() => app.mount('#app'))