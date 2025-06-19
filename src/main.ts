import { createApp } from "vue";
import App from "./App.vue";
import ui from "@nuxt/ui/vue-plugin";
import { createRouter, createWebHistory } from "vue-router";
import Index from "./pages/Index.vue";
import Home from "./pages/Home.vue";
import About from "./pages/About.vue";
import SignUp from "./pages/SignUp.vue";
import Login from "./pages/Login.vue";
import First from "./components/chat/parts/First.vue";
import Second from "./components/chat/parts/Second.vue";
import Third from "./components/chat/parts/Third.vue";
import Test from "./pages/Test.vue";

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
      path: "/chat",
      component: First,
      redirect: "/chat/100",
      children: [
        {
          path: ":server",
          component: Second,
          // props: true,
          children: [
            {
              path: ":channel",
              component: Third,
              // props: true,
            },
          ],
        },
      ],
    },
  ],
});

const app = createApp(App);

app.use(router);
app.use(ui);

app.mount("#app");
