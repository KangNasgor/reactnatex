import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TextInput, Button, TouchableOpacity, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToDoContext } from './Logic.js';
import { useNavigation } from '@react-navigation/native';


export default function AddToDo() {
  const {
    todos,
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

  } = useContext(ToDoContext);
  return (
    <View style={styles.container}>
      <View style={styles.inputParent}>
        <TextInput placeholder='add To-Do' placeholderTextColor={'grey'} style={styles.input} onChangeText={(text) => setNewToDo(text)} multiline />
      </View>
      <Text style={styles.date}>
        Message :
        {` ${"\n" + newToDo + "\n" + formattedDate + "\n" + formattedTanggal}`}
      </Text>
      <View style={styles.buttons}>
        <View style={styles.addTime}>
          <Button title='Add time' onPress={showTimePicker} />
          {
            show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode={'time'}
                is24Hour={true}
                key={uuidv4()}
                onChange={onChange}
              />
            )
          }
        </View>
        <View style={styles.addTime}>
          <Button title='Add date' onPress={showDatePicker} />
          {
            datePickerVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode={'date'}
                key={uuidv4()}
                onChange={onChangeDate}
              />
            )
          }
        </View>
        <View style={styles.addButton}>
          <Button title='Add To-Do' onPress={newToDo ? addTodo : () => { }} style={styles.button} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor : 'black',
    height: 800,
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
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  deleteText: {
    fontSize: 10,
  },
  inputParent: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  input: {
    borderWidth: 1,
    borderColor: 'blue',
    marginTop: 50,
    width: 300,
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
    color: 'white',
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
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  date: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 50,
    marginBottom: 25,
    color: 'white',
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
    marginTop: 50,
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