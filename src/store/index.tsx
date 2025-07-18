import { ExerciseSet, WorkoutWithExercises } from '@/types/models';
import { create } from 'zustand';
import { finishWorkout, newWorkout } from '@/services/workoutService';
import { createExercise } from '@/services/exerciseService';
import { immer } from 'zustand/middleware/immer';
import { createSet, updateSet } from '@/services/setService';
import { current } from 'immer';

type State = {
  workouts: WorkoutWithExercises[];
  currentWorkout: WorkoutWithExercises | null;
};

type Actions = {
  startWorkout: () => void;
  finishWorkout: () => void;
  addExercise: (name: string) => void;

  // Sets
  addSet: (exerciseId: string) => void;
  updateSet: (
    id: string,
    updatedFields: Pick<ExerciseSet, 'reps' | 'weight'>
  ) => void;
  deleteSet: (id: string) => void;
};

export const useWorkouts = create<State & Actions>()(
  immer((set, get) => ({
    workouts: [],
    currentWorkout: null,

    startWorkout: () => {
      set({ currentWorkout: newWorkout() });
    },
    finishWorkout: () => {
      const { currentWorkout } = get();
      if (!currentWorkout) {
        return;
      }

      const finishedWorkout = finishWorkout(currentWorkout);

      set((state) => {
        state.currentWorkout = null;
        state.workouts.unshift(finishedWorkout);
        //     ({
        //     currentWorkout: null,
        //     workouts: [finishedWorkout, ...state.workouts],
        //   })
      });
    },

    addExercise: (name) => {
      const { currentWorkout } = get();
      if (!currentWorkout) {
        return;
      }
      const newExercise = createExercise(name, currentWorkout.id);

      set(({ currentWorkout }) => {
        currentWorkout?.exercises.push(newExercise);
        //     ({
        //     currentWorkout: currentWorkout && {
        //       ...currentWorkout,
        //       exercises: [...currentWorkout?.exercises, newExercise],
        //     },
        //   })
      });
    },

    //Sets
    addSet: async (exerciseId) => {
      const newSet = createSet(exerciseId);

      set(({ currentWorkout }) => {
        const exercise = currentWorkout?.exercises.find(
          (exercise) => exercise.id === exerciseId
        );
        if (exercise) {
          exercise.sets.push(newSet);
        }
      });
    },
    updateSet: (setId, updatedFields) => {
      set(({ currentWorkout }) => {
        const exercise = currentWorkout?.exercises.find((exercise) =>
          exercise.sets.some((set) => set.id === setId)
        );
        const setIndex = exercise?.sets?.findIndex((set) => set.id === setId);

        if (!exercise || setIndex === undefined || setIndex === -1) {
          return;
        }

        const updatedSet = updateSet(
          current(exercise.sets[setIndex]),
          updatedFields
        );
        exercise.sets[setIndex] = updatedSet;
      });
    },
    deleteSet: (setId) => {
      set(({ currentWorkout }) => {
        if (!currentWorkout) {
          return;
        }
        const exercise = currentWorkout.exercises.find((exercise) =>
          exercise.sets.some((set) => set.id === setId)
        );
        if (!exercise) {
          return;
        }
        exercise.sets = exercise.sets.filter((set) => set.id !== setId);
        if (exercise.sets.length === 0) {
          // was the last set
          currentWorkout.exercises = currentWorkout.exercises.filter(
            (ex) => ex.id !== exercise.id
          );
        }
      });
    },
  }))
);
