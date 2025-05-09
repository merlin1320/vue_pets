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
    <span>{{ pet.name }}</span>
    <span>{{ pet.ownerName }}</span>
    <span>{{ pet.age }}</span>
    <span>{{ pet.favoriteFood }}</span>
    <input type="checkbox" :checked="pet.isFed" @change="emit('toggle', pet.id)" />
  </div>
</template>

<style scoped>
.pet {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}
.pet inpu[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.pet span {
  flex: 1;
}
</style>
