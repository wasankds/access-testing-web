console.log("2. Hello from script2.js!");
document.addEventListener('DOMContentLoaded', () => {
  console.log('2. script2.js loaded and DOM is ready!');
});


// npx esbuild public/js/script.js public/js/script2.js --bundle --minify --outdir=public/js-min