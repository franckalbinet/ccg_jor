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
    CURRENT_COPING_MECHANISMS: "current_coping_mechanisms.json",
    STOPPED_COPING_MECHANISMS: "stopped_coping_mechanisms.json",
    EDUCATION: "education.json",
    ECO_CONTRIBUTORS: "eco_contributors.json",
    EXPENDITURES_CHILDREN: "expenditures_children.json",
    MILESTONES: "milestones.json"
  },
  LOOKUP_CODES: {
    GOVERNORATES: {1:"Irbid", 2:"Ajloun", 3:"Jarash", 4:"Amman", 5:"Zarqa", 6:"Madaba", 11:"Mafraq", 99:"Others"},
    POVERTY: {1:"High", 2:"Severe", 3:"Resilient"},
    HEAD: {1:"Father", 2:"Mother"},
    GENDER: {1:"Male", 2:"Female"},
    INCOME: {1:"Cash Assistance (UNICEF and UNHCR)", 2:"Food Voucher (WFP)", 5:"Paid labour", 99:"Other"},
    ECO_CONTRIBUTORS: {1:"Father",2:"Mother",3:"Other adult",4:"Child over 16",5:"Child under 16",6:"None"},
    EXPENDITURES: {1:"Rent", 2:"Utilities", 3:"Communications", 4:"Food", 5:"Education", 6:"Health care services [adults]",
                   7:"Medicine [adults]", 8:"Health care services [children]", 9:"Medicine [children]", 10:"Transportation",
                  11:"Debt payoff", 12:"Savings", 13:"Other children expenditures", 97:"Other"},
    EXPENDITURES_CHILDREN: {1: "Tuition fees", 2:"Transportation to school", 3:"School-related expenses", 4:"Transport to healthcare facilities",
                            5:"Doctors fees for children",6:"Children’s medicine",7:"Infant/children’s milk and food",
                            9:"Fresh foods",10:"Children’s clothes and shoes",11:"Diapers/sanitation products",
                            12:"Recreation and toys",13:"Infant needs (e.g. pram)",99:"No spending on these items"},
    COV_CHILD_EXP: {1:"Yes", 2:"No"},
    EXPENDITURES_CHILD_MOST: {1:"Education", 2:"Health", 3:"Food", 99:"Other"},
    LIVING_CONDITIONS: {1:"Yes", 2:"No, not at all"},
    BASIC_NEEDS: {1:"Significantly", 2:"Moderatly", 3:"Slightly", 4: "Not at all"},
    COPING_MECHANISMS: {1:"Reduce accomodation costs by any means",2:"Reducing food intake [portion size or nb. of meals]",
                        3:"Choosing less preferred but cheaper food options",4:"Receiving cash assistance from family members",
                        5:"Receiving humanitarian assistance from NGOs/CBOs",6:"Selling properties/assets",7:"Selling food voucher",8:"Working more than one job",
                        9:"Borrowing money",10:"Using your savings",11:"Asking for money ",12:"Dropping children out of school",13:"Let your children work [child labor]",
                        14: "Let your children ask for money",15:"Reduction of essential expenditure on health",16:"Reduction of essential expenditure on education",
                        17:"Immigrate to another country for residency",18:"Move back to the refugee camp",19:"Return to Syria",97:"Other"}
  }
});
