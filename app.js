const SUPABASE_URL = 'https://iayqcriorpyccerwusqi.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_6saNOL2kK0PFqSctpiCkyw_h8sqs9hg';

const modal = document.getElementById('modal');
let supabaseClient = null;

async function getSupabase() {
  if (!supabaseClient) {
    const { createClient } = await import(
      'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
    );

    supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );
  }

  return supabaseClient;
}

function openLogin() {
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  renderAuth('signin');
}

function openApp() {
  openLogin();
}

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

function renderAuth(mode = 'signin', message = '', isError = false) {
  const box = document.querySelector('.modal-box');
  const signup = mode === 'signup';

  box.innerHTML = `
    <button class="close" onclick="closeModal()">×</button>

    <div class="brand">
      <span class="mark">Z</span>
      <span>FINORA AI</span>
    </div>

    <h2>${signup ? 'Create your account.' : 'Enter the intelligence layer.'}</h2>

    <p>
      ${signup
        ? 'Create your FINORA account to access the platform.'
        : 'Sign in to access your FINORA workspace.'}
    </p>

    <form onsubmit="handleAuth(event, '${signup ? 'signup' : 'signin'}')">

      <label style="display:block;margin:14px 0 6px">
        Email
      </label>

      <input
        id="auth-email"
        type="email"
        autocomplete="email"
        required
        placeholder="you@example.com"
        style="width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:1px solid #1d2820;background:transparent;color:inherit"
      >

      <label style="display:block;margin:14px 0 6px">
        Password
      </label>

      <input
        id="auth-password"
        type="password"
        autocomplete="${signup ? 'new-password' : 'current-password'}"
        required
        minlength="6"
        placeholder="••••••••"
        style="width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:1px solid #1d2820;background:transparent;color:inherit"
      >

      <button
        class="primary full"
        type="submit"
        style="margin-top:18px"
      >
        ${signup ? 'Create account' : 'Sign in'} →
      </button>

    </form>

    ${
      message
        ? `<p style="margin-top:14px;color:${isError ? '#ff7b72' : '#8c988f'}">${message}</p>`
        : ''
    }

    <button
      type="button"
      onclick="renderAuth('${signup ? 'signin' : 'signup'}')"
      style="margin-top:16px;background:none;border:0;color:inherit;text-decoration:underline;cursor:pointer"
    >
      ${
        signup
          ? 'Already have an account? Sign in'
          : 'New to FINORA? Create an account'
      }
    </button>
  `;
}

async function handleAuth(event, mode) {
  event.preventDefault();

  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;

  const box = document.querySelector('.modal-box');
  const button = box.querySelector('form button[type="submit"]');

  button.disabled = true;
  button.textContent = 'Please wait...';

  try {
    const supabase = await getSupabase();

    let result;

    if (mode === 'signup') {
      result = await supabase.auth.signUp({
        email,
        password
      });

      if (result.error) {
        throw result.error;
      }

      if (!result.data.session) {
        renderAuth(
          'signin',
          'Account created. Check your email to confirm your account, then sign in.',
          false
        );
        return;
      }

    } else {
      result = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (result.error) {
        throw result.error;
      }
    }

    showWorkspace();

  } catch (error) {
    renderAuth(
      mode,
      error.message || 'Authentication failed.',
      true
    );
  }
}

function showWorkspace() {
  const box = document.querySelector('.modal-box');

  box.innerHTML = `
    <button class="close" onclick="closeModal()">×</button>

    <div class="brand">
      <span class="mark">Z</span>
      <span>FINORA AI</span>
    </div>

    <h2>Workspace ready.</h2>

    <p>
      You are successfully signed in to FINORA AI.
    </p>

    <div style="border:1px solid #1d2820;border-radius:10px;padding:16px;color:#8c988f;font-size:13px;line-height:1.7">
      ✓ Account authenticated<br>
      ✓ Secure session active<br>
      → FINORA intelligence workspace
    </div>

    <button
      class="primary full"
      onclick="signOut()"
      style="margin-top:16px"
    >
      Sign out
    </button>
  `;
}

async function signOut() {
  const supabase = await getSupabase();

  await supabase.auth.signOut();

  renderAuth(
    'signin',
    'You have been signed out.',
    false
  );
}

modal.addEventListener('click', e => {
  if (e.target === modal) {
    closeModal();
  }
});
