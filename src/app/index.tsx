import { Link, router } from 'expo-router';
import { View, Text } from '@/components/general/Themed';
import CustomButton from '@/components/general/CustomButton';
import WorkoutListItem from '@/components/workouts/WorkoutListItem';
import { FlatList } from 'react-native';
import { useWorkouts } from '@/store';

export default function HomeScreen() {
  const currentWorkout = useWorkouts((state) => state.currentWorkout);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const workouts = useWorkouts((state) => state.workouts);

  const onStartWorkout = async () => {
    await startWorkout();
    router.push(`/workout/current`);
  };

  return (
    <View
      style={{
        flex: 1,
        gap: 10,
        padding: 10,
        backgroundColor: 'transparent',
      }}
    >
      <View style={{ padding: 8 }}>
        {currentWorkout ? (
          <Link href={`/workout/current`} asChild>
            <CustomButton title="Resume Workout" />
          </Link>
        ) : (
          <CustomButton onPress={onStartWorkout} title="Start New Workout" />
        )}
      </View>

      <FlatList
        data={workouts}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => <WorkoutListItem workout={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
