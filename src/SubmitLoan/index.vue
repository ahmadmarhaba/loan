<script setup>
// Importing the ref function from Vue to create reactive variables
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { validateUsername } from "../helpers/utils";

const apiKey = import.meta.env.VITE_CURRENCY_API;
const loan_api = import.meta.env.VITE_LOAN_API;
// Defining reactive variables for form inputs
const usernameInvalid = ref(false);
const name = ref("");
const amount = ref(0);
const term = ref(0);
const currencies = ref([
  { name: "USD", symbol: "$" },
  { name: "EUR", symbol: "€" },
  { name: "GBP", symbol: "£" },
  { name: "CAD", symbol: "CA$" },
]);
const currency = ref("USD");
const exchange_rates = ref(null);
// Fetch exchange rates once when the page loads
const fetchExchangeRates = async () => {
  try {
    const response = await fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=GBP&currencies=${currencies.value
        .map((c) => c.name)
        .join(",")}`
    );

    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();

    exchange_rates.value = data.data; // Store exchange rates
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
  }
};

// Function to handle form submission
const handleSubmit = async () => {
  usernameInvalid.value = validateUsername(name.value);
  if (!exchange_rates.value) {
    toast.error("Exchange rates not loaded. Please try again later.", {
      position: "bottom-left",
    });
    return;
  }
  if (usernameInvalid.value) {
    toast.error("Please enter a name", {
      position: "bottom-left",
    });
    return;
  }
  if (!amount.value || amount.value <= 0) {
    toast.error("Please enter a valid amount", {
      position: "bottom-left",
    });
    return;
  }
  if (!term.value || term.value <= 0) {
    toast.error("Please enter a valid term", {
      position: "bottom-left",
    });
    return;
  }
  // Create loan data object
  const loanData = {
    name: name.value,
    amount_gbp: amount.value * exchange_rates.value[currency.value].value,
    amount_original: amount.value,
    term: term.value,
    rate_used: exchange_rates.value[currency.value].value,
    currency: currency.value,
  };
  // send loan data to server with api call
  try {
    const response = await fetch(`${loan_api}/loan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loanData),
    });

    if (!response.ok) throw new Error("Failed to submit loan");

    const data = await response.json();

    if (data._id) {
      // Reset form fields after submission
      name.value = "";
      amount.value = 0;
      term.value = 0;
      currency.value = "USD";
      toast.success(
        `Loan submitted for ${loanData.name} with amount ${loanData.amount_original} ${loanData.currency}`,
        {
          position: "bottom-left",
        }
      ); // ToastOptions
    }
  } catch (error) {
    console.error("Error submitting loan:", error);
    toast.error("Failed to submit loan. Please try again later.", {
      position: "bottom-left",
    });
    return;
  }
};

// Run fetch once when the component mounts
onMounted(fetchExchangeRates);
</script>

<template>
  <div class="place-self-center min-w-lg">
    <p class="font-bold text-2xl my-6">Loan submission form</p>
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <!-- Input field for name -->
      <label class="input w-full" :class="{ 'input-error': usernameInvalid }">
        <span className="label min-w-30">Name</span>
        <input v-model="name" />
      </label>
      <!-- Input field for amount -->
      <label class="input w-full">
        <span className="label min-w-30">Amount</span>
        <input v-model="amount" type="number" />
      </label>
      <!-- Input field for term -->
      <label class="input w-full">
        <span className="label min-w-30">Term</span>
        <input v-model="term" type="number" />
      </label>
      <!-- Dropdown for selecting currency -->
      <label for="currency" className="select w-full">
        <span className="label min-w-30">Currency</span>
        <select v-model="currency" id="currency">
          <option v-for="(currency, index) in currencies" :key="index" :value="currency.name">
            {{ currency.symbol + " " + currency.name }}
          </option>
        </select>
      </label>
      <!-- Submit button -->
      <button class="btn btn-primary w-full" type="submit">Submit</button>
    </form>
  </div>
</template>
