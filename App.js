import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TextInput, Button, TouchableOpacity, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { createContext } from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { App } from './Logic.js';
import MainMenu from './MainMenu.js';
import AddToDo from './AddToDo.js';


const Stack = createNativeStackNavigator();
export default function Main() {
    return (

        <NavigationContainer>
            <App>
                <Stack.Navigator >
                    <Stack.Screen name='To-Do-List' component={MainMenu} options={{
                        headerStyle : {
                            backgroundColor: 'black',
                        },
                        headerTitleStyle: {
                            color: 'white',
                        },
                    }}/>
                    <Stack.Screen name='AddToDo' component={AddToDo} options={{
                        headerStyle : {
                            backgroundColor: 'black',
                        },
                        headerTitleStyle: {
                            color: 'white',
                        },
                        headerTintColor: 'white',
                    }}/>
                </Stack.Navigator>
            </App>
        </NavigationContainer>

    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
});