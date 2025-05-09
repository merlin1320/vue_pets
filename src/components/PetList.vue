<script lang="ts" setup>
import { ref } from 'vue'
import type { Pet } from './PetsType.d.ts'
const pets = ref<Pet[]>([
  {
    id: 1,
    name: 'Fluffy',
    ownerName: 'Frank',
    age: 3,
    favoriteFood: 'Fish',
    isFed: false,
  },
  {
    id: 2,
    name: 'Buddy',
    ownerName: 'Fred',
    age: 5,
    favoriteFood: 'Beef',
    isFed: true,
  },
])
</script>

<template>
  <div>
    <h1>Pet List</h1>
    <ul>
      <li v-for="pet in pets" :key="pet.id">
        {{ pet.name }} - {{ pet.ownerName }} - {{ pet.age }} - {{ pet.favoriteFood }} -
        {{ pet.isFed ? 'Fed' : 'Not Fed' }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
h1 {
  color: #333;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
li:last-child {
  border-bottom: none;
}
li:hover {
  background-color: #f0f0f0;
}
li:active {
  background-color: #e0e0e0;
}
li:focus {
  outline: 2px solid #007bff;
}
li:focus-visible {
  outline: 2px solid #007bff;
}
li:focus-within {
  outline: 2px solid #007bff;
}
li:focus-visible:hover {
  background-color: #e0e0e0;
}
li:focus-within:hover {
  background-color: #e0e0e0;
}
</style>
