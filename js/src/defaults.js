/*  Default/config values
    Stores all application configuration.
*/
Vis.DEFAULTS = _.extend(Vis.DEFAULTS, {
  FAKED_DATASET: false,
  DATASETS: {
    CHILDREN: "children.json",
    HOUSEHOLDS: "households.json",
    OUTCOMES: "outcomes.json"
  },
  LOOKUP_CODES: {
    GOVERNORATES: {1:"Irbid", 2:"Ajloun", 3:"Jarash", 4:"Amman", 5:"Zarqa", 6:"Madaba", 11:"Mafraq", 99:"Others"}
  }
});
