import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TextInput, Button, TouchableOpacity, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { createContext } from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddToDo from './AddToDo.js';
import { useContext } from 'react';
import { ToDoContext } from './Logic.js';
import { useNavigation } from '@react-navigation/native';



export default function MainMenu() {
    const navigation = useNavigation();
    const {
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
    } = useContext(ToDoContext);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const showOptions = (key) => {
        setEditingTodoKey(key);
        setOptionsVisible(!optionsVisible);
    }
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
    const appearTimePicker = () => {
        setTimePickerVisible(true);
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
                time: formattedDate !== '' && formattedDate !== 'Invalid Date' ? formattedDate : todo.time,
                date: formattedTanggal
            } : todo
        );
        console.log('formattedDate:', formattedDate);
        console.log('todo.time:', todos.find((todo) => todo.key === key).time);
        setToDos(updatedToDos);
        setEditingTodoKey(null);
        setTimePickerVisible(false);
        setEditingTimeKey(null);
        setEditingTanggalKey(null);
        setTanggal(new Date());
        try {
            await AsyncStorage.setItem('todos', JSON.stringify(updatedToDos));
            setNewToDo('');
        }
        catch (error) {
            console.error('Error' + error);
        }
    }
    const saveEditedDate = (key) => {
        const updatedDate = todos.map(
            (todo) => todo.key === key ? {
                ...todo,
                date: formattedTanggal
            } : todo
        );
    }
    const saveEditedTime = (key) => {
        const updatedTime = todos.map(
            (todo) => todo.key === key ? {
                ...todo,
                time: formattedDate
            } : todo
        );
    }
    return (
        <ScrollView style={styles.container}>
            {todos.length === 0 && <Text style={[styles.visible, styles.nullCheckerText]}>Nothing here...</Text>}
            <View style={styles.content}>
                <FlatList
                    scrollEnabled={false}
                    nestedScrollEnabled
                    data={updatedToDos}
                    style={styles.flatlist}
                    renderItem={
                        ({ item }) => (
                            <View>
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
                                                <Text style={styles.todotext}>{item.time}</Text>
                                                <Text style={styles.todotext}>{item.date}</Text>
                                            </View>
                                        ) : (
                                            <View>
                                                <Text style={styles.todotext}>{item.text}</Text>
                                                <Text style={styles.todotext}>{item.time}</Text>
                                                <Text style={styles.todotext}>{item.date}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.editDelete}>
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
                                                            mode={'time'}
                                                            is24Hour={true}
                                                            onChange={onChangeEdit}
                                                        />
                                                    )
                                                }
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { editDate(item.key) }} style={styles.edit}>
                                                <Text style={styles.deleteText}>Edit date</Text>
                                                {
                                                    editingTanggalVisible && (
                                                        <DateTimePicker
                                                            testID="dateTimePicker"
                                                            value={new Date()}
                                                            onBlur={saveEditedDate}
                                                            mode={'date'}
                                                            onChange={onChangeDateEdit}
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
                    <Button title='add' onPress={() => navigation.navigate('AddToDo')} />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    flatlist: {
        marginTop: 50,
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
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
        flex: 2,
        justifyContent: 'space-around',
        width: 350,
        marginBottom: 5,
    },
    index: {
        backgroundColor: 'black',
        borderColor: 'blue',
        borderWidth: 1,
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        width: 300,
        height: 100,
        backgroundColor: 'black',
        borderRadius: 10,
        paddingTop: 10,
        paddingLeft: 15,
        borderColor: 'blue',
        borderWidth: 1,
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
        marginBottom: 5,
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
        borderColor: 'black',
        marginTop: 50,
        width: 300,
        height: 50,
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
        borderColor: 'white',
        borderWidth: 1,
        height: 50,
        marginRight: 10,
        borderRadius: 5,
        paddingLeft: 10,
        color: 'white',
    },
    editDelete: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: 100,
        marginLeft: 250,
    },
    todotext: {
        color: 'white',
    },
    indexkey: {
        color: 'white',
    },
    option: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionText: {
        color: 'white',
        marginRight: 10,
    },
});