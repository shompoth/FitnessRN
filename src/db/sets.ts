import { DbExerciseSet } from "@/types/db";
import { getDb } from "./index";
import { ExerciseSet } from "@/types/models";

export const saveSet = async (set: ExerciseSet) => {
    try {
        const db = await getDb();
        
        await db.runAsync(
            "INSERT OR REPLACE INTO sets (id, exercise_id, reps, weight, one_rm) VALUES (?, ?, ?, ?, ?)", [
                set.id, 
                set.exerciseId, 
                set.reps ?? null, 
                set.weight ?? null, 
                set.oneRM ?? null
            ]
        );
    } catch (error) {
        console.error("Error saving set:", error);
    }
}

const parseSet = (set: DbExerciseSet): ExerciseSet => {
    return {
        id: set.id,
        exerciseId: set.exercise_id,
        reps: set.reps,
        weight: set.weight,
        oneRM: set.one_rm,
    }
}

export const getSets = async (exerciseId: string): Promise<ExerciseSet[]> => {
    try {
        const db = await getDb();

        const sets = await db.getAllAsync<DbExerciseSet>(
            "SELECT * FROM sets WHERE exercise_id = ?",
            exerciseId
        );
        return sets.map(parseSet);
    } catch (error) {
        console.error("Error getting sets:", error);
        return [];
    }
}

export const deleteSet = async (setId: string) => {
    try {
        const db = await getDb();
        await db.runAsync(
            "DELETE FROM sets WHERE id = ?",
            setId
        );
    } catch (error) {
        console.error("Error deleting set:", error);
    }
}