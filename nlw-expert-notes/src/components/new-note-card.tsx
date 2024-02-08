import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({onNoteCreated}: NewNoteCardProps) {
  // aqui no array temos uma variavel, e uma função set para atualizar o valor da variavel
  const [shouldShowOnboarding, setshouldShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState("");

  function handleStartEditor() {
    setshouldShowOnboarding(false);
  }

  // onChange = ChangeEventHandler, entao foi tipado da mesma forma aqui. generic = o elemento que esta acontecendo o evento de change é um htmltextareaelement declarado na shouldShowOnboarding
  // aqui é para quando o usuario nao tiver digitado nada na textarea da nota, ela voltar ao texto original da nota de "grave uma nota ou texto"
  // atualiza o conteúdo 'setContent' => 'content' para o conteúdo digitado pelo usuário.
  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);

    if (event.target.value === "") {
      setshouldShowOnboarding(true);
    }
  }

  //mesma coisa, onSubmit = FormEventHandler. tipado igual.
  //por default o submit do form leva o usuario a outra tela. essa função aqui é pra previnir isso.
  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    // se o conteúdo da nota for vazio, o return bloqueia o resto do código
    if (content === '') {
      return
    }

    onNoteCreated(content)
    setContent('')
    //depois de criar a nota, o conteudo muda para o padrao de criar nota
    setshouldShowOnboarding(true)

    toast.success('Nota criada com sucesso!')
  }

  function handleStartRecording() {

    // verificar se tá disponivel a api no navegador
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a API de gravação!')
      return
    }

    setIsRecording(true)
    setshouldShowOnboarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'

    // para gravar até que o usuario manualmente pare a gravação
    speechRecognition.continuous = true

    // trazer x alternativas para as palavras ditas
    speechRecognition.maxAlternatives = 1

    // trazer os resultados conforme for falando
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording () {
    setIsRecording(false)
    
    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }


  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60" />
        <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {/* se shouldShowOnboarding é true, então mostrará o parágrafo, caso contrário, o editor */}
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  {" "}
                  Comece{" "}
                  <button type='button' onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">
                    {" "}
                    gravando uma nota{" "}
                  </button>{" "}
                  em áudio ou se preferir {/* {' '} pra adicionar espaço */}
                  <button
                    type='button'
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    {" "}
                    utilize apenas texto{" "}
                  </button>{" "}
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent rezise-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>
            
            {isRecording ? (
              <button
              onClick={handleStopRecording}
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
            >
              <div className="size-3 rounded-full bg-red-500 animate-pulse" />
              Gravando! (clique para interromper)
            </button>
            ) : (
              <button
              type="button"
              onClick={handleSaveNote}
              className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
            >
              Salvar nota
            </button>
            )}

            {/* tailwind: hover underline apenas no "apagar essa nota" porem quando o mouse fosse por cima do elemento pai, usa-se GROUP */}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
