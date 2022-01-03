import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
    return (<SafeAreaView style={ styles.container }>
            <StatusBar style="light"/>
            <AppNavigator/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12345F"
    },
});
