import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { Calendar, Activity } from 'lucide-react-native';

type PatientCardProps = {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  status: 'stable' | 'follow-up' | 'urgent';
  imageUrl: string;
};

export default function PatientCard({ id, name, age, lastVisit, status, imageUrl }: PatientCardProps) {
  const statusColors = {
    stable: '#27AE60',
    'follow-up': '#F2C94C',
    urgent: '#EB5757',
  };

  const handlePress = () => {
    router.push({
      pathname: '/patient/[id]',
      params: { id }
    });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.age}>{age} años</Text>
        <View style={styles.details}>
          <View style={styles.detail}>
            <Calendar size={16} color="#666666" />
            <Text style={styles.detailText}>{lastVisit}</Text>
          </View>
          <View style={styles.detail}>
            <Activity size={16} color={statusColors[status]} />
            <Text style={[styles.detailText, { color: statusColors[status] }]}>
              {status === 'stable' ? 'Estable' : status === 'follow-up' ? 'Seguimiento' : 'Urgente'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  age: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
});