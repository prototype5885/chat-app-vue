<script setup lang="ts">
// import { MsgPackDecode } from "@/services/messagepack";
// import axios from "axios";
// import { time } from "console";
// import { ref } from "vue";

// interface Test {
//   first: bigint[];
//   second: string[];
// }

// const test = ref<Test>();

// axios
//   .get<Uint8Array>("/api/test", {
//     responseType: "arraybuffer",
//   })
//   .then(function (res) {
//     const start = Date.now();
//     test.value = MsgPackDecode(res.data) as Test;

//     // test.value = res.data;

//     let problems = 0;
//     for (let i = 0; i < test.value.first.length; i++) {
//       test.value.first[i] = BigInt(test.value.first[i]);
//       if (test.value.first[i].toString() != test.value.second[i]) {
//         console.log(
//           "First:",
//           test.value.first[i].toString(),
//           "Second:",
//           test.value.second[i],
//           "isnt equal"
//         );
//         problems++;
//       }
//     }
//     console.log(`Time elapsed: ${Date.now() - start} ms`);
//     console.log(
//       `Problems found: ${problems} out of ${test.value.first.length}`
//     );
//   })
//   .catch((error) => {
//     console.error(error);
//   });
</script>

<template>
  <h2>Test</h2>
  <!-- <div class="flex flex-row">
    <h2 v-for="id in test?.first">{{ id }}</h2>
    <span class="mx-2">|</span>
    <h2 v-for="id in test?.second">{{ id }}</h2>
  </div> -->
</template>
