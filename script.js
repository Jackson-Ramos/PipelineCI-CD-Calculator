(function () {
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    const toast = document.getElementById('toast');

    const State = { a: '0', b: null, op: null, justEvaluated: false };

    const parse = s => Number(String(s).replace(/\./g, '').replace(',', '.'));
    const toStr = num => String(num).replace('.', ',');
    const render = () => {
        const cur = State.b ?? State.a;
        display.textContent = cur || '0';
        history.textContent = [State.a, State.op || '', (State.justEvaluated ? '' : State.b || '')].join(' ');
    };

    const inputDigit = d => {
        if (State.op) { State.b = (State.b ?? '') + d; }
        else { State.a = (State.a === '0') ? d : (State.a + d); }
        State.justEvaluated = false;
        render();
    };
    const inputDecimal = () => {
        const key = State.op ? 'b' : 'a';
        if (!String(State[key] || '').includes(',')) State[key] = (State[key] || '0') + ',';
        render();
    };
    const setOperator = op => { if (State.b != null) evaluate(); State.op = op; State.justEvaluated = false; render(); };
    const evaluate = () => {
        if (!State.op || State.b == null) return;
        const result = compute(State.a, State.op, State.b);
        State.a = toStr(result); State.b = null; State.op = null; State.justEvaluated = true; render();
    };
    const compute = (a, op, b) => {
        const x = parse(a), y = parse(b);
        switch (op) { case '+': return x + y; case '-': return x - y; case '*': return x * y; case '/': return y === 0 ? Infinity : x / y; }
    };
    const clearAll = () => { State.a = '0'; State.b = null; State.op = null; render(); };
    const clearEntry = () => { if (State.op && State.b) State.b = '0'; else State.a = '0'; render(); };
    const backspace = () => { const k = State.op ? 'b' : 'a'; State[k] = String(State[k]).slice(0, -1) || '0'; render(); };
    const percent = () => { if (State.op && State.b) State.b = toStr(parse(State.a) * (parse(State.b) / 100)); else State.a = toStr(parse(State.a) / 100); render(); };
    const toggleSign = () => { const k = State.op ? 'b' : 'a'; if (State[k].startsWith('-')) State[k] = State[k].slice(1); else if (State[k] !== '0') State[k] = '-' + State[k]; render(); };
    const copyResult = () => { navigator.clipboard.writeText(String(parse(State.a))).then(() => cueToast('Resultado copiado!')); };
    const cueToast = msg => { toast.textContent = msg; setTimeout(() => toast.textContent = '', 2000); };

    // Eventos
    document.querySelectorAll('[data-num]').forEach(btn => btn.addEventListener('click', () => inputDigit(btn.textContent)));
    document.querySelectorAll('[data-op]').forEach(btn => btn.addEventListener('click', () => setOperator(btn.getAttribute('data-op'))));
    document.querySelector('[data-action="decimal"]').addEventListener('click', inputDecimal);
    document.querySelector('[data-action="percent"]').addEventListener('click', percent);
    document.querySelector('[data-action="equals"]').addEventListener('click', evaluate);
    document.querySelector('[data-action="backspace"]').addEventListener('click', backspace);
    document.querySelector('[data-action="clear-entry"]').addEventListener('click', clearEntry);
    document.querySelector('[data-action="clear-all"]').addEventListener('click', clearAll);
    document.querySelector('[data-action="sign"]').addEventListener('click', toggleSign);
    document.querySelector('[data-action="copy"]').addEventListener('click', copyResult);

    // Teclado
    window.addEventListener('keydown', e => {
        const k = e.key;
        if (/^[0-9]$/.test(k)) inputDigit(k);
        if (k === '.' || k === ',') inputDecimal();
        if (['+', '-', '*', '/'].includes(k)) setOperator(k);
        if (k === 'Enter' || k === '=') evaluate();
        if (k === 'Backspace') backspace();
        if (k === '%') percent();
    });

    render();
})();
