install.packages("dplyr")
install.packages("plyr")
install.packages("tidyr")
install.packages("ggplot2")
install.packages("RColorBrewer")
install.packages("rjson")
library(rjson)
library(dplyr)
library(tidyr)
library(RColorBrewer)
library(ggplot2)
# library(gridExtra) -- to assess: grid.arrange(x, y, ncol=2)


# import
pdm1 <- read.table("./combined_3_rounds/pdm1.csv", sep = ",", header = TRUE, quote = "")
pdm2 <- read.table("./combined_3_rounds/pdm2.csv", sep = ",", header = TRUE, quote = "")
pdm3 <- read.table("./combined_3_rounds/pdm3.csv", sep = ",", header = TRUE, quote = "")

#pdm1 <- read.table("./data/pdm1.csv", sep = ",", header = TRUE, quote = "")
#pdm2 <- read.table("./data/pdm2.csv", sep = ",", header = TRUE, quote = "")
#pdm3 <- read.table("./data/pdm3.csv", sep = ",", header = TRUE, quote = "")
#pdm3_bis <- read.table("./data/pdm_combined.csv", sep = ",", header = TRUE, quote = "")


# dataset dims
dim(pdm1) # 500 120 
dim(pdm2) # 500 191
dim(pdm3) # 499 190
# dim(pdm3_bis) # 431 190


# common variables
col_pdm1 <- names(pdm1)
col_pdm2 <- names(pdm2)
col_pdm3 <- names(pdm3)
# col_pdm3_bis <- names(pdm3_bis)

# pairwise
length(intersect(col_pdm1, col_pdm2)) # have 119 in common
length(intersect(col_pdm1, col_pdm3)) # have 118 in common
length(intersect(col_pdm2, col_pdm3)) # have 190 in common

# length(intersect(col_pdm1, col_pdm3bis)) # have 118 in common
# length(intersect(col_pdm2, col_pdm3_bis)) # have 190 in common

# all 3
length(intersect(intersect(col_pdm1, col_pdm2), col_pdm3)) # have 118 in common
#length(intersect(intersect(col_pdm1, col_pdm2), col_pdm3bis)) # have 118 in common

# common columns
comm_col <- intersect(intersect(col_pdm1, col_pdm2), col_pdm3) 
# comm_col_bis <- intersect(intersect(col_pdm1, col_pdm2), col_pdm3_bis) 

# subset pdms for commun variables only
pdm1_com <- pdm1[comm_col]
pdm2_com <- pdm2[comm_col]
pdm3_com <- pdm3[comm_col]

#pdm1_com_bis <- pdm1[comm_col_bis]
#pdm2_com_bis <- pdm2[comm_col_bis]
#pdm3_com_bis <- pdm3[comm_col_bis]

# tagging by rounds
pdm1_com$ROUND <- 1
pdm2_com$ROUND <- 2
pdm3_com$ROUND <- 3

#pdm1_com_bis$ROUND <- 1
#pdm2_com_bis$ROUND <- 2
#pdm3_com_bis$ROUND <- 3


# merging/appending data frames
pdm <- rbind(pdm1_com, pdm2_com)
pdm <- rbind(pdm, pdm3_com)

#pdm_bis <- rbind(pdm1_com_bis, pdm2_com_bis)
#pdm_bis <- rbind(pdm_bis, pdm3_com_bis)

# get household UNHCR File n° present in all 3 rounds
ids_round1 <- unique(pdm[pdm$ROUND == 1,c("M2")])
ids_round2 <- unique(pdm[pdm$ROUND == 2,c("M2")])
ids_round3 <- unique(pdm[pdm$ROUND == 3,c("M2")])
length(intersect(intersect(ids_round1,ids_round2), ids_round3)) # get 208 only

# get household Mobile n° present in all 3 rounds
mobiles_round1 <- unique(pdm[pdm$ROUND == 1,c("M3")])
mobiles_round2 <- unique(pdm[pdm$ROUND == 2,c("M3")])
mobiles_round3 <- unique(pdm[pdm$ROUND == 3,c("M3")])
length(intersect(intersect(mobiles_round1,mobiles_round2), mobiles_round3)) # get 285 only

