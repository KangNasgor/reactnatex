import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default function App() {
  const assassin = [
    { name: 'Leonard', id: '0' },
    { name: 'Aziz', id: '1' },
    { name: 'Daniswara', id: '2' },
    { name: 'Andhika', id: '3' },
    { name: 'Yahya', id: '4' },
    { name: 'Rayhan', id: '5' },
    { name: 'Wahyu', id: '6' },
    { name: 'Wildan', id: '7' },
  ];
  const target = [
    { name: 'Sarah', id: '0' },
    { name: 'David', id: '1' },
    { name: 'Amanda', id: '2' },
    { name: 'Michael', id: '3' },
    { name: 'Eva', id: '4' },
    { name: 'Alex', id: '5' },
    { name: 'Sophia', id: '6' },
  ];
  const targetArray = target.map((item) => item.name);
  return (
    <View style={styles.container}>
      <FlatList
        data={assassin}
        numColumns={1}
        keyExtractor={(item) => [item.id]}
        renderItem={({item, index}) => (
          <View style={styles.list}>
            <Text>{item.name} will assassinate {targetArray[index] ? targetArray[index] : 'no one'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list : {
    display : 'flex',
    flex : '2',
    flexDirection : 'row', 
  }
});
