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

  const userEmail =
    supabaseClient?.auth?.getUser
      ? 'FINORA User'
      : 'FINORA User';

  box.innerHTML = `
    <button class="close" onclick="closeModal()" style="display:none;">

    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:16px;
      margin-bottom:28px;
    ">
      <div class="brand">
        <span class="mark">Z</span>
        <span>FINORA AI</span>
      </div>

      <button
        onclick="toggleBackOfficeMenu()"
        style="
          width:48px;
          height:48px;
          border:1px solid #f5c400;
          border-radius:14px;
          background:#090909;
          color:#f5c400;
          font-size:24px;
          cursor:pointer;
        "
      >☰</button>
    </div>

    <div id="backOfficeMenu" style="
      display:none;
      margin-bottom:24px;
      border:1px solid #292929;
      border-radius:18px;
      overflow:hidden;
      background:#080808;
    ">

      <div class="bo-menu-item">Dashboard</div>
      <div class="bo-menu-item">Wallets</div>
      <div class="bo-menu-item">My Network</div>
      <div class="bo-menu-item">Left Team</div>
      <div class="bo-menu-item">Right Team</div>
      <div class="bo-menu-item">Investments</div>
      <div class="bo-menu-item">Direct Commissions</div>
      <div class="bo-menu-item">Binary Earnings</div>
      <div class="bo-menu-item">Earnings History</div>
      <div class="bo-menu-item">Referral Center</div>
      <div class="bo-menu-item">Transactions</div>
      <div class="bo-menu-item">Profile</div>
      <div class="bo-menu-item">Security</div>
      <div class="bo-menu-item">Support</div>

    </div>

    <div style="margin-bottom:28px;">
      <div style="
        color:#999;
        font-size:14px;
        margin-bottom:6px;
      ">
        Welcome back,
      </div>

      <h2 style="
        margin:0;
        font-size:32px;
        color:#fff;
      ">
        FINORA User 👋
      </h2>

      <p style="
        color:#888;
        margin-top:8px;
      ">
        Manage your capital, network and earnings.
      </p>
    </div>

    <div class="bo-grid">

      <div class="bo-card">
        <span>Total Balance</span>
        <strong>$0.00</strong>
        <small>USDT</small>
      </div>

      <div class="bo-card">
        <span>Invested Capital</span>
        <strong>$0.00</strong>
        <small>USDT</small>
      </div>

      <div class="bo-card">
        <span>Total Earnings</span>
        <strong>$0.00</strong>
        <small>All time</small>
      </div>

      <div class="bo-card">
        <span>Available Balance</span>
        <strong>$0.00</strong>
        <small>Available</small>
      </div>

    </div>

    <h3 class="bo-title">Wallets</h3>

    <div class="bo-wallets">

      <div class="bo-wallet">
        <div>
          <b>USDT</b>
          <span>Stablecoin Wallet</span>
        </div>
        <strong>$0.00</strong>
      </div>

      <div class="bo-wallet">
        <div>
          <b>BTC</b>
          <span>Bitcoin Wallet</span>
        </div>
        <strong>0.000000</strong>
      </div>

      <div class="bo-wallet">
        <div>
          <b>ETH</b>
          <span>Ethereum Wallet</span>
        </div>
        <strong>0.000000</strong>
      </div>

    </div>

    <div class="bo-actions">

      <button>Deposit</button>
      <button>Withdraw</button>
      <button>Transfer</button>
      <button>History</button>

    </div>

    <h3 class="bo-title">My Network</h3>

    <div class="bo-network">

      <div class="team-box">
        <span>LEFT TEAM</span>
        <strong>$0.00</strong>
        <small>Volume</small>
        <em>0 users</em>
      </div>

      <div class="team-center">
        <div class="network-circle">YOU</div>
        <span>Binary Network</span>
      </div>

      <div class="team-box">
        <span>RIGHT TEAM</span>
        <strong>$0.00</strong>
        <small>Volume</small>
        <em>0 users</em>
      </div>

    </div>

    <div class="bo-stat-row">

      <div class="bo-stat">
        <span>Total Users</span>
        <strong>0</strong>
      </div>

      <div class="bo-stat">
        <span>Left Users</span>
        <strong>0</strong>
      </div>

      <div class="bo-stat">
        <span>Right Users</span>
        <strong>0</strong>
      </div>

    </div>

    <h3 class="bo-title">Commissions</h3>

    <div class="commission-card">

      <div>
        <span>Direct Commission</span>
        <small>10% from direct partner investments</small>
      </div>

      <strong>$0.00</strong>

    </div>

    <div class="commission-card">

      <div>
        <span>Binary Commission</span>
        <small>10% of the lower weekly team volume</small>
      </div>

      <strong>$0.00</strong>

    </div>

    <div class="binary-detail">

      <div>
        <span>Left Volume</span>
        <b>$0.00</b>
      </div>

      <div>
        <span>Right Volume</span>
        <b>$0.00</b>
      </div>

      <div>
        <span>Matched Volume</span>
        <b>$0.00</b>
      </div>

      <div>
        <span>Rate</span>
        <b>10%</b>
      </div>

    </div>

    <h3 class="bo-title">Referral Center</h3>

    <div class="referral-card">

      <span>Your Referral Link</span>

      <div class="referral-link">
        finora.ai/?ref=FINORA-USER
        <button>Copy</button>
      </div>

      <div class="referral-stats">

        <div>
          <small>Total Referrals</small>
          <strong>0</strong>
        </div>

        <div>
          <small>Direct Earnings</small>
          <strong>$0.00</strong>
        </div>

      </div>

    </div>

    <h3 class="bo-title">Investment Portfolio</h3>

    <div class="portfolio-card">

      <div class="portfolio-top">
        <div>
          <span>Invested Capital</span>
          <strong>$0.00 USDT</strong>
        </div>

        <div class="status">
          ● ACTIVE
        </div>
      </div>

      <div class="portfolio-chart">
        <div class="chart-line"></div>
      </div>

      <div class="portfolio-info">

        <div>
          <small>Portfolio Performance</small>
          <b>--</b>
        </div>

        <div>
          <small>Current Value</small>
          <b>$0.00</b>
        </div>

      </div>

      <p class="portfolio-note">
        FINORA AI Engine will display verified portfolio performance
        once real market execution is connected.
      </p>

    </div>

    <h3 class="bo-title">Earnings History</h3>

    <div class="empty-history">

      <span>◷</span>

      <strong>No earnings yet</strong>

      <small>
        Your direct and binary earnings will appear here.
      </small>

    </div>

    <button
      class="primary full"
      onclick="signOut()"
      style="margin-top:28px;"
    >
      Sign out
    </button>
  `;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

  
