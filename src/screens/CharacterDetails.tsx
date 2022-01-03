import React, { useEffect, useState } from "react";
import Styles from "./Styles";
import Strings from "../strings";
import { ErrorMessage, LoadIndicator } from "./CharactersList";
import { gql, useQuery } from "@apollo/client";
import { FlatList, Image, Text, View } from "react-native";
import { RootStackScreenProps } from "../navigation/AppNavigator";
import { CharacterInfo, Episode } from "../entities";

interface InitialState {
    isLoading: boolean;
    info: CharacterInfo | undefined;
    errorMsg: string | undefined;
}

function CharacterDetails( { route }: RootStackScreenProps<"CharacterDetails"> ) {
    const { id } = route.params;
    const [ state, setState ] = useState<InitialState>({
        isLoading: true,
        info: undefined,
        errorMsg: undefined,
    });
    const QUERY = gql`
        query {
            character (id: ${ id }) {
                name
                status
                species
                gender
                    origin {
                      name
                      type
                    }
                image
                episode {
                  id
                  name
                  episode
                }
            } 
        }`;
    const { data, error } = useQuery(QUERY);

    useEffect(() => {
        if ( error ) {
            setErrorMessage();
        } else if ( data ) {
            setCharacterInfo();
        }
    }, [ data, error ]);

    const setErrorMessage = () => {
        setState(prevState => ({
            ...prevState,
            isLoading: false,
            errorMsg: error?.message,
        }));
    };

    const setCharacterInfo = () => {
        const resp: CharacterInfo = data.character;
        setState(prevState => ({
            ...prevState,
            isLoading: false,
            errorMsg: undefined,
            info: resp,
        }));
    };

    const keyExtractor = ( item: Episode, index: number ) => {
        return `${ index }-${ item.id }`
    };

    const renderItem = ( { item }: { item: Episode } ) => {
        return <ListItem item={ item }/>
    };

    const getLocation = () => {
        const origin = state.info!.origin;
        const type = (origin.type && origin.type.toLocaleLowerCase() !== "unknown") ? origin.type : undefined;
        const name = (origin.name && origin.name.toLocaleLowerCase() !== "unknown") ? origin.name : undefined;
        if ( type && name )
            return `${ type } - ${ name }`
        return type ?? name;
    };

    const getPersonalInfo = () => {
        const cInfo = state.info!;
        const species = (cInfo.species && cInfo.species.toLocaleLowerCase() !== "unknown") ? cInfo.species : undefined;
        const gender = (cInfo.gender && cInfo.gender.toLocaleLowerCase() !== "unknown") ? cInfo.gender : undefined;
        const status = (cInfo.status && cInfo.status.toLocaleLowerCase() !== "unknown") ? cInfo.status : undefined;
        let info = species;
        if ( info ) {
            if ( gender )
                info += `- ${ gender }`
            if ( status )
                info += `- ${ status }`
        } else if ( gender ) {
            info = gender;
            if ( status )
                info += `- ${ status }`
        } else {
            info = status;
        }
        return info;
    };

    if ( state.isLoading ) {
        return <LoadIndicator style={ Styles.indicator }/>
    } else if ( state.errorMsg ) {
        return <ErrorMessage style={ Styles.indicator }
                             error={ state.errorMsg }/>
    } else if ( state.info ) {
        const location = getLocation();
        const pInfo = getPersonalInfo();
        return (<View style={ Styles.container }>
            <View style={ Styles.info_header }>
                <Image style={ Styles.info_image }
                       source={ { uri: state.info.image } }
                       borderRadius={ 60 }/>
                <Text style={ [ Styles.info_text, { fontSize: 16 } ] }>{ state.info.name }</Text>
                { location && <Text style={ Styles.info_text }>{ location }</Text> }
                { pInfo && <Text style={ Styles.info_text }>{ pInfo }</Text> }
            </View>
            <View style={ Styles.container }>
                <View style={ Styles.info_list_header }>
                    <Text style={ Styles.info_list_title }>{ Strings.episodes }</Text>
                </View>
                <FlatList
                    data={ state.info.episode }
                    keyExtractor={ keyExtractor }
                    renderItem={ renderItem }
                    ItemSeparatorComponent={ () => {
                        return <View style={ Styles.item_divider }/>
                    } }/>
            </View>
        </View>);
    }
    return null;
}

function ListItem( props: { item: Episode } ) {
    const { item } = props;
    return (<View style={ { padding: 10 } }>
        <Text style={ Styles.item_text }>{ item.episode }</Text>
        <Text style={ Styles.item_text }>{ item.name }</Text>
    </View>);
}

export default CharacterDetails;