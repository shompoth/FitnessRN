import { WorkoutWithExercises } from '@/types/models';
import {
  cleanExercise,
  getExerciseTotalWeight,
} from '@/services/exerciseService';
import * as Crypto from 'expo-crypto';

export const getWorkoutTotalWeight = (workout: WorkoutWithExercises) => {
  return workout.exercises.reduce(
    (total, exercise) => total + getExerciseTotalWeight(exercise),
    0
  );
};

export const newWorkout = () => {
  const newWorkout: WorkoutWithExercises = {
    id: Crypto.randomUUID(),
    createdAt: new Date(),
    finishedAt: null,
    exercises: [],
  };

  return newWorkout;
};

export const finishWorkout = (workout: WorkoutWithExercises) => {
  // cleanup incomplete sets
  const cleanedWorkout = cleanupWorkout(workout);

  const finishedWorkout: WorkoutWithExercises = {
    ...cleanedWorkout,
    finishedAt: new Date(),
  };

  return finishedWorkout;
};

export const cleanupWorkout = (workout: WorkoutWithExercises) => {
  const cleanedExercises = workout.exercises
    .map(cleanExercise)
    .filter((e) => !!e);

  return {
    ...workout,
    exercises: cleanedExercises,
  };
};
