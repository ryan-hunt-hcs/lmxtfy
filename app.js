(function () {
  const creator = document.querySelector('#creator');
  const share = document.querySelector('#share');
  const viewer = document.querySelector('#viewer');
  const form = document.querySelector('#prompt-form');
  const promptInput = document.querySelector('#prompt');
  const counter = document.querySelector('#counter');
  const shareLink = document.querySelector('#share-link');
  const copyButton = document.querySelector('#copy-button');
  const typedPrompt = document.querySelector('#typed-prompt');
  const viewerStatus = document.querySelector('#viewer-status');
  const thinking = document.querySelector('#thinking');
  const submitted = document.querySelector('#submitted');
  const cursor = document.querySelector('#cursor');
  const viewerActions = document.querySelector('#viewer-actions');

  const encodedPrompt = () => location.hash.startsWith('#ask=') ? location.hash.slice(5) : '';
  const readPrompt = () => {
    try { return decodeURIComponent(encodedPrompt()); } catch { return ''; }
  };
  const makeLink = (prompt) => `${location.origin}${location.pathname}#ask=${encodeURIComponent(prompt)}`;

  function copyText(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const helper = document.createElement('textarea');
    helper.value = text; document.body.append(helper); helper.select(); document.execCommand('copy'); helper.remove();
    return Promise.resolve();
  }

  function showCreator() { creator.hidden = false; share.hidden = true; viewer.hidden = true; }
  function showShare(prompt) { creator.hidden = true; share.hidden = false; viewer.hidden = true; shareLink.value = makeLink(prompt); }

  async function playPrompt(prompt) {
    creator.hidden = true; share.hidden = true; viewer.hidden = false;
    typedPrompt.textContent = ''; thinking.hidden = true; submitted.hidden = true; viewerActions.hidden = true; cursor.hidden = false;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = reducedMotion ? 0 : Math.max(14, Math.min(34, 1150 / Math.max(prompt.length, 1)));
    for (const character of prompt) {
      typedPrompt.textContent += character;
      if (speed) await new Promise(resolve => setTimeout(resolve, speed));
    }
    cursor.hidden = true;
    viewerStatus.textContent = 'Sending this straight to AI…';
    thinking.hidden = false;
    await new Promise(resolve => setTimeout(resolve, reducedMotion ? 0 : 1050));
    thinking.hidden = true; submitted.hidden = false; viewerActions.hidden = false;
    viewerStatus.textContent = 'Mission accomplished.';
  }

  promptInput.addEventListener('input', () => { counter.textContent = `${promptInput.value.length} / 800`; });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    showShare(prompt);
  });
  copyButton.addEventListener('click', async () => {
    await copyText(shareLink.value);
    copyButton.textContent = 'Copied!';
    setTimeout(() => { copyButton.textContent = 'Copy link'; }, 1600);
  });
  document.querySelector('#make-another').addEventListener('click', showCreator);
  document.querySelector('#copy-prompt').addEventListener('click', async (event) => {
    await copyText(readPrompt());
    event.currentTarget.textContent = 'Copied!';
    setTimeout(() => { event.currentTarget.textContent = 'Copy the question'; }, 1600);
  });

  const receivedPrompt = readPrompt();
  if (receivedPrompt) playPrompt(receivedPrompt); else showCreator();
}());
