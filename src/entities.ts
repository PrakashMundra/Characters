export interface Characters {
    info: {
        pages: number,
    },
    results: Character[];
}

export interface Character {
    id: string;
    name: string;
    image: string;
}

export interface CharacterInfo {
    name: string;
    status: string;
    species: string;
    gender: string;
    origin: Location;
    image: string;
    episode: Episode[];
}

export interface Location {
    name: string;
    type: string;
    dimension: string;
}

export interface Episode {
    id: string;
    name: string;
    episode: string;
}