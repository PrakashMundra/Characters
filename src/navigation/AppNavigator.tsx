import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import CharactersList from "../screens/CharactersList";
import CharacterDetails from "../screens/CharacterDetails";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { ApolloProvider } from "@apollo/client";
import Strings from "../strings";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack/src/types";
import * as Linking from 'expo-linking';
import { getCharactersClient } from "../apollo";

export type RootStackParamList = {
    CharactersList: undefined,
    CharacterDetails: { id: string };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, Screen>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const prefix = Linking.makeUrl('/');
const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [ prefix ],
    config: {
        initialRouteName: "CharactersList",
        screens: {
            CharactersList: {
                path: "list",
            },
            CharacterDetails: {
                path: "details/:id",
            }
        },
    },
};

function AppNavigator() {
    return (<NavigationContainer linking={ linking }>
            <CharactersStack/>
        </NavigationContainer>
    );
}

const headerOptions: NativeStackNavigationOptions = {
    headerStyle: {
        backgroundColor: "#12345F",
    },
    headerTintColor: "white",
    headerTitleStyle: {
        fontWeight: "bold",
    },
    headerBackTitle: Strings.back,
};

function CharactersStack() {
    const client = getCharactersClient();
    return (<ApolloProvider client={ client }>
            <Stack.Navigator initialRouteName="CharactersList">
                <Stack.Screen name="CharactersList"
                              component={ CharactersList }
                              options={ {
                                  title: Strings.characters,
                                  ...headerOptions,
                              } }/>
                <Stack.Screen name="CharacterDetails"
                              component={ CharacterDetails }
                              options={ {
                                  title: Strings.character_details,
                                  ...headerOptions,
                              } }/>
            </Stack.Navigator>
        </ApolloProvider>
    );
}

export default AppNavigator;
