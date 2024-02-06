/** @type {import('tailwindcss').Config} */
export default {
  content: [ // quais arquivos vao conter classes do tailwind
    "./index.html",
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [ 'Inter', 'sans-serif' ] //caso nao carregue a fonte inter, ele usa a segunda opção
      }
    },
  },
  plugins: [],
}

