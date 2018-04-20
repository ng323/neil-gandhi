import os
import csv

csvpath = os.path.join("election_data_1.csv")

voter_id = []
county = []
candidate = []
new_candidate = []
total_votes = []
percentage = []
individual = []
win = []
winner = []

with open(csvpath, newline="") as csvfile:
	csvreader = csv.reader(csvfile, delimiter=",")
	next(csvreader, None)
	for row in csvreader:

		voter_id.append(row[0])
		county.append(row[1])
		candidate.append(row[2])

for x in candidate:
	if x not in new_candidate:
		new_candidate.append(x)

for z in range(len(new_candidate)):
	individual.append(candidate.count(new_candidate[z]))
	percentage.append(individual[z]/len(voter_id)*100)



win = (int(individual.index(max(individual))))
print(win)


print(new_candidate[win])


#print(individual)
#print(percentage)
#print(new_candidate) 
#print(len(voter_id))
#print(candidate.count(new_candidate[0]))

print("Election Results")
print("------------------------------")
print("Total Votes: " + str(len(voter_id)))
print("------------------------------")
for r in range(len(new_candidate)):
	print(str(new_candidate[r]) + ": " + str(percentage[r]) + "%" + " " + str(individual[r]))
print("------------------------------")
print("Winner: " + str(new_candidate[win]))	
