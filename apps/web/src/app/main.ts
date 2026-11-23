import { createApp } from "vue"
import App from "./App.vue"
// @ts-ignore Vite handles this side-effect stylesheet import.
import "./style.css"
import { router } from "./routes.ts"

createApp(App).use(router).mount("#app")
