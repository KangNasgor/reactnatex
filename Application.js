import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Button} from 'react-native';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import ModalComponent from './AddToDo';

export default function App() {
  const navigation = useNavigation();
  const [todos, setToDos] = useState([
    { text: '(This is just an example, you can delete this and start create your own)', key: uuidv4(), time: '', date: '' },
  ]);
  const [index, setIndex] = useState(1);
  const [newToDo, setNewToDo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const addTodo = () => {
    const formattedDate = new Date().toLocaleTimeString().replace(/:\d{2}\s/, ' ');
    const formattedTanggal = new Date().toLocaleDateString();

    const todo = { text: newToDo, key: uuidv4(), index: index, time: formattedDate !== 'Invalid Date' ? formattedDate : '', date: formattedTanggal }
    setToDos([...todos, todo]);
    setNewToDo('');
    setModalVisible(false);
  };

  const removeToDo = async (keyRemoveItem) => {
    try {
      const storedToDos = await AsyncStorage.getItem('todos');
      if (storedToDos !== null) {
        const currentToDos = JSON.parse(storedToDos);
        const updatedToDos = currentToDos.filter((todo) => todo.key !== keyRemoveItem);
        await AsyncStorage.setItem('todos', JSON.stringify(updatedToDos));
        setToDos(updatedToDos);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editToDo = (key) => {
    const editedToDo = todos.find((todo) => todo.key === key);
    setNewToDo(editedToDo.text);
  };

  const saveEditedTodo = async (key) => {
    const formattedDate = new Date().toLocaleTimeString().replace(/:\d{2}\s/, ' ');
    const formattedTanggal = new Date().toLocaleDateString();

    const updatedToDos = todos.map(
      (todo) => todo.key === key ? {
        ...todo,
        text: newToDo,
        time: formattedDate !== '' && formattedDate !== 'Invalid Date' ? formattedDate : todo.time,
        date: formattedTanggal
      } : todo
    );
    setToDos(updatedToDos);
    setNewToDo('');
    setModalVisible(false);

    try {
      await AsyncStorage.setItem('todos', JSON.stringify(updatedToDos));
    } catch (error) {
      console.error('Error' + error);
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem('todos');
        if (storedTodos !== null) {
          setToDos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error('Error loading todos from AsyncStorage:', error);
      }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.error('Error saving todos to AsyncStorage:', error);
      }
    };
    saveTodos();
  }, [todos]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {todos.length === 0 && <Text style={[styles.visible, styles.nullCheckerText]}>Nothing here...</Text>}
        <FlatList
          scrollEnabled={false}
          nestedScrollEnabled
          data={todos}
          renderItem={({ item }) => (
            <View style={styles.lists}>
              <View style={styles.index}>
                <Text style={styles.indexkey}>{item.index}</Text>
              </View>
              <View style={styles.text}>
                <Text>{item.text}</Text>
                <Text>{item.time}</Text>
                <Text>{item.date}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => removeToDo(item.key)} style={styles.delete}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => editToDo(item.key)} style={styles.edit}>
                  <Text style={styles.deleteText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <View style={styles.addToDo}>
          <Button title='add' onPress={() => navigation.navigate('Modal')} />
        </View>
      </View>
      {/* <ModalComponent
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newToDo={newToDo}
        setNewToDo={setNewToDo}
        addTodo={addTodo}
        saveEditedTodo={saveEditedTodo}
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'center',
    flexDirection: 'column',
    flex: 2,
  },
  content: {
    marginTop: 50,
  },
  lists: {
    display: 'flex',
    flexDirection: 'row',
    flex: 3,
    justifyContent: 'space-around',
    width: 250,
    marginBottom: 20,
  },
  index: {
    backgroundColor: '#00ffff',
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: 150,
    height: 100,
    backgroundColor: '#00ffff',
    borderRadius: 10,
    paddingTop: 10,
    paddingLeft: 15,
  },
  delete: {
    height: 40,
    width: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  edit: {
    height: 40,
    width: 40,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  addToDo: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  deleteText: {
    fontSize: 10,
  },
  nullCheckerText: {
    textAlign: 'center',
    color: 'grey',
    fontSize: 20,
    marginBottom: 50,
  },
});