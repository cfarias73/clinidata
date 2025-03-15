import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { Calendar, Activity, User } from 'lucide-react-native';

type PatientCardProps = {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  status: 'neutro' | 'estable' | 'seguimiento' | 'urgente';
};

export default function PatientCard({ id, name, age, lastVisit, status }: PatientCardProps) {
  const statusColors = {
    neutro: '#666666',
    estable: '#27AE60',
    seguimiento: '#F2994A',
    urgente: '#EB5757',
  };

  const statusText = {
    neutro: 'Neutro',
    estable: 'Estable',
    seguimiento: 'Seguimiento',
    urgente: 'Urgente',
  };

  const handlePress = () => {
    router.push({
      pathname: '/patient/[id]',
      params: { id }
    });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.avatarContainer}>
        <User size={30} color="#666666" />
      </View>
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
              {statusText[status]}
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
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
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