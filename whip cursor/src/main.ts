import './style.css';
import { WhipApp } from './app';

const root = document.querySelector<HTMLDivElement>('#app');
if (!root) {
  throw new Error('#app root missing');
}

const app = new WhipApp(root);
try {
  app.start();
} catch {
  root.classList.add('whip-app');
  root.innerHTML =
    '<div class="capability-fallback"><h1>WHIP</h1><p>The whip could not start in this browser.</p></div>';
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    app.dispose();
  });
}
