import { View, Text, TextInput } from '@/components/general/Themed';
import { ExerciseSet } from '@/types/models';
import { useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
// TODO: In newer version of GH, import the Reanimated version
// import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import CustomButton from '../general/CustomButton';
import { useWorkouts } from '@/store';

type SetItem = {
  index: number;
  set: ExerciseSet;
};

export default function SetItem({ index, set }: SetItem) {
  const [weight, setWeight] = useState(set.weight?.toString() || '');
  const [reps, setReps] = useState(set.reps?.toString() || '');

  const updateSet = useWorkouts((state) => state.updateSet);
  const deleteSet = useWorkouts((state) => state.deleteSet);

  const weightTimerRef = useRef<NodeJS.Timeout>(null);
  const repsTimerRef = useRef<NodeJS.Timeout>(null);

  const handleWeightChange = (val: string) => {
    setWeight(val);
    if (weightTimerRef.current) clearTimeout(weightTimerRef.current);
    weightTimerRef.current = setTimeout(() => {
      const parsed = parseFloat(val);
      if (!isNaN(parsed) && parsed >= 0) {
        updateSet(set.id, { weight: parsed });
      }
    }, 500);
  };

  const handleWeightBlur = () => {
    if (weightTimerRef.current) clearTimeout(weightTimerRef.current);
    const parsed = parseFloat(weight);
    if (!isNaN(parsed) && parsed >= 0) {
      updateSet(set.id, { weight: parsed });
    }
  };

  const handleRepsChange = (val: string) => {
    setReps(val);
    if (repsTimerRef.current) clearTimeout(repsTimerRef.current);
    repsTimerRef.current = setTimeout(() => {
      const parsed = parseInt(val);
      if (!isNaN(parsed) && parsed >= 0) {
        updateSet(set.id, { reps: parsed });
      }
    }, 500);
  };

  const handleRepsBlur = () => {
    if (repsTimerRef.current) clearTimeout(repsTimerRef.current);
    const parsed = parseInt(reps);
    if (!isNaN(parsed) && parsed >= 0) {
      updateSet(set.id, { reps: parsed });
    }
  };

  const renderRightActions = () => (
    <CustomButton
      onPress={() => deleteSet(set.id)}
      title="Delete"
      type="link"
      style={{ width: 'auto', padding: 5 }}
      color="crimson"
    />
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <Text style={styles.setNumber}>{index + 1}</Text>

        <TextInput
          placeholder="50"
          value={weight}
          onChangeText={handleWeightChange}
          style={styles.input}
          keyboardType="numeric"
          onBlur={handleWeightBlur}
        />
        <TextInput
          placeholder="8"
          value={reps}
          onChangeText={handleRepsChange}
          style={styles.input}
          keyboardType="numeric"
          onBlur={handleRepsBlur}
        />
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  setNumber: {
    marginRight: 'auto',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    width: 60,
    padding: 5,
    paddingVertical: 7,
    fontSize: 16,
    textAlign: 'center',
  },
});
