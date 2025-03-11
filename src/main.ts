import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import "vue3-toastify/dist/index.css";
import SvgIcon from "vue3-icon";

const main_app = createApp(App);
main_app.component("svg-icon", SvgIcon);
main_app.mount("#app");
