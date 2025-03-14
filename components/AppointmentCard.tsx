import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Clock, User } from 'lucide-react-native';

type AppointmentCardProps = {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed';
};

export default function AppointmentCard({ id, patientName, time, type, status }: AppointmentCardProps) {
  const statusColors = {
    scheduled: '#2D9CDB',
    'in-progress': '#F2C94C',
    completed: '#27AE60',
  };

  const statusText = {
    scheduled: 'Programada',
    'in-progress': 'En curso',
    completed: 'Completada',
  };

  return (
    <Link href={`/appointment/${id}`} asChild>
      <Pressable style={styles.container}>
        <View style={styles.timeContainer}>
          <Clock size={20} color="#2D9CDB" />
          <Text style={styles.time}>{time}</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.patientInfo}>
            <User size={16} color="#666666" />
            <Text style={styles.patientName}>{patientName}</Text>
          </View>
          
          <View style={styles.details}>
            <Text style={styles.type}>{type}</Text>
            <View style={[styles.status, { backgroundColor: statusColors[status] }]}>
              <Text style={styles.statusText}>{statusText[status]}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  time: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2D9CDB',
    marginLeft: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#333333',
    marginLeft: 8,
  },
  details: {
    alignItems: 'flex-end',
  },
  type: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
});