#ids_round1_bis <- unique(pdm_bis[pdm_bis$ROUND == 1,c("M2")])
#ids_round2_bis <- unique(pdm_bis[pdm_bis$ROUND == 2,c("M2")])
#ids_round3_bis <- unique(pdm_bis[pdm_bis$ROUND == 3,c("M2")])
#length(intersect(intersect(ids_round1_bis,ids_round2_bis), ids_round3_bis)) # get 363 only

# get household Serial present in all 3 rounds
serials_round1 <- unique(pdm[pdm$ROUND == 1,c("Serial")])
serials_round2 <- unique(pdm[pdm$ROUND == 2,c("Serial")])
serials_round3 <- unique(pdm[pdm$ROUND == 3,c("Serial")])


length(intersect(intersect(serials_round1,serials_round2), serials_round3)) # get 431 only
common_serials <- intersect(intersect(serials_round1,serials_round2), serials_round3)

#serials_round1_bis <- unique(pdm_bis[pdm_bis$ROUND == 1,c("Serial")])
#serials_round2_bis <- unique(pdm_bis[pdm_bis$ROUND == 2,c("Serial")])
#serials_round3_bis <- unique(pdm_bis[pdm_bis$ROUND == 3,c("Serial")])
#length(intersect(intersect(serials_round1_bis,serials_round2_bis), serials_round3_bis)) # get 429 only
# IDEM THAN WITH DEFAULT PDM3 FILE !!

# get cleaned data - common households over 3 rounds with same variables
data <- pdm[pdm$Serial %in% common_serials,]

# switching to dplyr now
data <- tbl_df(data)

# PREPARE CHILDREN DATASET - PROFILE (select last round only)
data_round3 <- filter(data, ROUND == 3) # using round 3 as reference
# write a function for that, please !
c1 <- select(data_round3, Serial, D4A.1:D4E.1)
names(c1) <- c("hh","gender","age", "edu_rec", "edu_type", "work")
c2 <- select(data_round3, Serial, D4A.2:D4E.2)
names(c2) <- c("hh","gender","age", "edu_rec", "edu_type", "work")
c3 <- select(data_round3, Serial, D4A.3:D4E.3)
names(c3) <- c("hh","gender","age", "edu_rec", "edu_type", "work")
c4 <- select(data_round3, Serial, D4A.4:D4E.4)
names(c4) <- c("hh","gender","age", "edu_rec", "edu_type", "work")
c5 <- select(data_round3, Serial, D4A.5:D4E.5)
names(c5) <- c("hh","gender","age", "edu_rec", "edu_type", "work")
c6 <- select(data_round3, Serial, D4A.6:D4E.6)
names(c6) <- c("hh","gender","age", "edu_rec", "edu_type", "work")
c7 <- select(data_round3, Serial, D4A.7:D4E.7)
names(c7) <- c("hh","gender","age", "edu_rec", "edu_type", "work")
c8 <- select(data_round3, Serial, D4A.8:D4E.8)
names(c8) <- c("hh","gender","age", "edu_rec", "edu_type", "work")
c9 <- select(data_round3, Serial, D4A.9:D4E.9)
names(c9) <- c("hh","gender","age", "edu_rec", "edu_type", "work")

children <- bind_rows(c1,c2,c3,c4,c5,c6,c7,c8,c9)



# remove rows where age = "U" [code for NA in data provided]
#children <- children[!is.na(children$age),]
children <- filter(children, age != "U")
children <- mutate(children, age = as.numeric(age)) # coerce as.numeric

# sort by hh (id)
children <- arrange(children, hh)

# ceiling age < 1 to round them to 1 -- coding is wierd anyway: 0.11, 0.6, ...
children <- mutate(children, age = ceiling(age))


# export to json
children_json <- toJSON(unname(split(children, 1:nrow(children))))
# cat(test)

sink("children.json")
cat(children_json)
sink()


