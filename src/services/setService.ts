import { deleteSet, saveSet } from '@/db/sets';
import { ExerciseSet } from '@/types/models';
import * as Crypto from 'expo-crypto';

export const getBestSet = (sets: ExerciseSet[]) => {
  return sets.reduce((bestSet: ExerciseSet | null, set) => {
    return (set?.oneRM || 0) > (bestSet?.oneRM || 0) ? set : bestSet;
  }, null);
};

export const getSetTotalWeight = (set: ExerciseSet) => {
  return (set.weight || 0) * (set.reps || 0);
};

export const createSet = (exerciseId: string): ExerciseSet => {
  const newSet: ExerciseSet = {
    id: Crypto.randomUUID(),
    exerciseId,
  };

  saveSet(newSet);

  return newSet;
};

export const updateSet = (
  set: ExerciseSet,
  updatedFields: Partial<Pick<ExerciseSet, 'reps' | 'weight'>>
) => {
  const updatedSet = { ...set, ...updatedFields };

  // Validation
  if (updatedSet.reps !== undefined && updatedSet.reps < 0) {
    updatedSet.reps = 0;
  }
  if (updatedSet.weight !== undefined && updatedSet.weight < 0) {
    updatedSet.weight = 0;
  }

  if (updatedSet.weight && updatedSet.reps && updatedSet.reps > 0) {
    // Prevent division by zero or negative 1RM (Brzycki formula limit)
    const effectiveReps = Math.min(updatedSet.reps, 36);
    updatedSet.oneRM = updatedSet.weight * (36.0 / (37.0 - effectiveReps));
  }

  saveSet(updatedSet);

  return updatedSet;
};

const isSetComplete = (set: ExerciseSet) => {
  return set.reps && set.reps > 0;
};

export const cleanSets = (sets: ExerciseSet[]) => {
  const completeSets = sets.filter(isSetComplete);
  const incompleteSets = sets.filter((set) => !isSetComplete(set));

  incompleteSets.forEach(({id}) => deleteSet(id));

  return completeSets;
};
