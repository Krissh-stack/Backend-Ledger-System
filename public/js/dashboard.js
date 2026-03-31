// public/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Fetch ---
    fetchAccounts();

    // --- Logout Handle ---
    document.getElementById('logout-btn').addEventListener('click', async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (err) { console.error(err); }
    });

    // --- Modal Handle ---
    const modal = document.getElementById('account-modal');
    document.getElementById('add-account-btn').addEventListener('click', () => {
        modal.classList.remove('hidden');
    });
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // --- Create Account ---
    document.getElementById('create-account-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const accountName = document.getElementById('acc-name').value;
        
        try {
            const res = await fetch('/api/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountName })
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message || "Failed to create account");
            
            showToast("Account created successfully", "success");
            modal.classList.add('hidden');
            document.getElementById('acc-name') ? document.getElementById('acc-name').value = '' : null;
            fetchAccounts();
        } catch(err) {
            showToast(err.message, "error");
        }
    });

    // --- Create Transaction ---
    document.getElementById('transaction-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fromAccountId = document.getElementById('tx-from').value;
        const toAccountId = document.getElementById('tx-to').value;
        const amount = document.getElementById('tx-amount').value;
        
        try {
            const btn = e.target.querySelector('button');
            const orig = btn.innerHTML;
            btn.innerHTML = "Processing..."; btn.disabled = true;

            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromAccountId, toAccountId, amount })
            });
            const data = await res.json();
            
            btn.innerHTML = orig; btn.disabled = false;
            if(!res.ok) throw new Error(data.message || "Transaction Failed");

            showToast("Transfer successful!", "success");
            document.getElementById('tx-amount').value = '';
            fetchAccounts(); // Update balances
        } catch(err) {
            showToast(err.message, "error");
        }
    });

    // --- Initial System Funds Request ---
    document.getElementById('initial-funds-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const accountId = document.getElementById('fund-target').value;
        const amount = document.getElementById('fund-amount').value;
        
        try {
            const btn = e.target.querySelector('button');
            const orig = btn.innerHTML;
            btn.innerHTML = "Processing..."; btn.disabled = true;

            // Notice we call the system/initial-funds route
            const res = await fetch('/api/transactions/system/initial-funds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId, amount })
            });
            const data = await res.json();
            
            btn.innerHTML = orig; btn.disabled = false;
            
            if(!res.ok) throw new Error(data.message || "Funding Failed");

            showToast("System funds added to account!", "success");
            document.getElementById('fund-amount').value = '';
            fetchAccounts();
        } catch(err) {
            showToast(err.message, "error");
        }
    });
});

async function fetchAccounts() {
    try {
        const res = await fetch('/api/accounts');
        if(res.status === 401 || res.status === 403) {
            // Unauthenticated
            window.location.href = '/';
            return;
        }

        const data = await res.json();
        let accounts = data.accounts || [];

        // Fetch balances for each account
        let totalSystemBalance = 0;
        accounts = await Promise.all(accounts.map(async acc => {
            try {
                const balRes = await fetch(`/api/accounts/balance/${acc._id}`);
                const balData = await balRes.json();
                acc.balance = balData.balance || 0;
                totalSystemBalance += (balData.balance || 0);
            } catch (e) {
                acc.balance = 0;
            }
            return acc;
        }));

        document.getElementById('total-balance-display').innerText = totalSystemBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

        renderAccounts(accounts);
        populateDropdowns(accounts);

    } catch(err) {
        showToast("Error loading accounts", "error");
        console.error(err);
    }
}

function renderAccounts(accounts) {
    const container = document.getElementById('accounts-list');
    
    if (accounts.length === 0) {
        container.innerHTML = `<div class="w-full text-center p-6 border-2 border-dashed border-[#3c4043] rounded-2xl text-[#9aa0a6] font-medium bg-[#202124]">No accounts found. Create one above.<br/><span class="text-xs">Don't forget to request initial system funds after!</span></div>`;
        return;
    }

    container.innerHTML = accounts.map(acc => `
        <div class="min-w-[200px] w-[200px] bg-gpay-blue rounded-3xl p-5 shadow-sm text-white flex-shrink-0 relative overflow-hidden ring-1 ring-blue-500">
            <!-- decorative gradient -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-xl -mr-10 -mt-10 opacity-20 hidden md:block"></div>
            
            <div class="flex flex-col h-full justify-between relative z-10 gap-6">
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <div class="text-[10px] uppercase font-bold text-blue-200 tracking-widest">${acc.currency}</div>
                        <i class="fa-solid fa-building-columns text-blue-200"></i>
                    </div>
                    <div class="text-base font-bold">Account ${acc._id.slice(-4)}</div>
                </div>
                <div>
                    <div class="text-[10px] text-blue-200 uppercase tracking-widest font-semibold mb-0.5">Balance</div>
                    <div class="text-2xl font-bold tracking-tight">₹${parseFloat(acc.balance).toLocaleString()}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function populateDropdowns(accounts) {
    const txFrom = document.getElementById('tx-from');
    const txTo = document.getElementById('tx-to');
    const fundTarget = document.getElementById('fund-target');

    const opts = accounts.map(a => `<option value="${a._id}">Account ${a._id.slice(-4)} (₹${a.balance})</option>`).join('');

    txFrom.innerHTML = `<option value="" disabled selected>Select Source Account</option>${opts}`;
    txTo.innerHTML = `<option value="" disabled selected>Select Destination Account</option>${opts}`;
    
    // Add external system back to txTo if needed but the backend only supports P2P. 
    // Wait, the API usually expects 2 real users for standard transactions. 
    // We have a separate initial-funds form.

    fundTarget.innerHTML = `<option value="" disabled selected>Select Account to Fund</option>${opts}`;
}

// Toast functionality
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    let icon = '';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check text-green-400"></i>';
    else if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation text-red-400"></i>';
    else if (type === 'info') icon = '<i class="fa-solid fa-circle-info text-blue-400"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    // Maintain tailwind classes + show
    toast.className = `toast show ${type} fixed bottom-24 md:bottom-10 left-1/2 transform -translate-x-1/2 bg-[#e8eaed] text-[#202124] px-6 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.8)] font-semibold text-sm flex items-center gap-2 z-[60] transition-all`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
