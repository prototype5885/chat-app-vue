import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import Aura from "@primeuix/themes/aura";
import { createRouter, createWebHashHistory } from "vue-router";
import ToastPlugin from "vue-toast-notification";
import Tooltip from "primevue/tooltip";
import "vue-toast-notification/dist/theme-bootstrap.css";
import Index from "./pages/Index.vue";
import Home from "./pages/Home.vue";
import About from "./pages/About.vue";
import SignUp from "./pages/SignUp.vue";
import Login from "./pages/Login.vue";
import Test from "./pages/Test.vue";
import Chat from "./pages/Chat.vue";
import { WebSocketService } from "./services/websocketService";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Index,
      redirect: "/home",
      children: [
        { path: "/home", component: Home },
        { path: "/about", component: About },
        { path: "/test", component: Test },
        { path: "/register", component: SignUp },
        { path: "/login", component: Login },
      ],
    },

    {
      path: "/chat/:server?/:channel?",
      component: Chat,
      props: true,
    },
  ],
});

const app = createApp({
  extends: App,
  created() {
    window.addEventListener("beforeunload", this.leaving);
  },
  methods: {
    leaving() {
      WebSocketService.Disconnect();
    },
  },
});

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ConfirmationService);
app.use(ToastPlugin);
app.directive("tooltip", Tooltip);
app.use(createPinia());

app.mount("#app");
