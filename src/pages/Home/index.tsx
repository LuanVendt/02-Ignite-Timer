
import { zodResolver } from '@hookform/resolvers/zod';
import { HandPalm, Play } from 'phosphor-react';
import { createContext, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as zod from 'zod';
import { CountDown } from './components/CountDown';
import { NewCycleForm } from './components/NewCycleForm';
import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton
} from './styles';

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    fisinhedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
}


export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: 
        zod.number()
        .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
        .max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const { handleSubmit, watch } = newCycleForm

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }
    
    function markCurrentCycleAsFinished() {
        setCycles((state) => {
            return state.map(cycle => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, interruptedDate: new Date() };
              } else {
                return cycle;
              }
            });
          });
    }

    const formRef = useRef<HTMLFormElement | null>(null);

    function handleCreateNewCycle(data: NewCycleFormData) {
      const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0);

        if (formRef.current) {
            formRef.current.reset();
        }
    }

    function handleInterruptCycle() {
      setCycles((state) => {
        return state.map(cycle => {
          if (cycle.id === activeCycleId) {
            return { ...cycle, interruptedDate: new Date() };
          } else {
            return cycle;
          }
        });
      });
    
      setActiveCycleId(null);
    }
    
    const task = watch('task')
    const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form ref={formRef} onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider 
            value={{activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed}}
        >
            <FormProvider {...newCycleForm}>
                <NewCycleForm />
            </FormProvider>
            <CountDown />
        </CyclesContext.Provider>

        { activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
          <HandPalm size={24} />
          Interromper
        </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
        )
      }
      </form>
    </HomeContainer>
  )
}
