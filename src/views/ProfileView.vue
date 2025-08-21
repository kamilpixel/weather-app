<template>
  <div class="container mx-auto p-4">
    <div class="w-full relative pb-[40px]">
      <div class="w-full text-center absolute top-2 left-0 font-medium text-lg">Edit Profile</div>
      <ButtonIcon icon-name="chevron-left" @click="goHome()" class="absolute top-0 left-0" />
    </div>

    <div class="w-full text-center mb-4">
      <div class="relative w-[130px] h-[127px] mx-auto mb-4">
        <img :src="userPlaceholder" alt="Profile Picture" class="mx-auto" />
        <ButtonIcon icon-name="edit" class="absolute -bottom-2 -right-2" @click="uploadPicture" />
      </div>

      <p v-if="displayInfo.fullName">{{ displayInfo.fullName }}</p>
      <p>
        <span v-if="displayInfo.email">{{ displayInfo.email }} </span>
        <span v-if="displayInfo.phone"> | {{ `+${displayInfo.phone}` }}</span>
      </p>
    </div>

    <div>
      <!-- TODO style input fields -->
      <!-- Full name -->
      <input
        id="fullName"
        type="text"
        name="fullName"
        placeholder="Full Name"
        class="border-1 w-full mb-4"
        v-model="fullName"
      />
      <!-- Email -->
      <input
        id="email"
        type="text"
        name="email"
        placeholder="Email"
        class="border-1 w-full mb-4"
        v-model="email"
      />
      <!-- Phone number -->
      <input
        id="phone"
        type="text"
        name="phone"
        placeholder="Phone"
        class="border-1 w-full mb-4"
        v-model="phone"
      />
    </div>

    <div>
      <ButtonComponent class="w-full" @click="onClickSave">SUBMIT</ButtonComponent>
      <!-- TODO style button -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useNavigation } from '@/composables/useNavigation';
import ButtonIcon from '@/components/shared/atoms/ButtonIcon.vue';
import type { UserInfo } from '@/types/user.types';
import ButtonComponent from '@/components/shared/atoms/ButtonComponent.vue';
import userPlaceholder from '@/assets/user-placeholder.png';
import { useEmailValidation } from '@/composables/useEmailValidation';
import { usePhoneValidation } from '@/composables/usePhoneValidation';

const store = useStore();
const { goHome } = useNavigation();

const { isValidEmail } = useEmailValidation();
const { validatePhone } = usePhoneValidation();

const displayInfo = computed<UserInfo>(() => store.state.user.userInfo);

const fullName = computed({
  get: () => store.state.user.userInfo.fullName,
  set: (val: string) => store.commit('user/SET_FULL_NAME', { fullName: val }),
});

const email = computed({
  get: () => store.state.user.userInfo.email,
  set: (val: string) => store.commit('user/SET_EMAIL', { email: val }),
});

const phone = computed({
  get: () => store.state.user.userInfo.phone,
  set: (val: string) => store.commit('user/SET_PHONE', { phone: val }),
});

const uploadPicture = () => {
  // TODO upload picture feature
  console.log('uploadPicture...');
};

const onClickSave = () => {
  // TODO proper form validation using vee-validate

  // Validate full name
  if (!fullName.value || !email.value || !phone.value) {
    alert('Please insert user info');
    return;
  }

  // Validate email address
  if (!isValidEmail(email.value)) {
    alert('Please enter valid email address');
    return;
  }

  // Validate phone number
  // TODO use proper phone number library e.g. google-libphonenumber
  if (!validatePhone(phone.value)) {
    alert('Please enter valid phone number');
    return;
  }

  // Success
  alert('User info successfully save!');
};
</script>
