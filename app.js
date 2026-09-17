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

    showPremiumWorkspace();

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
      onclick="showWorkspace(); toggleBackOfficeMenu();"
    >
      <strong>Dashboard</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Overview of your account
      </small>
    </div>

    <div class="bo-menu-item" onclick="openWallets()">
      <strong>Wallets</strong>
      <small style="display:block;color:#777;margin-top:4px;">
        Balances and transactions
      </small>
    </div>

   <div class="bo-menu-item" onclick="openMyNetwork()">
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
window.openWallets = openWallets;
function openWallets() {
  const box = document.querySelector('.modal-box');

  box.innerHTML = `
    <button class="close" onclick="closeModal()">×</button>

    <div class="brand" style="margin-bottom:30px;">
      <span class="mark">Z</span>
      <span>FINORA AI</span>
    </div>

    <h2>Wallets</h2>
    <p style="color:#888;margin-bottom:30px;">
      Manage your balances, earnings and capital.
    </p>

    <div style="display:grid;gap:16px;">

      <div style="padding:24px;border:1px solid #292929;border-radius:18px;background:#080808;">
        <small style="color:#777;">Network Earnings</small>
        <div style="font-size:32px;font-weight:700;margin-top:8px;">$0.00</div>
        <div style="color:#f5c400;margin-top:4px;">USDT</div>
      </div>

      <div style="padding:24px;border:1px solid #292929;border-radius:18px;background:#080808;">
        <small style="color:#777;">Profit Earnings</small>
        <div style="font-size:32px;font-weight:700;margin-top:8px;">$0.00</div>
        <div style="color:#f5c400;margin-top:4px;">USDT</div>
      </div>

      <div style="padding:24px;border:1px solid #292929;border-radius:18px;background:#080808;">
        <small style="color:#777;">Total Earnings</small>
        <div style="font-size:32px;font-weight:700;margin-top:8px;">$0.00</div>
        <div style="color:#f5c400;margin-top:4px;">USDT</div>
      </div>

      <div style="padding:24px;border:1px solid #292929;border-radius:18px;background:#080808;">
        <small style="color:#777;">Invested Capital</small>
        <div style="font-size:32px;font-weight:700;margin-top:8px;">$0.00</div>
        <div style="color:#f5c400;margin-top:4px;">USDT</div>
      </div>

    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:24px;">

      <button onclick="alert('Withdrawals will be available soon.')" style="padding:14px;border:1px solid #f5c400;border-radius:12px;background:#f5c400;color:#000;font-weight:700;">
        Withdraw
      </button>

      <button onclick="alert('Transfers will be available soon.')" style="padding:14px;border:1px solid #f5c400;border-radius:12px;background:#090909;color:#f5c400;font-weight:700;">
        Transfer
      </button>

      <button onclick="alert('Transaction history will be available soon.')" style="padding:14px;border:1px solid #f5c400;border-radius:12px;background:#090909;color:#f5c400;font-weight:700;">
        History
      </button>

    </div>

    <h3 style="margin-top:36px;">Withdrawal History</h3>

    <div style="padding:24px;border:1px solid #292929;border-radius:18px;background:#080808;color:#777;text-align:center;">
      No withdrawals yet.
    </div>
  `;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}
