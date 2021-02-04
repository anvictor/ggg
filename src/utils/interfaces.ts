



export interface IUser {
    name: string;
    email: string;
}

export interface IGetRooms {
    id: string;
    name: string;
    isLoading: boolean;
}

export interface IGetPaints {
    id: string;
    name: string;
}

export interface IRoomsCard {
    id: string;
    name: string;
    isLoading: boolean;
}

interface IHistoryLocationState {
    title: string;
    room_id:string;
}
interface IHistoryLocation {
    state: IHistoryLocationState;
}
export interface IHistoryRoomsItem {
    location: IHistoryLocation;

}

export interface Ilimit{
    x: number | "insideIsland" | "outesideIsland" | "finishIsland";
    z: number | "insideIsland" | "outesideIsland" | "finishIsland";
  };

export interface INormalizedNames{
    roof: string[];
    walls: string[];
    windows: string[];
    doors: string[];
    window_glasses: string[];
    floor: string[];
}

export interface vector3data{
    x: number;
    y: number;
    z: number;
  };




