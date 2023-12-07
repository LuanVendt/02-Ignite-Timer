
import { HandPalm, Play } from 'phosphor-react';
import { createContext, useRef, useState } from 'react';
import { CountDown } from './components/CountDown';
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
    markCurrentCycleAsFinished: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
    
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

    // function handleCreateNewCycle(data: NewCycleFormData) {
    //   const id = String(new Date().getTime())

    //     const newCycle: Cycle = {
    //         id,
    //         task: data.task,
    //         minutesAmount: data.minutesAmount,
    //         startDate: new Date(),
    //     }

    //     setCycles((state) => [...state, newCycle])
    //     setActiveCycleId(id)
    //     setAmountSecondsPassed(0);

    //     if (formRef.current) {
    //         formRef.current.reset();
    //     }
    // }

    function handleInterruptCycle() {
    //   setCycles((state) => {
    //     return state.map(cycle => {
    //       if (cycle.id === activeCycleId) {
    //         return { ...cycle, interruptedDate: new Date() };
    //       } else {
    //         return cycle;
    //       }
    //     });
    //   });
    
      setActiveCycleId(null);
    }
    

    // console.log(formState.errors)

    // const task = watch('task')
    // const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form /*ref={formRef} onSubmit={handleSubmit(handleCreateNewCycle)}*/ action="">
        <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCycleAsFinished}}>
            {/* <NewCycleForm /> */}
            <CountDown />
        </CyclesContext.Provider>

        { activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
          <HandPalm size={24} />
          Interromper
        </StopCountdownButton>
        ) : (
          <StartCountdownButton /*disabled={isSubmitDisabled}*/ type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
        )
      }
      </form>
    </HomeContainer>
  )
}
