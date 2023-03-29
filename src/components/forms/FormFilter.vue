<script setup>
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate'

defineEmits(['formSearch'])

defineProps({
  schema: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <VeeForm v-slot="{ handleSubmit, handleReset }" as="">
    <form
        @submit="handleSubmit($event, fieldsValues => $emit('formSearch', {$event, fieldsValues}))"
        class="default-form form-search"
    >
      <label
          v-for="{ as, name, label, children, hidden, grid, ...attrs } in schema.fields"
          :key="name"
          :for="name"
          class="default-form__label"
          :class="grid"
      >
        <span class="default-form__label-desc">{{ label }}</span>

        <Field :as="as" :id="name" :name="name" v-bind="attrs" :class="as === 'textarea' ? 'default-form__textarea' : 'default-form__input'">
          <template v-if="children && children.length">
            <component v-for="({ tag, text, ...childAttrs }, idx) in children"
                       :key="idx"
                       :is="tag"
                       v-bind="childAttrs"
            >
              {{ text }}
            </component>
          </template>
        </Field>

        <ErrorMessage :name="name" class="form-error" />

      </label>

      <div class="default-form__label default-form__submit">
        <button type="submit" class="btn btn--big">Найти рецензию</button>
      </div>

    </form>
  </VeeForm>
</template>