import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TextInput, Button, TouchableOpacity, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [popupVisible, setPopupVisible] = useState(false);

  const [date, setDate] = useState(new Date());
  const [newDate, setNewDate] = useState(new Date());
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [editingTodoKey, setEditingTodoKey] = useState(null);
  const [editingTimeKey, setEditingTimeKey] = useState(null);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  }
  const onChangeEdit = (event, selectedDate) => {
    const currentDate = selectedDate;
    setTimePickerVisible(false);
    setDate(currentDate);
  }
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }
  const showTimePicker = () => {
    showMode('time');
  }
  const togglePopup = () => {
    setPopupVisible(!popupVisible)
  };
  const [todos, setToDos] = useState([
    { text: '(This is just an example, you can delete this and start create your own)', key: uuidv4(), time: '' },
  ]);
  const [index, setIndex] = useState(1);
  const [newToDo, setNewToDo] = useState('');
  let updatedToDos = todos.map((todo, idx) => ({
    ...todo,
    index: idx + 1,
  }));
  const time = new Date(date);
  const newTime = new Date(newDate);
  const formattedDate = `${time.toLocaleTimeString().replace(/:\d{2}\s/, ' ')}`;
  const formattedNewDate = `${newTime.toLocaleTimeString().replace(/:\d{2}\s/, ' ')}`;
  const addTodo = () => {
    const todo = { text: newToDo, key: uuidv4(), index: index, time: formattedDate !== 'Invalid Date' ? formattedDate : '' }
    setToDos([...todos, todo]);
    setNewToDo('');
    togglePopup();
    setDate('');
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
    setEditingTodoKey(key);
    let editedToDo = todos.find((todo) => todo.key === key);
    setNewToDo(editedToDo.text)
  };
  const visibleMode = (currentMode) => {
    setTimePickerVisible(true);
    setMode(currentMode);
  }
  const appearTimePicker = () => {
    visibleMode('time');
  }
  const editTime = (key) => {
    setEditingTimeKey(key);
    appearTimePicker();
    const EditedTime = todos.find(
      (todo) => todo.key === key
    );
    setDate(EditedTime.time);
  }
  const saveEditedTodo = async (key) => {
    const updatedToDos = todos.map(
      (todo) => todo.key === key ? {
        ...todo,
        text: newToDo,
        time: formattedDate !== '' && formattedDate !== 'Invalid Date' ? formattedDate : todo.time
      } : todo
    );
    console.log('formattedDate:', formattedDate);
    console.log('todo.time:', todos.find((todo) => todo.key === key).time);
    setToDos(updatedToDos);
    setEditingTodoKey(null);
    setTimePickerVisible(false);
    setEditingTimeKey(null);
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(updatedToDos));
      setNewToDo('');
    }
    catch (error) {
      console.error('Error' + error);
    }
  }
  const saveEditedTime = (key) => {
    const updatedTime = todos.map(
      (todo) => todo.key === key ? {
        ...todo,
        time: formattedDate
      } : todo
    );
  }
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
      <View style={styles.header}>
        <Text style={styles.headerText}>To-Do-List</Text>
      </View>
      {todos.length === 0 && <Text style={[styles.visible, styles.nullCheckerText]}>Nothing here...</Text>}
      <View style={styles.content}>
        <FlatList
          scrollEnabled={false}
          nestedScrollEnabled
          data={updatedToDos}
          renderItem={
            ({ item }) => (
              <View style={styles.lists}>
                <View style={styles.index}>
                  <Text style={styles.indexkey}>{item.index}</Text>
                </View>
                <View style={styles.text}>
                  {editingTodoKey === item.key ? (
                    <View>
                      <TextInput
                        value={newToDo}
                        onChangeText={(text) => setNewToDo(text)}
                        style={styles.editText}
                      />
                      <Text>{item.time}</Text>
                    </View>
                  ) : (
                    <View>
                      <Text>{item.text}</Text>
                      <Text>{item.time}</Text>
                    </View>
                  )}
                </View>
                <View>
                  <TouchableOpacity onPress={() => removeToDo(item.key)} style={styles.delete}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                  {editingTodoKey !== item.key ?
                    <TouchableOpacity onPress={() => editToDo(item.key)} style={styles.edit}>
                      <Text style={styles.deleteText}>Edit</Text>
                    </TouchableOpacity> : ''}
                  {editingTodoKey === item.key ? (
                    <View>
                      <TouchableOpacity onPress={() => { editTime(item.key) }} style={styles.edit}>
                        <Text style={styles.deleteText}>Edit time</Text>
                        {
                          timePickerVisible && (
                            <DateTimePicker
                              testID="dateTimePicker"
                              value={new Date()}
                              onBlur={saveEditedTime}
                              mode={mode}
                              is24Hour={true}
                              onChange={onChangeEdit}
                            />
                          )
                        }
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => saveEditedTodo(item.key)} style={styles.edit}>
                        <Text style={styles.deleteText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  ) : ''}
                </View>
              </View>
            )
          }
        />
        <View style={styles.addToDo}>
          <Button title='add' onPress={togglePopup} />
        </View>
        <Modal visible={popupVisible} animationType='slide' style={styles.popup} onRequestClose={() => setPopupVisible(false)}>
          <TextInput placeholder='add To-Do' style={styles.input}
            onChangeText={(text) => setNewToDo(text)} multiline />
          <Text style={styles.date}>
            Message :
            {` ${"\n" + newToDo + "\n" + formattedDate}`}
          </Text>
          <View style={styles.buttons}>
            <View style={styles.addTime}>
              <Button title='Add time' onPress={showTimePicker} />
              {
                show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date || new Date()}
                    mode={mode}
                    is24Hour={true}
                    key={uuidv4()}
                    onChange={onChange}
                  />
                )
              }
            </View>
            <View style={styles.addButton}>
              <Button title='Add To-Do' onPress={newToDo ? addTodo : () => { }} style={styles.button} />
            </View>
          </View>
        </Modal>
      </View>
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
  header: {
    alignItems: 'center',
    backgroundColor: '#00ffff',
    color: 'white',
    height: 100,
    paddingTop: 50,
    marginBottom: 100,
  },
  headerText: {
    fontSize: 20,
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
    width: 100,
    marginHorizontal: 150,
  },
  deleteText: {
    fontSize: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 50,
    width: 300,
    height: 50,
    marginLeft: 50,
    borderRadius: 10,
    paddingLeft: 10,
  },
  addButton: {
    height: 70,
    width: 100,
  },
  close: {
    width: 70,
    height: 100,
    marginHorizontal: 170,
  },
  addTime: {
    marginBottom: 300,
    width: 100,
    alignItems: 'center',
    flex: 2,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 100,
  },
  date: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 50,
    marginBottom: 25,
  },
  visible: {
    color: 'black',
  },
  invisible: {
    color: 'transparent',
  },
  nullCheckerText: {
    textAlign: 'center',
    color: 'grey',
    fontSize: 20,
    marginBottom: 50,
  },
  button: {
    color: '#00ffff',
  },
  editText: {
    borderColor: 'black',
    borderWidth: 1,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
    paddingLeft: 10,
  },
});
