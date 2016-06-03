import { Http } from '@angular/http';
import 'ScrollMagic';
export declare class OsbFilmTvGuide {
    http: Http;
    isLoading: boolean;
    modalShowing: boolean;
    storagePrefix: string;
    baseUrl: string;
    apiKey: string;
    section: string;
    searchTerm: string;
    pageNumber: number;
    feedData: any[];
    modalData: {};
    user: {
        favourites: any[];
        watched: any[];
    };
    sections: any[];
    constructor(http: Http);
    addFavourite(id: any): void;
    checkFavourites(id: any): void;
    addWatched(id: any): void;
    checkWatched(id: any): void;
    closeModal(): void;
    getDetails(id: any): void;
    setDetails(data: any): void;
    updateData(data: any): void;
    getMoreData(): void;
    getData(section: any, searchTerm: any): void;
    setData(data: any): void;
}
