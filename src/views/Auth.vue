<script setup>
import {computed, ref, watch} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from "vue-router";
import { loginForm } from '../utils/login-form.js'
import { notification } from '../utils/notification.js'

const store = useStore()
const router = useRouter()

/**
 * Callback fn to as a parameter to pass it to the login form
 *
 * @param values
 */
const cb = values => {
  store.dispatch('auth/login', values)
      .then(res => {
        if (res) {
          store.commit('auth/setAuthUser', true)
          router.push('/')
        }
      })
      .catch(e => store.commit('setMessage', { message: notification(e.code) }))
}

const {
  email,
  eError,
  eBlur,
  password,
  pError,
  pBlur,
  onSubmit,
  isSubmitting
} = loginForm(cb)
</script>

<template>
  <div class="login">
    <form class="default-form" @submit.prevent="onSubmit">
      <h1 class="default-form__heading">Авторизация</h1>
      <div class="default-form__desc">Для доступа к информации на этой странице вам необходимо авторизоваться</div>
      <label class="default-form__label">
        <span class="default-form__label-desc">E-mail</span>
        <input name="email" class="default-form__input" type="email" v-model="email" @blur="eBlur">
        <span class="form-error" v-if="eError">{{ eError }}</span>
      </label>
      <label class="default-form__label">
        <span class="default-form__label-desc">Пароль</span>
        <input name="password" class="default-form__input" type="password" v-model="password" @blur="pBlur">
        <span class="form-error" v-if="pError">{{ pError }}</span>
      </label>
      <button type="submit" id="loginBtn" class="btn btn--big btn--outline default-form__submit" :disabled="isSubmitting">Войти</button>
    </form>
  </div>
</template>
