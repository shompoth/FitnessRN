import Card from '@/components/general/Card';
import { View, Text } from '@/components/general/Themed';
import { StyleSheet } from 'react-native';
import SetItem from './SetItem';
import { ExerciseWithSets } from '@/types/models';
import CustomButton from '../general/CustomButton';
import { useWorkouts } from '@/store';

type WorkoutExerciseItem = {
  exercice: ExerciseWithSets;
};

export default function WorkoutExerciseItem({ exercice }: WorkoutExerciseItem) {
  const addSet = useWorkouts((state) => state.addSet);

  return (
    <Card title={exercice.name}>
      <View style={styles.header}>
        <Text style={styles.setNumber}>Set</Text>
        <Text style={styles.setInfo}>kg</Text>
        <Text style={styles.setInfo}>Reps</Text>
      </View>
      <View style={{ gap: 5 }}>
        {exercice.sets.map((item, index) => (
          <SetItem key={item.id} index={index} set={item} />
        ))}
      </View>
      <CustomButton
        onPress={() => addSet(exercice.id)}
        type="link"
        title="+ Add set"
        style={{ padding: 10, marginTop: 10 }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 5,
  },
  setNumber: {
    marginRight: 'auto',
    fontWeight: 'bold',
  },
  setInfo: {
    width: 60,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
