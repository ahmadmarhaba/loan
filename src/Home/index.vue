<script setup lang="ts">
import { ref, onMounted } from "vue";
import LoanItem from "./components/LoanItem.vue";
import moment from "moment";
const loan_api = import.meta.env.VITE_LOAN_API;
interface Loan {
  _id: string;
  name: string;
  amount_gbp: number;
  amount_original: number;
  term: number;
  rate_used: number;
  currency: string;
  createdAt: string;
}

const loans = ref<Loan[]>([]);
const isLoading = ref(false); // Add loading state
const sort_by = ref<"createdAt_sort" | "amount_sort" | "term_sort">("createdAt_sort");
const sort_direction = ref<"asc" | "desc">("desc");
const fetchLoans = async () => {
  isLoading.value = true; // Set loading to true
  try {
    const response = await fetch(`${loan_api}/loans?${sort_by.value}=${sort_direction.value}`);

    if (!response.ok) throw new Error("Failed to fetch data");

    const data: Loan[] = await response.json();

    loans.value = data.map((loan) => ({
      ...loan,
      createdAt: moment(new Date(loan.createdAt)).format("MMMM Do YYYY, h:mm:ss a"),
      amount_gbp: Math.ceil(loan.amount_gbp * 10000) / 10000,
      amount_original: Math.ceil(loan.amount_original * 10000) / 10000,
      rate_used: Math.ceil(loan.rate_used * 10000) / 10000,
    })); // Store exchange rates
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
  } finally {
    isLoading.value = false; // Set loading to false
  }
};

const current_loan = ref<Loan | null>(null);
const openModal = (loan: Loan) => {
  current_loan.value = loan;
  (document.getElementById("loan_modal") as any)?.showModal();
};
const handleSortBy = (val: string) => {
  if (val === "amount_sort") {
    sort_by.value = "amount_sort";
  } else if (val === "term_sort") {
    sort_by.value = "term_sort";
  } else {
    sort_by.value = "createdAt_sort";
  }
  fetchLoans();
};
const handleSortDirection = (val: string) => {
  if (val === "asc") {
    sort_direction.value = "asc";
  } else {
    sort_direction.value = "desc";
  }
  fetchLoans();
};
// Run fetch once when the component mounts
onMounted(fetchLoans);
</script>

<template>
  <!-- Open the modal using ID.showModal() method -->
  <dialog id="loan_modal" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">View loan</h3>
      <div>
        <p>Name: {{ current_loan?.name }}</p>
        <p>Term: {{ current_loan?.term }}</p>
        <p>GBP Amount: {{ current_loan?.amount_gbp }}</p>
        <p>Rate Used: {{ current_loan?.rate_used }}</p>
        <p>Original Amount: {{ current_loan?.amount_original }}</p>
        <p>Currency: {{ current_loan?.currency }}</p>
        <p>Created At: {{ current_loan?.createdAt }}</p>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
  <div class="max-w-[70rem] mx-auto mt-4">
    <div class="flex flex-row justify-end gap-4 items-center mb-4">
      <p>Sort By</p>
      <div>
        <button
          class="btn btn-accent mr-2"
          @click="
            () => {
              handleSortBy('amount_sort');
            }
          "
          :class="{ '!btn-primary': sort_by === 'amount_sort' }"
        >
          GBP Amount
        </button>
        <button
          class="btn btn-accent mr-2"
          @click="
            () => {
              handleSortBy('term_sort');
            }
          "
          :class="{ '!btn-primary': sort_by === 'term_sort' }"
        >
          Term
        </button>
        <button
          class="btn btn-accent"
          @click="
            () => {
              handleSortBy('createdAt_sort');
            }
          "
          :class="{ '!btn-primary': sort_by !== 'amount_sort' && sort_by !== 'term_sort' }"
        >
          Created at
        </button>
      </div>
      <div>
        <button
          class="btn btn-info mr-2"
          @click="
            () => {
              handleSortDirection('asc');
            }
          "
          :class="{ '!btn-primary': sort_direction === 'asc' }"
        >
          Asc
        </button>
        <button
          class="btn btn-info"
          @click="
            () => {
              handleSortDirection('desc');
            }
          "
          :class="{ '!btn-primary': sort_direction === 'desc' }"
        >
          Desc
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Term</th>
            <th>GBP Amount</th>
            <th>Rate Used</th>
            <th>Original Amount</th>
            <th>Currency</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading" v-for="n in 5" :key="n">
            <td colspan="7">
              <div class="skeleton h-10 w-full"></div>
            </td>
          </tr>
          <tr v-if="loans.length === 0 && !isLoading">
            <td colspan="7" class="text-center">
              <div class="flex flex-row gap-4 justify-center w-full items-center py-8">
                <p>No loans available. Click</p>
                <a href="#/new-loan" class="btn btn-primary"> Apply for loan </a>
              </div>
            </td>
          </tr>
          <LoanItem v-for="loan in loans" :key="loan._id" v-else>
            <template #name
              ><button class="link link-primary" @click="() => openModal(loan)">{{ loan.name }}</button></template
            >
            <template #term>{{ loan.term }}</template>
            <template #amount_gbp>{{ loan.amount_gbp }}</template>
            <template #rate_used>{{ loan.rate_used }}</template>
            <template #amount_original>{{ loan.amount_original }}</template>
            <template #currency>{{ loan.currency }}</template>
            <template #createdAt>{{ loan.createdAt.toString() }}</template>
            <template #action_button> </template>
          </LoanItem>
        </tbody>
      </table>
    </div>
  </div>
</template>