function toggleBackOfficeMenu() {
  let menu = document.getElementById('backOfficeMenu');

  if (menu) {
    menu.remove();
    return;
  }

  menu = document.createElement('div');
  menu.id = 'backOfficeMenu';

  menu.style.position = 'fixed';
  menu.style.top = '0';
  menu.style.right = '0';
  menu.style.width = '290px';
  menu.style.height = '100vh';
  menu.style.zIndex = '9999';
  menu.style.background = '#080808';
  menu.style.borderLeft = '1px solid #2a2a2a';
  menu.style.boxShadow = '-20px 0 60px rgba(0,0,0,.65)';
  menu.style.padding = '28px 20px';
  menu.style.overflowY = 'auto';

  menu.innerHTML = `
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:30px;
    ">
      <div class="brand">
        <span class="mark">Z</span>
        <span>FINORA AI</span>
      </div>

      <button
        onclick="toggleBackOfficeMenu()"
        style="
          width:42px;
          height:42px;
          border:1px solid #f5c400;
          border-radius:12px;
          background:#090909;
          color:#f5c400;
          font-size:24px;
          cursor:pointer;
        "
     >☰</button>
    </div>

    <div
      class="bo-menu-item"
      onclick="toggleBackOfficeMenu()"
    >
      <strong>Dashboard</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Overview of your account
      </small>
    </div>

    <div class="bo-menu-item">
      <strong>Wallets</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Balances and transactions
      </small>
    </div>

    <div class="bo-menu-item">
      <strong>My Network</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Left and right teams
      </small>
    </div>

    <div class="bo-menu-item">
      <strong>Commissions</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Direct and binary earnings
      </small>
    </div>

    <div class="bo-menu-item">
      <strong>Referral Center</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Referral link and partners
      </small>
    </div>

    <div class="bo-menu-item">
      <strong>Investment Portfolio</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Capital and portfolio
      </small>
    </div>

    <div class="bo-menu-item">
      <strong>Earnings History</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Complete earnings history
      </small>
    </div>

    <div class="bo-menu-item">
      <strong>Profile</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Account information
      </small>
    </div>

    <div class="bo-menu-item">
      <strong>Settings</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Security and preferences
      </small>
    </div>

    <button
      onclick="signOut()"
      style="
        width:100%;
        margin-top:28px;
        padding:15px;
        border:0;
        border-radius:12px;
        background:#f5c400;
        color:#000;
        font-size:16px;
        font-weight:700;
        cursor:pointer;
      "
    >
      Sign out
    </button>
  `;

  document.body.appendChild(menu);
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
window.openLogin = openLogin;
window.openApp = openApp;
window.closeModal = closeModal;
window.handleAuth = handleAuth;
window.signOut = signOut;
(async function restoreSession() {
  const supabase = await getSupabase();

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    showWorkspace();
  }
})();
