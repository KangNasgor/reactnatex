import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TextInput, Button, TouchableOpacity, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { createContext } from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ToDoContext = createContext();

const App = ({ children }) => {

  const navigation = useNavigation();

  const [popupVisible, setPopupVisible] = useState(false);

  const [date, setDate] = useState(new Date());
  const [newDate, setNewDate] = useState(new Date());

  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);

  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const [editingTodoKey, setEditingTodoKey] = useState(null);
  const [editingTimeKey, setEditingTimeKey] = useState(null);

  const [tanggal, setTanggal] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [editingTanggalKey, setEditingTanggalKey] = useState(null);
  const [editingTanggalVisible, setEditingTanggalVisible] = useState(false);

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

  const onChangeDate = (event, selectedDate) => {
    const currentTanggal = selectedDate;
    setDatePickerVisible(false);
    setTanggal(currentTanggal);
  }

  const onChangeDateEdit = (event, selectedDate) => {
    const currentTanggal = selectedDate;
    setEditingTanggalVisible(false);
    setTanggal(currentTanggal);
  }

  const showDatePickerEdit = () => {
    setEditingTanggalVisible(!editingTanggalVisible);
  }

  const showDatePicker = () => {
    setDatePickerVisible(true);
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
    { text: '(This is just an example, you can delete this and start create your own)', key: uuidv4(), time: '', date: '' },
  ]);
  const [index, setIndex] = useState(1);
  const [newToDo, setNewToDo] = useState('');
  let updatedToDos = todos.map((todo, idx) => ({
    ...todo,
    index: idx + 1,
  }));
  const time = new Date(date);
  const formattedDate = `${time.toLocaleTimeString().replace(/:\d{2}\s/, ' ')}`;

  const formattedTanggal = `${tanggal.toLocaleDateString()}`
  const editDate = (key) => {
    setEditingTanggalKey(key);
    todos.map(
      (todo) => todo.key === key ? {
        ...todo,
        date: formattedTanggal
      } : todo
    );
    showDatePickerEdit();
  }
  const addTodo = () => {
    const todo = { text: newToDo, key: uuidv4(), index: index, time: formattedDate !== 'Invalid Date' ? formattedDate : '', date: formattedTanggal }
    setToDos([...todos, todo]);
    setNewToDo('');
    togglePopup();
    setDate(new Date());
    setTanggal(new Date());
    navigation.navigate('To-Do-List');
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
  const todoContextValue = {
    todos,
    setToDos,
    newToDo,
    setNewToDo,
    date,
    setDate,
    tanggal,
    setTanggal,
    formattedDate,
    formattedTanggal,
    showTimePicker,
    show,
    setShow,
    showDatePicker,
    datePickerVisible,
    addTodo,
    onChange,
    onChangeDate,
    updatedToDos,
    editingTodoKey,
    setEditingTodoKey,
    timePickerVisible,
    editingTanggalVisible,
    editDate,
    onChangeDateEdit,
    setTimePickerVisible,
    setEditingTimeKey,
    setEditingTanggalKey,
    onChangeEdit,
  };
  return (
    <ToDoContext.Provider value={todoContextValue}>
      {children}
    </ToDoContext.Provider>
  );
}
export { App, ToDoContext };