# PREPARE EDUCATION DATASET 
# write a function for that, please !
c1 <- select(data, Serial, D4A.1:D4E.1, ROUND, D5, M4)
names(c1) <- c("hh","gender","age", "edu_rec", "edu_type", "work", "round", "head", "pov_line")
c2 <- select(data, Serial, D4A.2:D4E.2, ROUND, D5, M4)
names(c2) <- c("hh","gender","age", "edu_rec", "edu_type", "work", "round", "head", "pov_line")
c3 <- select(data, Serial, D4A.3:D4E.3, ROUND, D5, M4)
names(c3) <- c("hh","gender","age", "edu_rec", "edu_type", "work", "round", "head", "pov_line")
c4 <- select(data, Serial, D4A.4:D4E.4, ROUND, D5, M4)
names(c4) <- c("hh","gender","age", "edu_rec", "edu_type", "work", "round", "head", "pov_line")
c5 <- select(data, Serial, D4A.5:D4E.5, ROUND, D5, M4)
names(c5) <- c("hh","gender","age", "edu_rec", "edu_type", "work", "round", "head", "pov_line")
c6 <- select(data, Serial, D4A.6:D4E.6, ROUND, D5, M4)
names(c6) <- c("hh","gender","age", "edu_rec", "edu_type", "work", "round", "head", "pov_line")
c7 <- select(data, Serial, D4A.7:D4E.7, ROUND, D5, M4)
names(c7) <- c("hh","gender","age", "edu_rec", "edu_type", "work", "round", "head", "pov_line")
c8 <- select(data, Serial, D4A.8:D4E.8, ROUND, D5, M4)
names(c8) <- c("hh","gender","age", "edu_rec", "edu_type", "work", "round", "head", "pov_line")
c9 <- select(data, Serial, D4A.9:D4E.9, ROUND, D5, M4)
names(c9) <- c("hh","gender","age", "edu_rec", "edu_type", "work", "round", "head", "pov_line")

edu <- bind_rows(c1,c2,c3,c4,c5,c6,c7,c8,c9)
edu <- filter(edu, age != "U")
edu <- select(edu, hh, gender, age, edu_rec, round, head, pov_line)

edu <- mutate(edu, age = as.numeric(age)) # coerce as.numeric

# ceiling age < 1 to round them to 1 -- coding is wierd anyway: 0.11, 0.6, ...
edu <- mutate(edu, age = ceiling(age))

# export to json
edu_json <- toJSON(unname(split(edu, 1:nrow(edu))))

sink("education.json")
cat(edu_json)
sink()



# PREPARE HOUSEHOLDS DATASET (hh: Serial, D5: head, M4: pov_line, D6: has_dis, S2: location)
households <- select(data_round3, Serial, D5, M4, D6, S2)
names(households) <- c("hh","head","pov_line", "has_dis", "loc")
# merge all others (7,8,9,10) to 99
households$loc[households$loc %in% c(7,8,9,10, 12)] <- 99

households_json <- toJSON(unname(split(households, 1:nrow(households))))
sink("households.json")
cat(households_json)
sink()


# PREPARE OUTCOMES DATASET (hh: Serial, round: ROUND, imp: Q20, needs: Q17)
outcomes <- select(data, Serial, ROUND, Q20, Q17, Q16)
# merge Q16 
# (1,2,3) -> 1 [Education expenditures]
# (4,5,6) -> 2 [Health cares expenditures]
# (7,8,9) -> 3 [Food expenditures]
# (10, 11, 12, 13, 14) -> 99 [Other expenditures]
outcomes$Q16 <- as.numeric(levels(outcomes$Q16))[outcomes$Q16]
outcomes$Q16[outcomes$Q16 %in% c(1,2,3)] <- 1
outcomes$Q16[outcomes$Q16 %in% c(4,5,6)] <- 2
outcomes$Q16[outcomes$Q16 %in% c(7,8,9)] <- 3
outcomes$Q16[outcomes$Q16 %in% c(0, 10,11,12,13,14)] <- 99

names(outcomes) <- c("hh","round","imp", "needs", "exp_child_most")
outcomes_json <- toJSON(unname(split(outcomes, 1:nrow(outcomes))))
sink("outcomes.json")
cat(outcomes_json)
sink()


