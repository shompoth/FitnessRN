import { ExerciseWithSets, Workout, WorkoutWithExercises } from '@/types/models';
import {
  addSetsToExercise,
  cleanExercise,
  getExerciseTotalWeight,
} from '@/services/exerciseService';
import * as Crypto from 'expo-crypto';
import { getCurrentWorkout, getWorkouts, saveWorkout } from '@/db/workout';
import { getExercices } from '@/db/exercices';

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

  // save it in database
  saveWorkout(newWorkout);

  return newWorkout;
};

export const finishWorkout = (workout: WorkoutWithExercises) => {
  // cleanup incomplete sets
  const cleanedWorkout = cleanupWorkout(workout);

  const finishedWorkout: WorkoutWithExercises = {
    ...cleanedWorkout,
    finishedAt: new Date(),
  };

  saveWorkout(finishedWorkout);

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

const addExercicesToWorkout = async (workout: Workout): Promise<WorkoutWithExercises> => {
const exercices = await getExercices(workout.id);
const exercicesWithSets = await Promise.all(exercices.map(addSetsToExercise));

return {
  ...workout,
  exercises: exercicesWithSets,
}
}

export const getCurrentWorkoutWithExercises = async (): Promise<WorkoutWithExercises | null> => {
  const workout = await getCurrentWorkout();

  if(workout) {
    return addExercicesToWorkout(workout)
    
  }

return null
    
}

export const getWorkoutsWithExercises = async (): Promise<WorkoutWithExercises[]> => {
    const workouts = await getWorkouts();

    return await Promise.all(workouts.map(workout => addExercicesToWorkout(workout)))
    
}