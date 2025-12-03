import { Exercise, ExerciseWithSets } from "@/types/models";
import { getDb } from ".";
import { DbExercise } from "@/types/db";

export const saveExercise = async (exercise: ExerciseWithSets) => {
    try {
        const db = await getDb();
        if (!db) {
            return;
        }
        await db.runAsync(
            "INSERT INTO exercises (id, workout_id, name) VALUES (?, ?, ?)",
            [exercise.id, exercise.workoutId, exercise.name]
        );
    } catch (error) {
        console.error("Error saving exercise:", error);
    }
}

const parseExercise = (exercise: DbExercise): Exercise => {
    return {
        id: exercise.id,
        name: exercise.name,
        workoutId: exercise.workout_id,
    }
}

export const getExercices = async (workout_id: string): Promise<Exercise[]> => {
    try {
        const db = await getDb()
        const exercises = await db.getAllAsync<DbExercise>(`
            SELECT * FROM exercises
            WHERE workout_id = ?
            `,
            [workout_id]
        )

        if(!exercises){
            return []
        }
        
        return exercises.map(parseExercise)
    } catch (error) {
        console.log(error);
        return []
    }
}

export const deleteExercise = async (exerciseId: string) => {
    try {
        const db = await getDb();
        
        await db.runAsync(
            "DELETE FROM exercises WHERE id = ?",
            [exerciseId]
        );
    } catch (error) {
        console.error("Error deleting exercise:", error);
    }
}