import { Exercise, ExerciseWithSets } from '@/types/models';
import { cleanSets, createSet, getSetTotalWeight } from '@/services/setService';
import * as Crypto from 'expo-crypto';
import { deleteExercise, saveExercise } from '@/db/exercices';
import { getSets } from '@/db/sets';

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

  saveExercise(newExercise);

  // add one empty set
  newExercise.sets.push(createSet(newExercise.id));

  return newExercise;
};

export const cleanExercise = (exercise: ExerciseWithSets) => {
  const sets = cleanSets(exercise.sets);

  if (sets.length === 0) {
    deleteExercise(exercise.id);
    return null;
  }

  return {
    ...exercise,
    sets,
  };
};

export const addSetsToExercise = async (exercise: Exercise): Promise<ExerciseWithSets> => {
    const sets = await getSets(exercise.id);
    return {
        ...exercise,
        sets,
    };
}