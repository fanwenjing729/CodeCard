import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { courses } from '../data/courses';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>选择学科</Text>
      {courses.map((c) => (
        <TouchableOpacity
          key={c.id}
          style={styles.courseCard}
          onPress={() => navigation.navigate('Course', { courseId: c.id })}
          activeOpacity={0.7}
        >
          <View style={[styles.courseIcon, { backgroundColor: c.color }]}>
            {c.icon ? (
              <MaterialCommunityIcons name={c.icon as any} size={24} color="#fff" />
            ) : (
              <Text style={styles.courseIconText}>{c.title[0]}</Text>
            )}
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{c.title}</Text>
            <Text style={styles.courseMeta}>{c.nodes.filter((n) => n.cards.length > 0).length} 个模块</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
    marginTop: 64,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  courseIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  courseIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  courseMeta: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: '#ccc',
    fontWeight: '300',
  },
});