# PREPARE MAIN SOURCES OF INCOME DATASET [1: UN cash assistance, 2: WFP voucher, 5: Paid labour]
sources_income <- select(data, Serial, ROUND, D9)
split_D9 <- strsplit(as.character(sources_income$D9), split = " ")
serial <- rep(sources_income$Serial, sapply(split_D9, length))
round <- rep(sources_income$ROUND, sapply(split_D9, length))
sources_income_single <- data.frame(serial = serial, round = round, D9 = unlist(split_D9))
sources_income_single <- tbl_df(sources_income_single)
# merge  3,4,6,7,97 to 99 [other]

sources_income_single$D9 <- as.numeric(levels(sources_income_single$D9))[sources_income_single$D9]
sources_income_single$D9[sources_income_single$D9 %in% c(3,4,6,7,97)] <- 99

#sources_income_single %>% group_by(round, D9) %>% summarise(perc = round((n() / 431)*100))

names(sources_income_single) <- c("hh","round","income")
incomes_json <- toJSON(unname(split(sources_income_single, 1:nrow(sources_income_single))))
sink("incomes.json")
cat(incomes_json)
sink()


# PREPARE ECONOMIC CONTRIBUTOR DATASET D8 [1: Father, 2: Mother, 3: Other adult, 4: Child over 16, 5: Child under 16, 6: None]
eco_contrib <- select(data, Serial, ROUND, D8)
split_D8 <- strsplit(as.character(eco_contrib$D8), split = " ")
serial <- rep(eco_contrib$Serial, sapply(split_D8, length))
round <- rep(eco_contrib$ROUND, sapply(split_D8, length))
eco_contrib_single <- data.frame(serial = serial, round = round, D8 = unlist(split_D8))
eco_contrib_single <- tbl_df(eco_contrib_single)

eco_contrib_single$D8 <- as.numeric(levels(eco_contrib_single$D8))[eco_contrib_single$D8]
eco_contrib_single$D8[eco_contrib_single$D8 %in% c(0)] <- 6

names(eco_contrib_single) <- c("hh","round","eco_contrib")
eco_contrib_json <- toJSON(unname(split(eco_contrib_single, 1:nrow(eco_contrib_single))))
sink("eco_contributors.json")
cat(eco_contrib_json)
sink()



# PREPARE EXPENDITURES DATASET 
expenditures <- select(data, Serial, ROUND, Q12)
split_Q12 <- strsplit(as.character(expenditures$Q12), split = " ")

serial <- rep(expenditures$Serial, sapply(split_Q12, length))
round <- rep(expenditures$ROUND, sapply(split_Q12, length))
expenditures_single <- data.frame(serial = serial, round = round, Q12 = unlist(split_Q12))
expenditures_single <- tbl_df(expenditures_single)
# merge  0 to 97 [other]
expenditures_single$Q12 <- as.numeric(levels(expenditures_single$Q12))[expenditures_single$Q12]
expenditures_single$Q12[expenditures_single$Q12 %in% c(0)] <- 97

names(expenditures_single) <- c("hh","round","exp")
expenditures_json <- toJSON(unname(split(expenditures_single, 1:nrow(expenditures_single))))
sink("expenditures.json")
cat(expenditures_json)
sink()

# PREPARE CURRENTLY USED COPING MECHANISMS - Q23
current_coping <- select(data, Serial, ROUND, Q23)
split_Q23 <- strsplit(as.character(current_coping$Q23), split = " ")
serial <- rep(current_coping$Serial, sapply(split_Q23, length))
round <- rep(current_coping$ROUND, sapply(split_Q23, length))
current_coping_single <- data.frame(serial = serial, round = round, Q23 = unlist(split_Q23))
current_coping_single <- tbl_df(current_coping_single)
# merge  0,21 to 97 [other]
current_coping_single$Q23 <- as.numeric(levels(current_coping_single$Q23))[current_coping_single$Q23]
current_coping_single$Q23[current_coping_single$Q23 %in% c(0,21)] <- 97

names(current_coping_single) <- c("hh","round","curr_cop")
current_coping_json <- toJSON(unname(split(current_coping_single, 1:nrow(current_coping_single))))
sink("current_coping_mechanisms.json")
cat(current_coping_json)
sink()