(async function restoreSession() {
  const supabase = await getSupabase();

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    showWorkspace();
  }
})();function openMyNetwork() {
  const oldMenu = document.getElementById('my-network-fullscreen');
  if (oldMenu) oldMenu.remove();

  const modal = document.createElement('div');
  modal.id = 'my-network-fullscreen';

  modal.innerHTML = `
    <div class="mn-overlay">

      <div class="mn-header">
        <div class="mn-brand">
          <div class="mn-logo">Z</div>
          <div>
            <strong>FINORA AI</strong>
            <span>MY NETWORK</span>
          </div>
        </div>

        <button class="mn-close" onclick="document.getElementById('my-network-fullscreen').remove()">
          ×
        </button>
      </div>

      <div class="mn-content">

        <div class="mn-title">
          <span>NETWORK</span>
          <h1>My Network</h1>
          <p>Your binary network structure</p>
        </div>

        <div class="mn-stats">

          <div class="mn-stat">
            <span>Total Partners</span>
            <strong>0</strong>
            <small>Network members</small>
          </div>

          <div class="mn-stat">
            <span>Left Team</span>
            <strong>0</strong>
            <small>Partners</small>
          </div>

          <div class="mn-stat">
            <span>Right Team</span>
            <strong>0</strong>
            <small>Partners</small>
          </div>

          <div class="mn-stat">
            <span>Active Partners</span>
            <strong>0</strong>
            <small>Currently active</small>
          </div>

        </div>

        <div class="mn-binary">

          <div class="mn-side">
            <div class="mn-side-title">
              <span>LEFT TEAM</span>
              <strong>$0.00</strong>
              <small>Volume</small>
            </div>

            <div class="mn-levels">
              <div class="mn-node">
                <span>L1</span>
                <strong>0</strong>
                <small>Partners</small>
              </div>

              <div class="mn-node">
                <span>L2</span>
                <strong>0</strong>
                <small>Partners</small>
              </div>
            </div>
          </div>

          <div class="mn-center">
            <div class="mn-you">YOU</div>
            <strong>Binary Network</strong>
            <span>Your position</span>
          </div>

          <div class="mn-side">
            <div class="mn-side-title">
              <span>RIGHT TEAM</span>
              <strong>$0.00</strong>
              <small>Volume</small>
            </div>

            <div class="mn-levels">
              <div class="mn-node">
                <span>R1</span>
                <strong>0</strong>
                <small>Partners</small>
              </div>

              <div class="mn-node">
                <span>R2</span>
                <strong>0</strong>
                <small>Partners</small>
              </div>
            </div>
          </div>

        </div>

        <div class="mn-bottom">

          <div class="mn-info">
            <span>LEFT VOLUME</span>
            <strong>$0.00 USDT</strong>
          </div>

          <div class="mn-info">
            <span>RIGHT VOLUME</span>
            <strong>$0.00 USDT</strong>
          </div>

          <div class="mn-info">
            <span>NETWORK EARNINGS</span>
            <strong>$0.00 USDT</strong>
          </div>

        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const style = document.createElement('style');
  style.id = 'my-network-professional-style';

  style.textContent = `
    #my-network-fullscreen {
      position: fixed;
      inset: 0;
      z-index: 999999;
    }

    #my-network-fullscreen * {
      box-sizing: border-box;
    }

    .mn-overlay {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100dvh;
      overflow-y: auto;
      overflow-x: hidden;
      background:
        radial-gradient(circle at 80% 5%, rgba(245,196,0,.12), transparent 28%),
        radial-gradient(circle at 15% 40%, rgba(245,196,0,.06), transparent 25%),
        #030303;
      color: #f5f5f5;
      font-family: Inter, Arial, sans-serif;
      -webkit-overflow-scrolling: touch;
    }

    .mn-header {
      position: sticky;
      top: 0;
      z-index: 20;
      min-height: 76px;
      padding: 16px 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(3,3,3,.92);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid #222;
    }

    .mn-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .mn-logo {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #f5c400;
      border-radius: 13px;
      color: #f5c400;
      font-size: 22px;
      font-weight: 800;
    }

    .mn-brand strong {
      display: block;
      font-size: 15px;
      letter-spacing: 2px;
    }

    .mn-brand span {
      display: block;
      margin-top: 3px;
      color: #777;
      font-size: 10px;
      letter-spacing: 2px;
    }

    .mn-close {
      width: 42px;
      height: 42px;
      border: 1px solid #333;
      border-radius: 12px;
      background: #0b0b0b;
      color: #aaa;
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
    }

    .mn-content {
      width: min(1180px, 100%);
      margin: 0 auto;
      padding: 36px 22px 70px;
    }

    .mn-title {
      margin-bottom: 28px;
    }

    .mn-title span {
      color: #f5c400;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 3px;
    }

    .mn-title h1 {
      margin: 7px 0 5px;
      font-size: clamp(32px, 6vw, 52px);
      letter-spacing: -1.5px;
    }

    .mn-title p {
      margin: 0;
      color: #777;
      font-size: 15px;
    }

    .mn-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 18px;
    }

    .mn-stat,
    .mn-side,
    .mn-info {
      background: linear-gradient(145deg,#101010,#070707);
      border: 1px solid #252525;
      border-radius: 18px;
      box-shadow: 0 12px 35px rgba(0,0,0,.35);
    }

    .mn-stat {
      padding: 20px;
    }

    .mn-stat span,
    .mn-info span {
      display: block;
      color: #777;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .mn-stat strong {
      display: block;
      margin: 9px 0 3px;
      color: #f5c400;
      font-size: 30px;
    }

    .mn-stat small,
    .mn-info small {
      color: #555;
    }

    .mn-binary {
      display: grid;
      grid-template-columns: 1fr 150px 1fr;
      gap: 16px;
      align-items: stretch;
      margin-top: 18px;
    }

    .mn-side {
      padding: 22px;
    }

    .mn-side-title {
      padding-bottom: 18px;
      border-bottom: 1px solid #222;
    }

    .mn-side-title span {
      display: block;
      color: #888;
      font-size: 11px;
      letter-spacing: 2px;
    }

    .mn-side-title strong {
      display: block;
      margin-top: 8px;
      color: #f5c400;
      font-size: 25px;
    }

    .mn-side-title small {
      color: #555;
    }

    .mn-levels {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 18px;
    }

    .mn-node {
      padding: 18px 12px;
      text-align: center;
      border: 1px solid #242424;
      border-radius: 14px;
      background: #080808;
    }

    .mn-node span {
      color: #777;
      font-size: 11px;
      font-weight: 700;
    }

    .mn-node strong {
      display: block;
      margin: 6px 0;
      font-size: 25px;
    }

    .mn-node small {
      color: #555;
      font-size: 10px;
    }

    .mn-center {
      min-height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .mn-you {
      width: 82px;
      height: 82px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      border: 2px solid #f5c400;
      border-radius: 50%;
      color: #f5c400;
      font-size: 18px;
      font-weight: 800;
      background: radial-gradient(circle,#211b00,#080808);
      box-shadow: 0 0 35px rgba(245,196,0,.15);
    }

    .mn-center strong {
      font-size: 13px;
    }

    .mn-center span {
      margin-top: 5px;
      color: #666;
      font-size: 10px;
    }

    .mn-bottom {
      display: grid;
      grid-template-columns: repeat(3,1fr);
      gap: 14px;
      margin-top: 18px;
    }

    .mn-info {
      padding: 20px;
    }

    .mn-info strong {
      display: block;
      margin-top: 8px;
      color: #f5c400;
      font-size: 21px;
    }

    @media (max-width: 760px) {
      .mn-content {
        padding: 26px 15px 55px;
      }

      .mn-header {
        padding: 13px 15px;
      }

      .mn-stats {
        grid-template-columns: 1fr 1fr;
      }

      .mn-binary {
        grid-template-columns: 1fr;
      }

      .mn-center {
        order: -1;
        min-height: 150px;
      }

      .mn-bottom {
        grid-template-columns: 1fr;
      }

      .mn-side {
        padding: 18px;
      }
    }

    @media (max-width: 430px) {
      .mn-stats {
        gap: 9px;
      }

      .mn-stat {
        padding: 15px;
      }

      .mn-stat strong {
        font-size: 25px;
      }

      .mn-levels {
        grid-template-columns: 1fr 1fr;
      }

      .mn-title h1 {
        font-size: 34px;
      }
    }
  `;

  const oldStyle = document.getElementById('my-network-professional-style');
  if (oldStyle) oldStyle.remove();

  document.head.appendChild(style);

  document.body.style.overflow = 'hidden';

  modal.querySelector('.mn-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      modal.remove();
      document.body.style.overflow = '';
    }
  });
}

window.openMyNetwork = openMyNetwork;
function showPremiumWorkspace() {
  showWorkspace();

  const box = document.querySelector('.modal-box');
  if (!box) return;

  const style = document.createElement('style');
  style.id = 'finora-premium-style';

  style.textContent = `
    .finora-premium {
      background:
        radial-gradient(circle at 85% 5%, rgba(245,196,0,.12), transparent 28%),
        linear-gradient(180deg,#050505 0%,#090909 100%);
      color:#fff;
      min-height:100vh;
      padding:22px 18px 100px;
      font-family:Inter,Arial,sans-serif;
    }

    .fp-top {
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom:24px;
    }

    .fp-brand {
      display:flex;
      align-items:center;
      gap:10px;
      font-weight:800;
      letter-spacing:.5px;
      font-size:20px;
    }

    .fp-logo {
      width:38px;
      height:38px;
      border-radius:12px;
      display:grid;
      place-items:center;
      background:linear-gradient(145deg,#f5c400,#8f7000);
      color:#050505;
      font-weight:900;
      box-shadow:0 8px 25px rgba(245,196,0,.22);
    }

    .fp-icon {
      width:40px;
      height:40px;
      border:1px solid #292929;
      border-radius:12px;
      background:#101010;
      display:grid;
      place-items:center;
      color:#f5c400;
      font-size:18px;
    }

    .fp-welcome {
      color:#858585;
      font-size:13px;
      margin-bottom:4px;
    }

    .fp-title {
      font-size:25px;
      font-weight:800;
      margin:0 0 20px;
    }

    .fp-balance {
      position:relative;
      overflow:hidden;
      padding:24px;
      border-radius:24px;
      background:
        radial-gradient(circle at 90% 10%,rgba(245,196,0,.20),transparent 32%),
        linear-gradient(135deg,#171717,#090909);
      border:1px solid rgba(245,196,0,.30);
      box-shadow:0 18px 45px rgba(0,0,0,.45);
      margin-bottom:14px;
    }

    .fp-label {
      color:#999;
      font-size:13px;
    }

    .fp-value {
      font-size:36px;
      font-weight:850;
      margin:8px 0 5px;
      letter-spacing:-1px;
    }

    .fp-unit {
      color:#f5c400;
      font-size:12px;
      font-weight:700;
    }

    .fp-glow {
      position:absolute;
      width:150px;
      height:150px;
      border-radius:50%;
      background:rgba(245,196,0,.08);
      filter:blur(25px);
      right:-40px;
      bottom:-60px;
    }

    .fp-metrics {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
      margin-bottom:18px;
    }

    .fp-metric {
      padding:17px;
      border-radius:18px;
      background:#0d0d0d;
      border:1px solid #222;
    }

    .fp-metric span {
      display:block;
      color:#777;
      font-size:11px;
      margin-bottom:7px;
    }

    .fp-metric strong {
      font-size:18px;
    }

    .fp-section {
      margin-top:22px;
      margin-bottom:10px;
      font-size:16px;
      font-weight:800;
    }

    .fp-chart {
      background:#0c0c0c;
      border:1px solid #222;
      border-radius:22px;
      padding:18px;
      overflow:hidden;
    }

    .fp-chart-head {
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:15px;
    }

    .fp-chart-head strong {
      font-size:15px;
    }

    .fp-periods {
      display:flex;
      gap:5px;
    }

    .fp-periods button {
      border:1px solid #292929;
      background:#111;
      color:#777;
      border-radius:8px;
      padding:6px 8px;
      font-size:10px;
    }

    .fp-periods button.active {
      background:#f5c400;
      color:#050505;
      border-color:#f5c400;
      font-weight:800;
    }

    .fp-chart svg {
      width:100%;
      height:150px;
      display:block;
    }

    .fp-actions {
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:8px;
    }

    .fp-action {
      border:1px solid #272727;
      background:#101010;
      border-radius:16px;
      padding:13px 5px;
      text-align:center;
      color:#ddd;
      font-size:10px;
    }

    .fp-action b {
      display:block;
      color:#f5c400;
      font-size:18px;
      margin-bottom:5px;
    }

    .fp-market {
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:8px;
    }

    .fp-coin {
      background:#0d0d0d;
      border:1px solid #222;
      border-radius:16px;
      padding:13px;
    }

    .fp-coin small {
      color:#777;
      display:block;
      margin-bottom:5px;
    }

    .fp-coin strong {
      font-size:13px;
    }

    .fp-change {
      color:#52d273;
      font-size:10px;
      margin-top:4px;
    }

    .fp-banner {
      margin-top:18px;
      padding:19px;
      border-radius:20px;
      border:1px solid rgba(245,196,0,.25);
      background:linear-gradient(135deg,#15120a,#0b0b0b);
    }

    .fp-banner b {
      display:block;
      color:#f5c400;
      font-size:13px;
      margin-bottom:5px;
    }

    .fp-banner span {
      color:#aaa;
      font-size:11px;
    }
  `;

  document.head.appendChild(style);

  const premium = document.createElement('div');
  premium.className = 'finora-premium';

  premium.innerHTML = `
    <div class="fp-top">
      <div class="fp-brand">
        <div class="fp-logo">F</div>
        <span>FINORA</span>
      </div>
      <div class="fp-icon">⌁</div>
    </div>

    <div class="fp-welcome">Welcome back,</div>
    <h1 class="fp-title">FINORA User 👋</h1>

    <div class="fp-balance">
      <div class="fp-label">Total Balance</div>
      <div class="fp-value">$0.00</div>
      <div class="fp-unit">USDT</div>
      <div class="fp-glow"></div>
    </div>

    <div class="fp-metrics">
      <div class="fp-metric">
        <span>INVESTED CAPITAL</span>
        <strong>$0.00</strong>
      </div>
      <div class="fp-metric">
        <span>TOTAL EARNINGS</span>
        <strong>$0.00</strong>
      </div>
      <div class="fp-metric">
        <span>AVAILABLE</span>
        <strong>$0.00</strong>
      </div>
      <div class="fp-metric">
        <span>STATUS</span>
        <strong style="color:#f5c400">ACTIVE</strong>
      </div>
    </div>

    <div class="fp-section">Portfolio Performance</div>

    <div class="fp-chart">
      <div class="fp-chart-head">
        <strong>Performance</strong>
        <div class="fp-periods">
          <button class="active">7D</button>
          <button>30D</button>
          <button>90D</button>
          <button>1Y</button>
        </div>
      </div>

      <svg viewBox="0 0 400 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fpGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f5c400" stop-opacity=".35"/>
            <stop offset="100%" stop-color="#f5c400" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <path d="M0 125 H400 M0 92 H400 M0 59 H400 M0 26 H400"
              stroke="#202020" stroke-width="1"/>

        <path d="M0 125 L45 123 L85 124 L125 121 L165 123 L205 120 L245 122 L285 119 L325 121 L365 118 L400 120 L400 150 L0 150 Z"
              fill="url(#fpGold)"/>

        <path d="M0 125 L45 123 L85 124 L125 121 L165 123 L205 120 L245 122 L285 119 L325 121 L365 118 L400 120"
              fill="none"
              stroke="#f5c400"
              stroke-width="3"
              stroke-linecap="round"/>
      </svg>

      <div style="text-align:center;color:#666;font-size:10px;margin-top:5px;">
        No portfolio performance data yet
      </div>
    </div>

    <div class="fp-section">Quick Actions</div>

    <div class="fp-actions">
      <div class="fp-action"><b>＋</b>Deposit</div>
      <div class="fp-action"><b>↗</b>Withdraw</div>
      <div class="fp-action"><b>⇄</b>Transfer</div>
      <div class="fp-action"><b>≡</b>History</div>
    </div>

    <div class="fp-section">Markets</div>

    <div class="fp-market">
      <div class="fp-coin">
        <small>BTC</small>
        <strong>—</strong>
        <div class="fp-change">Live</div>
      </div>

      <div class="fp-coin">
        <small>ETH</small>
        <strong>—</strong>
        <div class="fp-change">Live</div>
      </div>

      <div class="fp-coin">
        <small>USDT</small>
        <strong>$1.00</strong>
        <div class="fp-change">USD</div>
      </div>
    </div>

    <div class="fp-banner">
      <b>FINORA AI ENGINE</b>
      <span>Intelligent technology built for the next generation of digital finance.</span>
    </div>
  `;

  box.innerHTML = '';
  box.appendChild(premium);
}
