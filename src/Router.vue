<script setup>
import { ref, computed } from "vue";
import NotFound from "./NotFound.vue";
import Home from "./Home/index.vue";
import SubmitLoan from "./SubmitLoan/index.vue";
import PlusIcon from "./components/icons/PlusIcon.vue";

const routes = {
  "/": Home,
  "/new-loan": SubmitLoan,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || NotFound;
});
</script>

<template>
  <header>
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href="#/">Loan</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="#/new-loan"><PlusIcon /> Loan Application</a>
          </li>
        </ul>
      </div>
    </div>
  </header>
  <main>
    <component :is="currentView" />
  </main>
</template>
