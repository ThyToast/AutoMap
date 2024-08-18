export module map {
  interface AutocompleteResponse {
    predictions: AutocompletePredictions[];
  }

  interface AutocompletePredictions {
    description: string;
    place_id: string;
    isStored?: boolean;
  }

  interface LocationDetailedResponse {
    result: {
      geometry: {
        location: {
          lat: number;
          lng: number;
        };
        viewport: {
          northeast: {
            lat: number;
            lng: number;
          };
          southwest: {
            lat: number;
            lng: number;
          };
        };
      };
    };
  }
}