# PREPARE STOPPED COPING MECHANISMS - Q25
stopped_coping <- select(data, Serial, ROUND, Q25)
split_Q25 <- strsplit(as.character(stopped_coping$Q25), split = " ")
serial <- rep(stopped_coping$Serial, sapply(split_Q25, length))
round <- rep(stopped_coping$ROUND, sapply(split_Q25, length))
stopped_coping_single <- data.frame(serial = serial, round = round, Q25 = unlist(split_Q25))
stopped_coping_single <- tbl_df(stopped_coping_single)

# merge  0, 20, 21 to 97 [other]
stopped_coping_single$Q25 <- as.numeric(levels(stopped_coping_single$Q25))[stopped_coping_single$Q25]
stopped_coping_single$Q25[stopped_coping_single$Q25 %in% c(0,20,21, 99)] <- 97

names(stopped_coping_single) <- c("hh","round","stop_cop")
stopped_coping_json <- toJSON(unname(split(stopped_coping_single, 1:nrow(stopped_coping_single))))
sink("stopped_coping_mechanisms.json")
cat(stopped_coping_json)
sink()


# # households cutting back on education reduction - Q25 item 12
has12 <- function(list) { "12" %in% strsplit(as.character(list), split = " ")[[1]]}
criteria <- sapply(as.character(data$Q25), has12) 
#View(data[t,"Q25"])
notCuttingEdu <- data[criteria,]
byRound <- group_by(notCuttingEdu, ROUND)
summarise(byRound, count = n())
# it reduces over
#   ROUND count
#   (dbl) (int)
#1      1    36
#2      2    31
#3      3    20




# visualizing contingency tables -- use case of currentcoping mechanisms 
coping_current <- select(data, Serial, ROUND, Q23)
split_current <- strsplit(as.character(coping_current$Q23), split = " ")

serial <- rep(coping_current$Serial, sapply(split_current, length))
round <- rep(coping_current$ROUND, sapply(split_current, length))

coping_current_single <- data.frame(serial = serial, round = round, Q23 = unlist(split_current))
coping_current_single$Q23 <- as.character(coping_current_single$Q23)
coping_current_single_1_to_16 <- filter(coping_current_single, Q23 %in% as.character(1:16))
by_round_Q23 <- group_by(coping_current_single_1_to_16, round, Q23)
count_round_Q23 <- summarise(by_round_Q23, z = n())

# find proper colour classes 
hist(count_round_Q23$z, breaks=20)
# 0-50 50-100 100-200 200-300 300 and more

count_round_Q23$class <- cut(count_round_Q23$z, c(0, 5, 10, 25, 50, 100, 200, 300, 400, 500))

# plot
display.brewer.all()

contingency_Q23_plot <- ggplot(count_round_Q23, aes(round, Q23))
contingency_Q23_plot + geom_tile(aes(fill=count_round_Q23$class)) + theme_minimal() + scale_fill_manual(values = brewer.pal(9,"OrRd")) + scale_y_discrete(limits=as.character(1:16)) 

contingency_Q23_plot_para <- ggplot(count_round_Q23, aes(round, z, color = as.factor(Q23)))
contingency_Q23_plot_para + geom_point() + geom_line()  + theme_minimal() + scale_x_discrete(limits=as.character(1:3)) 

# visualizing contingency tables -- use case of currentcoping mechanisms 
coping_avoided <- select(data, Serial, ROUND, Q25)
split_avoided <- strsplit(as.character(coping_avoided$Q25), split = " ")
serial <- rep(coping_avoided$Serial, sapply(split_avoided, length))
round <- rep(coping_avoided$ROUND, sapply(split_avoided, length))

coping_avoided_single <- data.frame(serial = serial, round = round, Q25 = unlist(split_avoided))
coping_avoided_single$Q25 <- as.character(coping_avoided_single$Q25)
coping_avoided_single_1_to_16 <- filter(coping_avoided_single, Q25 %in% as.character(1:16))
by_round_Q25 <- group_by(coping_avoided_single_1_to_16, round, Q25)
count_round_Q25 <- summarise(by_round_Q25, z = n())

# find proper colour classes 
hist(count_round_Q25$z, breaks=20)
# 0-50 50-100 100-200 200-300 300 and more

