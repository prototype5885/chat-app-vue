import { createApp } from "vue";
import App from "./App.vue";
import ui from "@nuxt/ui/vue-plugin";
import { createRouter, createWebHistory } from "vue-router";
import Index from "./pages/Index.vue";
import Home from "./pages/Home.vue";
import About from "./pages/About.vue";
import SignUp from "./pages/SignUp.vue";
import Login from "./pages/Login.vue";
import Test from "./pages/Test.vue";
import Chat from "./pages/Chat.vue";

export const router = createRouter({
  history: createWebHistory(),
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

const app = createApp(App);

app.use(router);
app.use(ui);

app.mount("#app");
