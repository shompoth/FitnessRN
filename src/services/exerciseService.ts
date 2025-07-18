import { ExerciseWithSets } from '@/types/models';
import { cleanSets, createSet, getSetTotalWeight } from '@/services/setService';
import * as Crypto from 'expo-crypto';

export const getExerciseTotalWeight = (exercise: ExerciseWithSets) => {
  return exercise.sets.reduce(
    (totalSetWeight, set) => totalSetWeight + getSetTotalWeight(set),
    0
  );
};

export const createExercise = (
  name: string,
  workoutId: string
): ExerciseWithSets => {
  const newExercise: ExerciseWithSets = {
    id: Crypto.randomUUID(),
    name,
    workoutId,
    sets: [],
  };

  // add one empty set
  newExercise.sets.push(createSet(newExercise.id));

  return newExercise;
};

export const cleanExercise = (exercise: ExerciseWithSets) => {
  const sets = cleanSets(exercise.sets);

  if (sets.length === 0) {
    return null;
  }

  return {
    ...exercise,
    sets,
  };
};
