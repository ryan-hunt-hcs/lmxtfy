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
  const sendPerplexity = document.querySelector('#send-perplexity');

  const encodedPrompt = () => location.hash.startsWith('#ask=') ? location.hash.slice(5) : '';
  const readPrompt = () => {
    try { return decodeURIComponent(encodedPrompt()); } catch { return ''; }
  };
  const makeLink = (prompt) => `${location.origin}${location.pathname}#ask=${encodeURIComponent(prompt)}`;
  const makePerplexityLink = (prompt) => `https://www.perplexity.ai/search/?q=${encodeURIComponent(prompt)}`;

  function copyText(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const helper = document.createElement('textarea');
    helper.value = text; document.body.append(helper); helper.select(); document.execCommand('copy'); helper.remove();
    return Promise.resolve();
  }

  function showCreator() { creator.hidden = false; share.hidden = true; viewer.hidden = true; }
  function showShare(prompt) { creator.hidden = true; share.hidden = false; viewer.hidden = true; shareLink.value = makeLink(prompt); }

  const randomBetween = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

  function typingDelay(character, reducedMotion) {
    if (reducedMotion) return 0;
    // A steady-but-imperfect rhythm feels more like a person composing a question.
    if (character === ' ' || character === '\n') return randomBetween(105, 230);
    if (/[,.!?;:]/.test(character)) return randomBetween(220, 500);
    if (Math.random() < 0.07) return randomBetween(280, 680);
    return randomBetween(42, 96);
  }

  async function playPrompt(prompt) {
    creator.hidden = true; share.hidden = true; viewer.hidden = false;
    typedPrompt.textContent = ''; thinking.hidden = true; submitted.hidden = true; viewerActions.hidden = true; cursor.hidden = false;
    sendPerplexity.href = makePerplexityLink(prompt);
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    viewerStatus.textContent = 'Thinking of a good question…';
    await wait(reducedMotion ? 0 : randomBetween(450, 900));
    viewerStatus.textContent = 'Typing it out…';
    for (const character of prompt) {
      typedPrompt.textContent += character;
      await wait(typingDelay(character, reducedMotion));
    }
    cursor.hidden = true;
    viewerStatus.textContent = 'Sending this straight to AI…';
    thinking.hidden = false;
    await wait(reducedMotion ? 0 : randomBetween(900, 1400));
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
