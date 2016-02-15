/*  Default/config values
    Stores all application configuration.
*/
Vis.DEFAULTS = _.extend(Vis.DEFAULTS, {
  FAKED_DATASET: false,
  DATASETS: {
    CHILDREN: "children.json",
    HOUSEHOLDS: "households.json",
    OUTCOMES: "outcomes.json",
    TEMPLATES: "templates.json",
    INCOMES: "incomes.json",
    EXPENDITURES: "expenditures.json",
    MILESTONES: "milestones.json"
  },
  LOOKUP_CODES: {
    GOVERNORATES: {1:"Irbid", 2:"Ajloun", 3:"Jarash", 4:"Amman", 5:"Zarqa", 6:"Madaba", 11:"Mafraq", 99:"Others"},
    POVERTY: {1:"High", 2:"Severe"},
    HEAD: {1:"Father", 2:"Mother"},
    GENDER: {1:"Male", 2:"Female"},
    INCOME: {1:"UN cash assistance", 2:"WFP voucher", 5:"Paid labour", 99:"Other"},
    EXPENDITURES: {1:"Rent", 2:"Utilities", 3:"Communications", 4:"Food", 5:"Education", 6:"Health care services [adults]",
                   7:"Medicine [adults]", 8:"Health care services [children]", 9:"Medicine [children]", 10:"Transportation",
                  11:"Debt payoff", 12:"Savings", 13:"Other children expenditures", 97:"Other"},
    EXPENDITURES_CHILD_MOST: {1:"Education", 2:"Health", 3:"Food", 99:"Other"},
  }
});
