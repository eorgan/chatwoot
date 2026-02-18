<script>
// utils and composables
import { login } from '../../api/auth';
import { mapGetters } from 'vuex';
import { useAlert } from 'dashboard/composables';
import { required, email } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { SESSION_STORAGE_KEYS } from 'dashboard/constants/sessionStorage';
import SessionStorage from 'shared/helpers/sessionStorage';
import { useBranding } from 'shared/composables/useBranding';

// components
import SimpleDivider from '../../components/Divider/SimpleDivider.vue';
import FormInput from '../../components/Form/Input.vue';
import GoogleOAuthButton from '../../components/GoogleOauth/Button.vue';
import Spinner from 'shared/components/Spinner.vue';
import Icon from 'dashboard/components-next/icon/Icon.vue';
import NextButton from 'dashboard/components-next/button/Button.vue';
import MfaVerification from 'dashboard/components/auth/MfaVerification.vue';

const ERROR_MESSAGES = {
  'no-account-found': 'LOGIN.OAUTH.NO_ACCOUNT_FOUND',
  'business-account-only': 'LOGIN.OAUTH.BUSINESS_ACCOUNTS_ONLY',
  'saml-authentication-failed': 'LOGIN.SAML.API.ERROR_MESSAGE',
  'saml-not-enabled': 'LOGIN.SAML.API.ERROR_MESSAGE',
};

const IMPERSONATION_URL_SEARCH_KEY = 'impersonation';

export default {
  components: {
    FormInput,
    GoogleOAuthButton,
    Spinner,
    NextButton,
    SimpleDivider,
    MfaVerification,
    Icon,
  },
  props: {
    ssoAuthToken: { type: String, default: '' },
    ssoAccountId: { type: String, default: '' },
    ssoConversationId: { type: String, default: '' },
    email: { type: String, default: '' },
    authError: { type: String, default: '' },
  },
  setup() {
    const { replaceInstallationName } = useBranding();
    return {
      replaceInstallationName,
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      // We need to initialize the component with any
      // properties that will be used in it
      credentials: {
        email: '',
        password: '',
      },
      loginApi: {
        message: '',
        showLoading: false,
        hasErrored: false,
      },
      error: '',
      mfaRequired: false,
      mfaToken: null,
      mounted: false,
    };
  },
  validations() {
    return {
      credentials: {
        password: {
          required,
        },
        email: {
          required,
          email,
        },
      },
    };
  },
  computed: {
    ...mapGetters({ globalConfig: 'globalConfig/get' }),
    allowedLoginMethods() {
      return window.chatwootConfig.allowedLoginMethods || ['email'];
    },
    showGoogleOAuth() {
      return (
        this.allowedLoginMethods.includes('google_oauth') &&
        Boolean(window.chatwootConfig.googleOAuthClientId)
      );
    },
    showSignupLink() {
      return window.chatwootConfig.signupEnabled === 'true';
    },
    showSamlLogin() {
      return this.allowedLoginMethods.includes('saml');
    },
  },
  created() {
    if (this.ssoAuthToken) {
      this.submitLogin();
    }
    if (this.authError) {
      const messageKey = ERROR_MESSAGES[this.authError] ?? 'LOGIN.API.UNAUTH';
      // Use a method to get the translated text to avoid dynamic key warning
      const translatedMessage = this.getTranslatedMessage(messageKey);
      useAlert(translatedMessage);
      // wait for idle state
      this.requestIdleCallbackPolyfill(() => {
        // Remove the error query param from the url
        const { query } = this.$route;
        this.$router.replace({ query: { ...query, error: undefined } });
      });
    }
  },
  mounted() {
    requestAnimationFrame(() => {
      this.mounted = true;
    });
  },
  methods: {
    getTranslatedMessage(key) {
      // Avoid dynamic key warning by handling each case explicitly
      switch (key) {
        case 'LOGIN.OAUTH.NO_ACCOUNT_FOUND':
          return this.$t('LOGIN.OAUTH.NO_ACCOUNT_FOUND');
        case 'LOGIN.OAUTH.BUSINESS_ACCOUNTS_ONLY':
          return this.$t('LOGIN.OAUTH.BUSINESS_ACCOUNTS_ONLY');
        case 'LOGIN.API.UNAUTH':
        default:
          return this.$t('LOGIN.API.UNAUTH');
      }
    },
    // TODO: Remove this when Safari gets wider support
    // Ref: https://caniuse.com/requestidlecallback
    //
    requestIdleCallbackPolyfill(callback) {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(callback);
      } else {
        // Fallback for safari
        // Using a delay of 0 allows the callback to be executed asynchronously
        // in the next available event loop iteration, similar to requestIdleCallback
        setTimeout(callback, 0);
      }
    },
    showAlertMessage(message) {
      // Reset loading, current selected agent
      this.loginApi.showLoading = false;
      this.loginApi.message = message;
      useAlert(this.loginApi.message);
    },
    handleImpersonation() {
      // Detects impersonation mode via URL and sets a session flag to prevent user settings changes during impersonation.
      const urlParams = new URLSearchParams(window.location.search);
      const impersonation = urlParams.get(IMPERSONATION_URL_SEARCH_KEY);
      if (impersonation) {
        SessionStorage.set(SESSION_STORAGE_KEYS.IMPERSONATION_USER, true);
      }
    },
    submitLogin() {
      this.loginApi.hasErrored = false;
      this.loginApi.showLoading = true;

      const credentials = {
        email: this.email
          ? decodeURIComponent(this.email)
          : this.credentials.email,
        password: this.credentials.password,
        sso_auth_token: this.ssoAuthToken,
        ssoAccountId: this.ssoAccountId,
        ssoConversationId: this.ssoConversationId,
      };

      login(credentials)
        .then(result => {
          // Check if MFA is required
          if (result?.mfaRequired) {
            this.loginApi.showLoading = false;
            this.mfaRequired = true;
            this.mfaToken = result.mfaToken;
            return;
          }

          this.handleImpersonation();
          this.showAlertMessage(this.$t('LOGIN.API.SUCCESS_MESSAGE'));
        })
        .catch(response => {
          // Reset URL Params if the authentication is invalid
          if (this.email) {
            window.location = '/app/login';
          }
          this.loginApi.hasErrored = true;
          this.showAlertMessage(
            response?.message || this.$t('LOGIN.API.UNAUTH')
          );
        });
    },
    submitFormLogin() {
      if (this.v$.credentials.email.$invalid && !this.email) {
        this.showAlertMessage(this.$t('LOGIN.EMAIL.ERROR'));
        return;
      }

      this.submitLogin();
    },
    handleMfaVerified() {
      // MFA verification successful, continue with login
      this.handleImpersonation();
      window.location = '/app';
    },
    handleMfaCancel() {
      // User cancelled MFA, reset state
      this.mfaRequired = false;
      this.mfaToken = null;
      this.credentials.password = '';
    },
  },
};
</script>

