<script setup>
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate'

defineEmits(['formSubmit'])

defineProps({
  schema: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <VeeForm v-slot="{handleSubmit}" as="div" class="account__right">
    <form
        @submit="handleSubmit($event, fieldsValues => $emit('formSubmit', {$event, fieldsValues}))"
        class="default-form default-form__review-rate"
    >
      <label
          v-for="{ as, name, label, children, hidden, ...attrs } in schema.fields"
          :key="name"
          :for="name"
          class="default-form__label"
          :class="{
          'default-form__label--hidden': hidden
        }"
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

      <button type="submit" class="btn btn--big default-form__submit">Оценить</button>

    </form>
  </VeeForm>
</template>