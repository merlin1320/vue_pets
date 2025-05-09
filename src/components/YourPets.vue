<script setup lang="ts">
import type { Pet } from './PetsType.d.ts'
defineProps<{
  pet: Pet
}>()
const emit = defineEmits<{
  (e: 'toggle', id: number): void
}>()
</script>

<template>
  <div class="pet">
    <input type="checkbox" :checked="pet.isFed" @change="emit('toggle', pet.id)" />
    <span>{{ pet.name }}</span>
    <span>{{ pet.ownerName }}</span>
    <span>{{ pet.age }}</span>
    <span>{{ pet.favoriteFood }}</span>
  </div>
</template>

<style scoped>
.pet {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.pet input {
  margin-right: 10px;
}
.pet span {
  flex: 1;
}
</style>