<template>
  <main
    class="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950"
  >
    <!-- Mesh gradient blobs -->
    <div
      class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl"
    />
    <div
      class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/30 dark:bg-indigo-900/15 blur-3xl"
    />
    <div
      class="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-sky-100/40 dark:bg-sky-900/10 blur-3xl"
    />

    <div
      class="relative z-10 flex flex-col items-center w-full max-w-md px-4 mx-auto transition-all duration-700 ease-out"
      :class="mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center mb-4">
        <img
          :src="globalConfig.logo"
          :alt="globalConfig.installationName"
          class="block w-auto h-20 dark:hidden"
        />
        <img
          v-if="globalConfig.logoDark"
          :src="globalConfig.logoDark"
          :alt="globalConfig.installationName"
          class="hidden w-auto h-20 dark:block"
        />
      </div>
      <p
        v-if="showSignupLink"
        class="mb-8 text-sm text-slate-500 dark:text-slate-400"
      >
        {{ $t('COMMON.OR') }}
        <router-link
          to="auth/signup"
          class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          {{ $t('LOGIN.CREATE_NEW_ACCOUNT') }}
        </router-link>
      </p>
      <div v-else class="mb-2" />

      <!-- MFA Verification Section -->
      <div v-if="mfaRequired" class="w-full">
        <MfaVerification
          :mfa-token="mfaToken"
          @verified="handleMfaVerified"
          @cancel="handleMfaCancel"
        />
      </div>

      <!-- Login Card -->
      <section
        v-else
        class="w-full p-8 border rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-slate-800/60 border-white/50 dark:border-slate-700/50 shadow-xl shadow-black/5 dark:shadow-black/20"
        :class="{ 'animate-wiggle': loginApi.hasErrored }"
      >
        <div v-if="!email">
          <div class="flex flex-col gap-3">
            <GoogleOAuthButton v-if="showGoogleOAuth" />
            <div v-if="showSamlLogin">
              <router-link
                to="/app/login/sso"
                class="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-white/60 dark:bg-white/10 text-slate-700 dark:text-slate-200 ring-1 ring-slate-200/60 dark:ring-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition-colors"
              >
                <Icon
                  icon="i-lucide-lock-keyhole"
                  class="mr-2 size-4 text-slate-500 dark:text-slate-400"
                />
                {{ $t('LOGIN.SAML.LABEL') }}
              </router-link>
            </div>
            <SimpleDivider
              v-if="showGoogleOAuth || showSamlLogin"
              :label="$t('COMMON.OR')"
              class="my-1 uppercase"
            />
          </div>
          <form class="space-y-4" @submit.prevent="submitFormLogin">
            <FormInput
              v-model="credentials.email"
              name="email_address"
              type="text"
              data-testid="email_input"
              :tabindex="1"
              required
              :label="$t('LOGIN.EMAIL.LABEL')"
              :placeholder="$t('LOGIN.EMAIL.PLACEHOLDER')"
              :has-error="v$.credentials.email.$error"
              @input="v$.credentials.email.$touch"
            />
            <FormInput
              v-model="credentials.password"
              type="password"
              name="password"
              data-testid="password_input"
              required
              :tabindex="2"
              :label="$t('LOGIN.PASSWORD.LABEL')"
              :placeholder="$t('LOGIN.PASSWORD.PLACEHOLDER')"
              :has-error="v$.credentials.password.$error"
              @input="v$.credentials.password.$touch"
            >
              <p v-if="!globalConfig.disableUserProfileUpdate">
                <router-link
                  to="auth/reset/password"
                  class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  tabindex="4"
                >
                  {{ $t('LOGIN.FORGOT_PASSWORD') }}
                </router-link>
              </p>
            </FormInput>
            <NextButton
              lg
              type="submit"
              data-testid="submit_button"
              class="w-full !rounded-xl"
              :tabindex="3"
              :label="$t('LOGIN.SUBMIT')"
              :disabled="loginApi.showLoading"
              :is-loading="loginApi.showLoading"
            />
          </form>
        </div>
        <div v-else class="flex items-center justify-center py-8">
          <Spinner color-scheme="primary" size="" />
        </div>
      </section>
    </div>
  </main>
</template>