count_round_Q25$class <- cut(count_round_Q25$z, c(0, 5, 10, 20, 40, 80, 100, 150))

# plot
display.brewer.all()

contingency_Q25_plot <- ggplot(count_round_Q25, aes(round, Q25))
contingency_Q25_plot + geom_tile(aes(fill=count_round_Q25$class)) + theme_minimal() + scale_fill_manual(values = brewer.pal(7,"Blues")) + scale_y_discrete(limits=as.character(1:16)) 

# as // coordinates
contingency_Q25_plot_para <- ggplot(count_round_Q25, aes(round, z, color = as.factor(Q25)))
contingency_Q25_plot_para + geom_point() + geom_line()  + theme_minimal() + scale_x_discrete(limits=as.character(1:3)) 




# visualizing child focused expenses
children_expenses <- select(data, Serial, Q15A, Q15B, Q15C, Q15D, ROUND)
children_expenses_gath <- gather(children_expenses, type, amount, -Serial, -ROUND, na.rm = TRUE)
children_expenses_gath$type <- substr(children_expenses_gath$type, 4,5)

by_round_type <- group_by(children_expenses_gath, ROUND, type)
sum_children_expenses_by_type_round <- summarise(by_round_type, sum = sum(amount))

children_exp_plot <- ggplot(sum_children_expenses_by_type_round, aes(ROUND, sum, color = type))
children_exp_plot + geom_point() + geom_line() + scale_x_discrete() + theme_minimal() + scale_color_brewer(palette = "Set1")



# 78,854 spent in total over the 3 rounds
# 1504 children
# 52.43 USD / children over the 3 months => 87% of what have been distributed captured here



# visualizing overall life improvement by # of children
# D4 is number of children

hh_improved_all <- select(data, D4, Q20, ROUND, Serial)

hh_improved <- filter(select(data, D4, Q20, ROUND, Serial), Q20 == 1)
hh_improved_yes <- filter(select(data, D4, Q20, ROUND, Serial), Q20 == 1)
get_total_children_round <- function(round, nb_children) {dim(filter(hh_improved_all, D4 == nb_children , ROUND == round))[1]}
by_round_nb_children <- summarise(group_by(hh_improved, ROUND, D4), perc = n() / get_total_children_round(ROUND, D4)*100)
by_round_nb_children <- filter(by_round_nb_children, D4 != 0)

round_children_plot <- ggplot(by_round_nb_children, aes(D4, perc, color = as.factor(ROUND)))
round_children_plot + geom_point() + geom_line()  + theme_minimal() + scale_color_brewer(palette = "Set1") +scale_x_discrete(limits=as.character(1:9))


## DATA VIS.
# testing 3 var. plotting through jittering
ggplot(pdm, aes(factor(pdm$ROUND), factor(pdm$Q17))) + geom_jitter(aes(colour = factor(M4), alpha = 1/10)) + theme_minimal()

# improving living condition over rounds
imp_liv_cond <- pdm[pdm$Q20 != 0, c("Q20", "ROUND")]
ggplot(imp_liv_cond, aes(factor(imp_liv_cond$ROUND), fill=factor(imp_liv_cond$Q20))) + geom_bar(position = "fill", width = 0.6, size = 0.2) + coord_flip() + theme_minimal() + scale_fill_manual(values = c("#377eb8", "#e41a1c"), name = "Improved overall living condition", labels = c("Yes", "No")) + xlab("Round") + ylab("") + scale_y_continuous(labels = scales::percent)

# cover basic needs
cover_basic_needs <- pdm[pdm$Q17 != 0, c("Q17", "ROUND")]
ggplot(cover_basic_needs, aes(factor(cover_basic_needs$ROUND), fill=factor(cover_basic_needs$Q17)))  + geom_bar(position = "fill", width = 0.6, size = 0.2) + coord_flip() + theme_minimal() + scale_fill_manual(values = rev(brewer.pal(4,"PuBu")), name = "How far does it help covering basic needs ?", labels = c("Significantly", "Moderatly", "Slightly", "Not at all")) + xlab("Round") + ylab("") + scale_y_continuous(labels = scales::percent)

