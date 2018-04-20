import os
import csv

csvpath = os.path.join("budget_data_1.csv")

date = []
revenue = []
total_revenue = []
change = []
mean = []
increase = []
decrease = []

with open(csvpath, newline="") as csvfile:
	csvreader = csv.reader(csvfile, delimiter=",")
	next(csvreader, None)
	for row in csvreader:

		date.append(row[0])
		revenue.append(row[1])

	x = 0
	for numbers in revenue:
		x = x + int(numbers)

	#print(len(date))
	
	total_revenue.append(x)
	#print(total_revenue)

	initial = 0
	for y in range(len(revenue)-1):
		delta = int(revenue[(initial + 1)]) - int(revenue[(initial)])
		change.append(delta)
		initial = initial + 1

	#print(change)

	mean.append(sum(change)/len(change))
	#print(mean)

	increase.append(max(change))
	#print(increase)

	decrease.append(min(change))
	#print(decrease)

	print("Total Months: " + str(len(date)))
	print("Total Revenue: " + str(total_revenue))
	print("Average Revenue Change: " + str(mean))
	print("Greatest Increase in Revenue: " + str(increase))
	print("Greatest Decrease in Revenue: " + str(decrease))


	output_path = os.path.join('output', 'new.csv')

	with open(output_path, 'w', newline='') as csvfile:

		 csvwriter = csv.writer(csvfile, delimiter=',')
		 csvwriter.writerow(["Total Months: " + str(len(date))])
		 csvwriter.writerow(["Total Revenue: " + str(total_revenue)])
		 csvwriter.writerow(["Average Revenue Change: " + str(mean)])
		 csvwriter.writerow(["Greatest Increase in Revenue: " + str(increase)])
		 csvwriter.writerow(["Greatest Decrease in Revenue: " + str(decrease)])
