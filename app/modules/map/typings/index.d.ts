export module map {
  interface AutocompleteResponse {
    predictions: AutocompletePredictions[];
  }

  interface AutocompletePredictions {
    description: string;
    place_id: string;
  }
}
