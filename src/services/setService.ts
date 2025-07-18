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

  return newSet;
};

export const updateSet = (
  set: ExerciseSet,
  updatedFields: Pick<ExerciseSet, 'reps' | 'weight'>
) => {
  const updatedSet = { ...set };
  if (updatedFields.reps !== undefined) {
    updatedSet.reps = updatedFields.reps;
  }
  if (updatedFields.weight !== undefined) {
    updatedSet.weight = updatedFields.weight;
  }
  if (updatedSet.weight !== undefined && updatedSet.reps !== undefined) {
    updatedSet.oneRM = updatedSet.weight * (36.0 / (37.0 - updatedSet.reps));
  }
  return updatedSet;
};

const isSetComplete = (set: ExerciseSet) => {
  return set.reps && set.reps > 0;
};

export const cleanSets = (sets: ExerciseSet[]) => {
  const completeSets = sets.filter((set) => isSetComplete(set));
  return completeSets;
};
