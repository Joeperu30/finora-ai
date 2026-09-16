const modal=document.getElementById('modal');
function openLogin(){modal.classList.add('show');modal.setAttribute('aria-hidden','false')}
function openApp(){openLogin()}
function closeModal(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}
function showWorkspace(){
  const box=document.querySelector('.modal-box');
  box.innerHTML=`<button class="close" onclick="closeModal()">×</button>
  <div class="brand"><span class="mark">Z</span><span>FINORA AI</span></div>
  <h2>Workspace ready.</h2>
  <p>The frontend MVP is working. Next we connect Supabase authentication, the real AI API and live market data.</p>
  <div style="border:1px solid #1d2820;border-radius:10px;padding:16px;color:#8c988f;font-size:13px;line-height:1.7">
  ✓ Premium landing<br>✓ Responsive design<br>✓ Product navigation<br>✓ Pricing structure<br>→ Next: real authentication + AI
  </div>`;
}
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
