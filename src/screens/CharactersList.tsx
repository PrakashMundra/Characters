import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { gql, useQuery } from "@apollo/client";
import Styles from "./Styles";
import { RootStackScreenProps } from "../navigation/AppNavigator";
import { Character, Characters } from "../entities";

interface InitialState {
    isLoading: boolean;
    isLoadingMore: boolean;
    page: number;
    totalPages: number;
    characters: Character[];
    errorMsg: string | undefined;
}

function CharactersList( { navigation }: RootStackScreenProps<"CharactersList"> ) {
    const [ state, setState ] = useState<InitialState>({
        isLoading: true,
        isLoadingMore: false,
        page: 1,
        totalPages: 1,
        characters: [],
        errorMsg: undefined,
    });
    const QUERY = gql`
        query {
            characters (page: ${ state.page }) {
                info {
                    pages
                }
                results {
                    id
                    name
                    image
                }
            }
        }`;
    const { data, error } = useQuery(QUERY);

    useEffect(() => {
        if ( error ) {
            setErrorMessage();
        } else if ( data ) {
            setCharacters();
        }
    }, [ data, error ]);

    const setErrorMessage = () => {
        setState(prevState => ({
            ...prevState,
            isLoading: false,
            isLoadingMore: false,
            errorMsg: error?.message,
        }));
    };

    const setCharacters = () => {
        const resp: Characters = data.characters;
        setState(prevState => ({
            ...prevState,
            isLoading: false,
            isLoadingMore: false,
            errorMsg: undefined,
            totalPages: resp.info.pages,
            characters: [ ...prevState.characters, ...resp.results ]
        }));
    };

    const keyExtractor = ( item: Character, index: number ) => {
        return `${ index }-${ item.id }`
    };

    const renderItem = ( { item }: { item: Character } ) => {
        return <TouchableOpacity onPress={ () => onPress(item) }>
            <ListItem item={ item }/>
        </TouchableOpacity>
    };

    const onEndReached = () => {
        if ( !state.isLoadingMore && state.page < state.totalPages ) {
            setState(prevState => ({
                ...prevState,
                isLoadingMore: true,
                page: prevState.page + 1
            }));
        }
    };

    const onPress = ( item: Character ) => {
        navigation.navigate("CharacterDetails", { id: item.id });
    };

    if ( state.isLoading ) {
        return <LoadIndicator style={ Styles.indicator }/>
    } else if ( state.errorMsg ) {
        return <ErrorMessage style={ Styles.indicator }
                             error={ state.errorMsg }/>
    }
    return <FlatList
        data={ state.characters }
        keyExtractor={ keyExtractor }
        renderItem={ renderItem }
        onEndReachedThreshold={ 0.7 }
        onEndReached={ onEndReached }
        ItemSeparatorComponent={ () => {
            return <View style={ Styles.item_divider }/>
        } }
        ListFooterComponent={ () => {
            return state.isLoadingMore ? <LoadIndicator/> : null;
        } }/>;
}

function ListItem( props: { item: Character } ) {
    const { item } = props;
    return (<View style={ Styles.item_container }>
        <Image style={ Styles.item_image }
               source={ { uri: item.image } }
               borderRadius={ 40 }/>
        <View style={ { width: 10 } }/>
        <Text style={ Styles.item_text }>{ item.name }</Text>
    </View>);
}

export function LoadIndicator( props: { style?: StyleProp<ViewStyle> } ) {
    const { style } = props;
    return <View style={ style }>
        <ActivityIndicator size={ "large" } color={ "black" }/>
    </View>
}

export function ErrorMessage( props: { error: string, style?: StyleProp<ViewStyle> } ) {
    const { error, style } = props;
    return <View style={ style }>
        <Text style={ [ Styles.item_text, { color: "red" } ] }>{ error }</Text>
    </View>
}

export default CharactersList;