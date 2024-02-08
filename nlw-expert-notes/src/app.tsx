import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string,
  date: Date,
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  // useState<Note[]> => este array de notas (useState) tem o formato de Note
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    //parse é o caminho contrário do stringify
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }

    return []
  });

  function onNoteCreated(content: string) {
    const newNote = {
      // crypto.randomUUID => gera um ID unico em formato de string
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    //para salvar na local storage do navegador
    //local storage nao aceita array, portanto, está convertido em string pelo json (javascript object notation)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  //search bar
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== ''
    //se o conteudo da nota inclui o termo buscado
    // toLocaleLowerCase => para tornar a busca nao sensitiva a caps lock
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes




  return (
    // mx = margem; max-w = max width
    // my-10 = tudo multiplo de 4
    // height = h-px que seria height de 1px pra fazer separador; h-[20px] para personalizado
    //div pro degrade preto; gradient-to-t é to top, de baixo pra cima
    // chaves {} é para colocar codigo javascript dentro do html
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="NLW Expert" />
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated}/>

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} />;
        })}
      </div>
    </div>
  );
}
