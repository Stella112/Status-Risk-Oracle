async function executePipeline() {
    const btn = document.getElementById('launch-btn');
    btn.disabled = true;
    btn.querySelector('.btn-text').innerText = "Pipeline Executing...";
    
    document.getElementById('global-status').innerText = "System Active";
    document.getElementById('global-indicator').classList.add('active');
    document.getElementById('final-proof').classList.add('hidden');

    // Reset UI
    ['venice', 'filecoin', 'ens', 'status'].forEach(step => {
        document.getElementById(`step-${step}`).className = 'step-card glass';
        document.getElementById(`out-${step}`).classList.add('output-hidden');
        document.getElementById(`out-${step}`).innerText = '';
        document.querySelector(`#step-${step} .loader`).classList.add('hidden');
    });

    try {
        const response = await fetch('/api/run-agent', { method: 'POST' });
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            
            let boundary = buffer.indexOf('\n\n');
            while (boundary !== -1) {
                const chunk = buffer.slice(0, boundary);
                buffer = buffer.slice(boundary + 2);
                
                if (chunk.startsWith('data: ')) {
                    const data = JSON.parse(chunk.replace('data: ', ''));
                    handleEvent(data);
                }
                boundary = buffer.indexOf('\n\n');
            }
        }
    } catch (err) {
        console.error("Connection failed", err);
        document.getElementById('global-status').innerText = "Pipeline Failed";
        document.getElementById('global-indicator').classList.remove('active');
        btn.disabled = false;
        btn.querySelector('.btn-text').innerText = "Execute Autonomous Pipeline";
    }
}

document.getElementById('launch-btn').addEventListener('click', executePipeline);

window.addEventListener('load', () => {
    setTimeout(executePipeline, 500);
});

function handleEvent({ step, message, data }) {
    const activateStep = (id) => {
        document.getElementById(`step-${id}`).classList.add('active');
        document.querySelector(`#step-${id} .loader`).classList.remove('hidden');
    };
    
    const completeStep = (id, out) => {
        document.getElementById(`step-${id}`).classList.remove('active');
        document.getElementById(`step-${id}`).classList.add('done');
        document.querySelector(`#step-${id} .loader`).classList.add('hidden');
        const term = document.getElementById(`out-${id}`);
        term.classList.remove('output-hidden');
        term.innerText = out;
    };

    if (step === 'venice_start') activateStep('venice');
    if (step === 'venice_done') completeStep('venice', `> ${message}`);

    if (step === 'filecoin_start') activateStep('filecoin');
    if (step === 'filecoin_done') {
        completeStep('filecoin', `> Pinned to IPFS\n> CID: ${data}`);
        document.getElementById('ipfs-cid').innerText = data;
    }

    if (step === 'ens_start') activateStep('ens');
    if (step === 'ens_done') completeStep('ens', `> Target: ${data}`);

    if (step === 'status_start') activateStep('status');
    if (step === 'status_pending') {
        const term = document.getElementById('out-status');
        term.classList.remove('output-hidden');
        term.innerText = `> ${message}\n> Waiting for confirmations...`;
    }
    if (step === 'status_done') {
        completeStep('status', `> Block Mined: ${data.blockNumber}\n> Gas Used: ${data.gasUsed}\n> Gas Price: 0 ETH\n> Hash: ${data.hash}`);
        document.getElementById('tx-hash').innerText = data.hash;
        document.getElementById('tx-hash').href = `https://sepoliascan.status.network/tx/${data.hash}`;
        
        document.getElementById('final-proof').classList.remove('hidden');
        document.getElementById('global-status').innerText = "Pipeline Complete";
        document.getElementById('global-indicator').classList.remove('active');
        
        const btn = document.getElementById('launch-btn');
        btn.disabled = false;
        btn.querySelector('.btn-text').innerText = "Execute Again";
    }

    if (step === 'error') {
        alert(message);
        document.getElementById('global-status').innerText = "Pipeline Error";
        document.getElementById('global-indicator').style.background = 'red';
    }
}
